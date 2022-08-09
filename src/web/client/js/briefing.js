function updateBriefing(briefing) {
    console.log("briefing!")
    console.log(briefing)

    const mapElem = document.querySelector("#map")
    document.body.append(mapElem)
    const brief = document.querySelector("#briefing")
    brief.innerHTML = ``

    briefing.elements.forEach(element => {
        if (element.type == "map") {
            addElement(`<div id="map-here"></div>`)
            const mapHere = document.querySelector("#map-here")
            mapHere.parentNode.insertBefore(mapElem, mapHere.nextSibling)
        }
        else if (element.type == "header") {
            addElement(`<h4 class="header">${element.args.text}</h4>`)
        }
        else if (element.type == "text") {
            if (element.args.centered) addElement(`<p class="textblock centered">${element.args.text}</p>`)
            else addElement(`<p class="textblock">${element.args.text}</p>`)
        }
    })
}

function addElement(text) {
    const template = document.createElement("template")
    template.innerHTML = text.trim()
    const brief = document.querySelector("#briefing")
    brief.appendChild(template.content.firstElementChild)
}

function initMap() {
    const map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 7,
        maxZoom: 12,
        minZoom: 6,
        center: { lat: 45.746, lng: 34.1555 },
        disableDefaultUI: true,
        scrollwheel: true,
        gestureHandling: "greedy",
        zoomControl: false,
        clickableIcons: false,
        mapTypeId: "terrain",
        styles: mapStyles
    })

    

    // 2 markers 1nm or 1,852m apart for measuring pixels.
    const ruler1 = new google.maps.Marker({ map, position: {lat: 45.746, lng: 34.1555}, icon: "/assets/blank.png" })
    const ruler2 = new google.maps.Marker({ map, position: {lat: 45.746, lng: 34.1793405}, icon: "/assets/blank.png" })

    // Wait a second to let the map finish loading.
    setTimeout(() => {
        map.addListener("center_changed", () => { updateMap() })
        map.addListener("zoom_changed", () => { updateMap() })
        updateMap()
    }, 100)

    // Toggle map elements
    let showOrbits = true
    document.addEventListener("keydown", event => {
        if (event.key.toLowerCase() == "o") {
            coalitions.forEach(coalition => {
                miz.groups[coalition].forEach(group => {
                    if (group.task != "AWACS" && group.task != "Refueling") return
                    if (showOrbits == true) {
                        flightPath[group.name].setMap(undefined)
                        $(".aircraft").fadeOut(300)
                        $(".aircraft-label").fadeOut(300)
                    }
                    else {
                        flightPath[group.name].setMap(map)
                        $(".aircraft").fadeIn(300)
                        $(".aircraft-label").fadeIn(300)
                    }
                })
            })
            if (showOrbits) showOrbits = false
            else showOrbits = true
        }
    })




    const waitMiz = setInterval(() => {
        if (miz) {
            clearInterval(waitMiz)
            populateMap()
        }
    }, 500)

    function populateMap() {
        const coalitions = ["red", "blue"]
        const flightPath = {}

        // Bullseyes, blue & red.
        createHTMLMapMarker({
            map, position: miz.bullseyes.blue.loc,
            html: `<div class="bullseye-1 bullseye-blue map-item"></div><div class="bullseye-2 bullseye-blue map-item"></div><div class="bullseye-3 bullseye-blue map-item"></div>`
        })
        createHTMLMapMarker({
            map, position: miz.bullseyes.red.loc,
            html: `<div class="bullseye-1 bullseye-red map-item"></div><div class="bullseye-2 bullseye-red map-item"></div><div class="bullseye-3 bullseye-red map-item"></div>`
        })

        // Groups / aircraft.
        coalitions.forEach(coalition => {
            miz.groups[coalition].forEach(group => {
                if (group.type == "ground") {
                    // Get name for dev stuff.
                    // group.units.forEach(unit => {
                    //     console.log(`${unit.name} - ${unit.type}`)
                    // })
                    // ================

                    if (group.name.startsWith("AIRPORT")) {
                        let airport = group.name.replace("AIRPORT ", "")
                        let html = `<div class="airport airport-${coalition} map-item" data-airport="${airport}"></div>`
                        createHTMLMapMarker({ map, html, position: group.loc })
                    }
                    if (group.hiddenOnMFD == "true") return
                    // if (group.hiddenOnMFD == "true") return
                    let ring = null
                    group.units.forEach(unit => {
                        if (unit.ring != null) ring = unit.ring
                    })

                    let html = `<img src="${group.units[0].icon}" class="sam icon-${coalition} map-item" /><div class="sam-label map-item">${group.units[0].short}</div>`
                    if (ring != null) html = `<img src="${group.units[0].icon}" class="sam icon-${coalition} map-item" /><div class="sam-ring map-item" data-size="${ring}"></div><div class="sam-label map-item" style="z-index: ${ring};">${group.units[0].short}</div>`
                    
                    createHTMLMapMarker({ map, html, position: group.loc })
                }
                else if (group.type == "aircraft") {
                    if (group.name == "Falcon-1") {
                        // console.log(group)
                        let path = []
                        group.route.forEach(waypoint => {
                            if (!waypoint || waypoint.id <= 1) return
                            path.push(waypoint.loc)
                            let html = `<div class="waypoint map-item" data-label="${waypoint.id - 1}"></div>`
                            createHTMLMapMarker({ map, html, position: waypoint.loc })
                        })
                        flightPath[group.name] = new google.maps.Polyline({
                            path, strokeColor: "#FFF", strokeWeight: 0.7
                        })
                        flightPath[group.name].setMap(map)
                    }
                    // Racetrack aircraft
                    if (group.task == "Refueling" || group.task == "AWACS") {
                        if (coalition != "blue") return
                        console.log(group)
                        let path = []
                        group.route.forEach(waypoint => {
                            if (!waypoint || waypoint.id <= 0) return
                            if (!group.route[2]) return
                            path.push(waypoint.loc)
                            if (waypoint.id == 1) {
                                let angle = google.maps.geometry.spherical.computeHeading(waypoint.loc, group.route[2].loc)
                                let html = `<img src="${group.units[0].icon}" class="aircraft icon-${coalition} map-item" style="transform: translate(-50%, -50%) rotate(${angle}deg);" /><div class="aircraft-label map-item aircraft-${coalition}">${group.units[0].short} (${group.name.split('-')[0]})</div>`
                                createHTMLMapMarker({ map, html, position: waypoint.loc })
                            }
                            else {
                                let html = `<div class="aircraft-orbit map-item" style="background-color: #326973;"></div>`
                                createHTMLMapMarker({ map, html, position: waypoint.loc })
                            }
                        })
                        flightPath[group.name] = new google.maps.Polyline({
                            path, strokeColor: "#326973", strokeWeight: 2.5
                        })
                        flightPath[group.name].setMap(map)
                    }
                }
            })
        })

        // Select which aircraft to get info about.
        let aircraftHTML = `<ul>`
        let aircraftElement = document.createElement("aircrafts")
        miz.groups["blue"].forEach(group => {
            if (group.type != "aircraft") return
            if (group.units[0].skill != "Client") return
            aircraftHTML += `<li><img class="icon-blue" src="${group.units[0].icon}" /><span>${group.units[0].name.split("-")[0]}</span></li>`
        })
        aircraftHTML += `</ul>`
        aircraftElement.innerHTML = aircraftHTML.trim()
        document.querySelector("#map").appendChild(aircraftElement)
    }



    // Runs every time map view is moved.
    function updateMap() {
        let distanceInMeters = google.maps.geometry.spherical.computeDistanceBetween(
            ruler1.getPosition(),
            ruler2.getPosition()
        )
        
        let mileInPixels = distanceInPixels(map, ruler1, ruler2)

        let samRings = document.querySelectorAll(".sam-ring")
        samRings.forEach(sam => {
            let size = parseInt(sam.dataset.size)
            sam.style.width = `${size * 2 * mileInPixels}px`
            sam.style.height = `${size * 2 * mileInPixels}px`
        })
    }

    function distanceInPixels(map, marker1, marker2) {
        var p1 = map.getProjection().fromLatLngToPoint(marker1.getPosition());
        var p2 = map.getProjection().fromLatLngToPoint(marker2.getPosition());

        var pixelSize = Math.pow(2, -map.getZoom());

        var d = Math.sqrt((p1.x-p2.x)*(p1.x-p2.x) + (p1.y-p2.y)*(p1.y-p2.y))/pixelSize;

        return d
    }
}

// Custom HTML markers function / class extender.
function createHTMLMapMarker({ OverlayView = google.maps.OverlayView,  ...args }) {
    class HTMLMapMarker extends OverlayView {
        constructor() {
            super()
            this.position = args.position
            this.html = args.html
            this.setMap(args.map)
        }
        createDiv() {
            this.div = document.createElement('div')
            this.div.style.position = 'absolute'
            if (this.html) {
                this.div.innerHTML = this.html
            }
            // google.maps.event.addDomListener(this.div, 'click', event => {
            //     google.maps.event.trigger(this, 'click')
            // })
        }
        appendDivToOverlay() {
            const panes = this.getPanes()
            panes.overlayLayer.appendChild(this.div)
        }
        positionDiv() {
            const point = this.getProjection().fromLatLngToDivPixel(this.position)
            if (point) {
                this.div.style.left = `${point.x}px`
                this.div.style.top = `${point.y}px`
            }
        }
        draw() {
            if (!this.div) {
                this.createDiv()
                this.appendDivToOverlay()
            }
            this.positionDiv()
        }
        remove() {
            if (this.div) {
                this.div.parentNode.removeChild(this.div)
                this.div = null
            }
        }
        getPosition() { return this.position }
        getDraggable() { return false }
    }
    return new HTMLMapMarker()
}

// Set custom  map styles.
const mapStyles = [
    { elementType: "geometry", stylers: [{ color: "#050c17" }] },
    { elementType: "labels", stylers: [{ visibility: "off" }] },
    // { elementType: "labels.icon", stylers: [{ color: "#050c17" }] },
    // { elementType: "labels.text", stylers: [{ color: "#050c17" }] },
    // { elementType: "labels.text.fill", stylers: [{ color: "#505050" }] },
    { featureType: "poi", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", stylers: [{ visibility: "off" }] },
    { featureType: "transit", stylers: [{ visibility: "off" }] },
    { featureType: "water", stylers: [{ color: "#0c1a33" }] }
]