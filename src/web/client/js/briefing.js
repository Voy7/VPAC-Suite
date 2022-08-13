const coalitions = ["blue", "red"]

function updateBriefing(briefing) {
    // Super hacky, will fix later.
    let good = true
    try { if (!google) return }
    catch {
        good = false
        setTimeout(() => { updateBriefing(briefing) }, 100)
    }
    if (!good) return
    // console.log("briefing!")
    // console.log(briefing)

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
            addElement(`<h4 class="header">${parseOut(element.args.text)}</h4>`)
        }
        else if (element.type == "text") {
            if (element.args.centered) addElement(`<p class="textblock centered">${element.args.text}</p>`)
            else addElement(`<p class="textblock">${parseOut(element.args.text)}</p>`)
        }
        else if (element.type == "waypointChart") {
            let group = getGroupByName(element.args.groupName)
            if (!group) return
            let route = group.route
            let waypoints = ``
            let labels = {}
            element.args.labels.split("\n").forEach(line => {
                let args = line.split(" | ")
                if (!args[1]) return
                labels[args[0]] = { loc: "-", task: "-" }
                if (args[1]) labels[args[0]].loc = args[1]
                if (args[2]) labels[args[0]].task = args[2]
            })
            for(let i = 1; i <= 10; i++) {
                let waypoint = getWaypointInfo(route[i + 1], route[i])
                waypoints += `
                    <tr>
                        <td class="id">${i}</td>
                        <td class="loc">${waypoint.loc}</td>
                        <td class="task">${waypoint.task}</td>
                        <td class="alt">${waypoint.alt}</td>
                        <td class="dist">${waypoint.distance}</td>
                    </tr>`
            }
            addElement(`
                <div class="waypoints-chart">
                    <h4>${element.args.chartName}</h4>
                    <img src="/assets/logo.png" />
                    <table cellspacing="0">
                        <tr class="rows-header">
                            <td>#</td><td>Location</td><td>Task</td><td>Alt</td><td>Dist</td>
                        </tr>
                        ${waypoints}
                    </table>
                </div>
            `)
            function getWaypointInfo(waypoint, prevWaypoint) {
                let loc = "-"
                let task = "-"
                let alt = `-`
                let distance = "-"
                if (waypoint && labels[waypoint.id - 1]) {
                    loc = labels[waypoint.id - 1].loc
                    task = labels[waypoint.id - 1].task
                }
                if (waypoint && prevWaypoint) {
                    let dist = google.maps.geometry.spherical.computeDistanceBetween (waypoint.loc, prevWaypoint.loc)
                    if (waypoint.id == 2 && dist < 1852) distance = "-"
                    else if (dist < 3704) distance = `${(dist * 3.28).toFixed(0)} ft`
                    else distance = `${(dist / 1852).toFixed(0)} nm`
                }
                if (waypoint) alt = `${(waypoint.alt * 3.28).toFixed(0)} ft`
                return { loc, task, distance, alt }
            }
        }
        else if (element.type == "radioChart") {
            let unit = getUnitByName(element.args.unitName)
            if (!unit) return
            let radios = unit.radios
            let freqs = ``
            let labels = {}
            element.args.labels.split("\n").forEach(line => {
                let args = line.split(" | ")
                if (!args[1]) return
                labels[args[0]] = args[1]
            })
            for(let i = 1; i < radios[1].length; i++) {
                let freq1 = getRadioInfo(radios[1][i])
                let freq2 = getRadioInfo(radios[2][i])
                freqs += `
                    <tr>
                        <td class="id">${i}</td><td class="freq">${freq1.channel}</td><td class="for">${freq1.label}</td>
                        <td class="id">${i}</td><td class="freq">${freq2.channel}</td><td class="for">${freq2.label}</td>
                    </tr>`
            }
            addElement(`
                <div class="radio-chart">
                    <h4>${element.args.chartName}</h4>
                    <img src="/assets/logo.png" />
                    <table cellspacing="0">
                        <tr class="rows-header">
                            <td>#</td><td>Freq</td><td>Radio 1 / UHF</td>
                            <td>#</td><td>Freq</td><td>Radio 2 / VHF</td>
                        </tr>
                        ${freqs}
                    </table>
                </div>
            `)
            function getRadioInfo(channel) {
                if (channel.length <= 3) channel += ".0"
                let label = "-"
                Object.keys(labels).forEach(key => {
                    if (!channel.startsWith(key)) return
                    label = labels[key]
                })
                return { channel, label }
            }
        }
        else if (element.type == "weatherChart") {
            addElement(`
                <div class="weather-chart">
                    <h4>Weather Information</h4>
                    <table cellspacing="0">
                        <tr>
                            <th>Wind</th>
                            <th>Clouds</th>
                            <th>QNH</th>
                            <th>Tempature</th>
                        </tr>
                        <tr>
                            <td>${element.args.wind}</td>
                            <td>${element.args.clouds}</td>
                            <td>${element.args.qnh}</td>
                            <td>${element.args.temp}</td>
                        </tr>
                    </table>
                </div>
            `)
        }
        else if (element.type == "rawHtml") {
            addElement(`${element.args.html}`)
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
        maxZoom: 9,
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
        map.addListener("zoom_changed", () => {
            updateMap()
            console.log(map.zoom)
            if (map.zoom <= 7) $(".sam-label").fadeOut(500)
            else $(".sam-label").fadeIn(500)
        })
        updateMap()
        $(".sam-label").fadeOut(0)
    }, 1000)

    // Toggle map elements
    // let showOrbits = true
    // document.addEventListener("keydown", event => {
    //     if (event.key.toLowerCase() == "o") {
    //         coalitions.forEach(coalition => {
    //             miz.groups[coalition].forEach(group => {
    //                 if (group.task != "AWACS" && group.task != "Refueling") return
    //                 if (showOrbits == true) {
    //                     flightPath[group.name].setMap(undefined)
    //                     $(".aircraft").fadeOut(300)
    //                     $(".aircraft-label").fadeOut(300)
    //                 }
    //                 else {
    //                     flightPath[group.name].setMap(map)
    //                     $(".aircraft").fadeIn(300)
    //                     $(".aircraft-label").fadeIn(300)
    //                 }
    //             })
    //         })
    //         if (showOrbits) showOrbits = false
    //         else showOrbits = true
    //     }
    // })




    const waitMiz = setInterval(() => {
        if (miz) {
            clearInterval(waitMiz)
            populateMap()
        }
    }, 500)

    function populateMap() {
        const coalitions = ["red", "blue"]
        const flightPath = {}

        // Move to relavant area.
        map.panTo(miz.bullseyes.blue.loc)

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
                    group.units.forEach(unit => {
                        console.log(`${unit.name} - ${unit.type}`)
                    })
                    // ================

                    if (group.name.startsWith("AIRPORT")) {
                        let airport = group.name.replace("AIRPORT ", "")
                        let html = `<div class="airport airport-${coalition} map-item" data-airport="${airport}"></div>`
                        createHTMLMapMarker({ map, html, position: group.loc })
                    }
                    if (group.hiddenOnMFD == "true") return
                    // if (group.hiddenOnMFD == "true") return
                    let ringUnit = null
                    group.units.forEach(unit => {
                        if (unit.ring != null) ringUnit = unit
                    })

                    let html = `<img src="${group.units[0].icon}" class="sam icon-${coalition} map-item" /><div class="sam-label map-item">${group.units[0].short}</div>`
                    if (ringUnit != null) html = `<img src="${ringUnit.icon}" class="sam icon-${coalition} map-item" /><div class="sam-ring ring-${coalition} map-item" data-size="${ringUnit.ring}"></div><div class="sam-label map-item" style="z-index: ${ringUnit.ring};">${ringUnit.short}</div>`
                    
                    createHTMLMapMarker({ map, html, position: group.loc })
                }
                else if (group.type == "ship") {
                    if (group.hiddenOnMFD == "true") return
                    let ship = group.name
                    let html = `<div class="airport airport-${coalition} map-item" data-airport="${ship}"></div>`
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
                        // console.log(group)
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

function getGroupByName(name) {
    let returnGroup = null
    coalitions.forEach(coalition => {
        miz.groups[coalition].forEach(group => {
            if (group.name != name) return
            returnGroup = group
        })
    })
    return returnGroup
}

function getUnitByName(name) {
    let returnUnit = null
    coalitions.forEach(coalition => {
        miz.groups[coalition].forEach(group => {
            group.units.forEach(unit => {
                if (unit.name != name) return
                returnUnit = unit
            })
        })
    })
    return returnUnit
}

function parseOut(text) {
    return text.replaceAll(`@1;`, `'`)
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