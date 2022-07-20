const coalitions = ["red", "blue"]
const flightPath = {}

const elements = [
    { type: "title", title: "Georgian Resolve Campaign - Day 7", },
    { type: "line" },
    { type: "header", text: "Briefing" },
    { type: "paragraph", text: "The day is August 10th, 2008, local time 23:00. In the previous mission we successfully disabled the air defenses in the east, leaving a SAM-free path to Mozdok. In this mission we will be attacking Mozdok airfield, including it's short range air defenses (SA-8, SA-15, MANPADS, & AAA), parked aircraft, taxiways, & targets of opportunity. We will be performing the strike at night to nullify AAA. It is crucial that the short range defenses are deprecated enough for our B-1B bombers to strike the runway at 01:20 (2h 20m in).<br><br></br>CAP aircraft will be tasked with defending the strike aircraft around Mozdok and escorting the B-1Bs to their target. Russia is aware of our plan and will most likely scramble aircraft out of Mozdok and neighboring airfields in the north-west. <br><br></br>Whilst in the previous mission the SA-20 near Mozdok was disabled, only the track & search radar were destroyed. These assets can be easily replaced and the rest of the site needs to be destroyed. Therefore there will be a secondary strike objective to destroy the remaining launchers & support vehicles at this site."},
    { type: "line" },
    { type: "map" },
    { type: "line" },
    { type: "header", text: "Objectives" },
    { type: "paragraph", text: "Objective 1:<br>Execute strike plan at Mozdok.", align: true },
    { type: "paragraph", text: "Objective 2:<br>Destroy remaining assets at SA-20 site.", align: true },
    { type: "paragraph", text: "Objective 3:<br>Provide CAP/Escort for above operations.", align: true },
    { type: "line" },
    { type: "header", text: "Known Threats" },
    { type: "paragraph", text: "Air: Su-24, Su-25, Su-27, Su-30, Su-33, MiG-29, MiG-31, Tu-22, Tu-160, Ka-50, Mi-24, Mi-26, Mi-28", align: true },
    { type: "paragraph", text: "Ground: SA-5, SA-6, SA-8, SA-13, SA-15, SA-18, SA-19, SA-20, ZSU-23, ZSU-58", align: true },
    { type: "line" },
    { type: "header", text: "Callsigns" },
    { type: "paragraph", text: "A-10s - Hawg 1-x<br />F-16s - Falcon 1-x<br />F-14s - Vampire 1-x<br />F/A-18s - Bloodhound 1-x<br />AV-8s - Bulldog 1-x<br />AH-64s - Nightmare 1-x<br />UH-1s - Checkmate 1-x", align: true },
    { type: "line" },
    {
        type: "waypoints",
        groupName: "Falcon-1",
        chartName: "All Flights",
        labels: {
            1: { loc: "Kutaisi Airfield", task: "All fixed-wing flights takeoff & land" },
            2: { loc: "FARP", task: "Helicopters takeoff & land" },
            3: { loc: "SA-20 Site", task: "Destroy remaining launchers & support vehicles" },
            4: { loc: "Mozdok Taxiway A", task: "Destroy taxiway connecting to runway" },
            5: { loc: "Mozdok Taxiway B", task: "Destroy taxiway connecting to runway" },
            6: { loc: "Mozdok Taxiway C", task: "Destroy taxiway connecting to runway" },
            7: { loc: "Mozdok Taxiway D", task: "Destroy taxiway connecting to runway" },
            8: { loc: "Mozdok Taxiway E", task: "Destroy taxiway connecting to runway" },
            9: { loc: "Bullseye", task: "-" }
        }
    },
    { type: "line" },
    {
        type: "radios",
        unitName: "Falcon-1-1",
        chartName: "Radio Channels & Presets",
        labels: {
            245: "Mission Common",
            264: "CTAF / ATC",
            250: "KC-135MPRS (Arco) - TCN: 25Y",
            248: "AWACS E-3 (Magic)",
            133: "Kobuleti",
            132: "Senaki",
            134: "Kutaisi",
            143: "F-14s Interflight",
            141: "F/A-18s Interflight",
            148: "F-16s Interflight",
            145: "A-10s Interflight",
            146: "AH-64s Interflight",
            140: "UH-1s Interflight",
            139: "AV-8s Interflight",
            125: "FARP (Moscow)"
        }
    },
    { type: "line" },
    {
        type: "weather",
        wind: "055&deg; 5 kts",
        clouds: "Few Scattered at 16,000",
        qnh: "763 / 30.04",
        tempature: "68&deg; F"
    },
    { type: "line" },
    { type: "header", text: "Mozdok Airfield" },
    { type: "image", url: "/assets/sat1.jpg" },
]



$(() => {
elements.forEach(element => {
    if (element.type == "map") {
        document.body.appendChild(document.querySelector("#map"))
        document.querySelector("#map").style.display = "block"
    }
    else if (element.type == "title") {
        addElement(`
            <div class="title-container">
                <h1>${element.title}</h1>
            </div>
        `)
    }
    else if (element.type == "paragraph") {
        if (element.align) addElement(`<p class="paragraph align-center">${element.text}</p>`)
        else addElement(`<p class="paragraph">${element.text}</p>`)
    }
    else if (element.type == "header") {
        addElement(`<h4 class="header">${element.text}</h4>`)
    }
    else if (element.type == "line") {
        addElement(`<hr />`)
    }
    else if (element.type == "radios") {
        let unit = getUnitByName(element.unitName)
        if (!unit) return
        let radios = unit.radios
        let freqs = ``
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
                <h4>${element.chartName}</h4>
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
            Object.keys(element.labels).forEach(key => {
                if (!channel.startsWith(key)) return
                label = element.labels[key]
            })
            return { channel, label }
        }
    }
    else if (element.type == "waypoints") {
        let group = getGroupByName(element.groupName)
        if (!group) return
        let route = group.route
        let waypoints = ``
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
                <h4>Waypoints (${element.chartName})</h4>
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
            if (waypoint && element.labels[waypoint.id - 1]) {
                loc = element.labels[waypoint.id - 1].loc
                task = element.labels[waypoint.id - 1].task
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
    else if (element.type == "weather") {
        addElement(`
            <div class="weather-container">
                <h4>Weather</h4>
                <img src="/assets/logo.png" />
                <section>
                    <div><h5>Wind</h5><p>${element.wind}</p></div>
                    <div><h5>Clouds</h5><p>${element.clouds}</p></div>
                </section>
                <section>
                    <div><h5>QNH</h5><p>${element.qnh}</p></div>
                    <div><h5>Tempature</h5><p>${element.tempature}</p></div>
                </section>
            </div>
        `)
    }
    else if (element.type == "image") {
        addElement(`<img class="image" src="${element.url}" />`)
    }
})
})

function initMap() {
    const map = new google.maps.Map(document.querySelector("#map"), {
        zoom: 7,
        maxZoom: 12,
        minZoom: 6,
        center: {lat: 45.746, lng: 34.1555},
        disableDefaultUI: true,
        scrollwheel: true,
        gestureHandling: "greedy",
        zoomControl: false,
        clickableIcons: false,
        mapTypeId: "terrain",
        styles: mapStyles
    })

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
                    console.log(group)
                    let path = []
                    group.route.forEach(waypoint => {
                        if (!waypoint || waypoint.id <= 0) return
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



    // new google.maps.Marker({
    //     map, position: {lat: 41.5429, lng: 41.4943}, title: "Blue patriot 2",
    // })
    // new google.maps.Marker({
    //     map, position: {lat: 43.67610931117853, lng: 39.652110177202104}, title: "OA 1",
    // })
    // new google.maps.Marker({
    //     map, position: {lat: 41.555558, lng: 41.523534}, title: "OA 1",
    // })

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

// Identify custom  map styles.
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

// -------------------------
// Other briefing elements.
// -------------------------

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

// Add HTML/elements to body.
function addElement(html) {
    let template = document.createElement("template")
    template.innerHTML = html.trim()
    document.body.appendChild(template.content.firstElementChild)
}