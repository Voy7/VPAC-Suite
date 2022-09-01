const debugUnits = false
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
            if (element.args.centered) addElement(`<p class="textblock centered">${parseOut(element.args.text)}</p>`)
            else addElement(`<p class="textblock">${parseOut(element.args.text)}</p>`)
        }
        else if (element.type == "waypointChart") {
            if (!miz) return addElement(`<div class="no-miz-element">Could not load element, no .miz included.</div>`)
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
            if (!miz) return addElement(`<div class="no-miz-element">Could not load element, no .miz included.</div>`)
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
            if (!miz) return addElement(`<div class="no-miz-element">Could not load element, no .miz included.</div>`)
            addElement(`
                <div class="weather-chart">
                    <h4>Weather Information</h4>
                    <table cellspacing="0">
                        <tr>
                            <th>Wind</th>
                            <th>Clouds</th>
                            <th>Pressure</th>
                            <th>Temperature</th>
                        </tr>
                        <tr>
                            <td>
                                At Ground: ${parseDir(miz.weather.wind.at0.dir)}&deg; ${Math.round(miz.weather.wind.at0.speed * 1.94)} kts<br />
                                At 6,000 ft: ${parseDir(miz.weather.wind.at2000.dir)}&deg; ${Math.round(miz.weather.wind.at2000.speed * 1.94)} kts<br />
                                At 26,000 ft: ${parseDir(miz.weather.wind.at8000.dir)}&deg; ${Math.round(miz.weather.wind.at8000.speed * 1.94)} kts
                            </td>
                            <td>
                                ${parseClouds(miz.weather.clouds.preset)}<br />
                                Base: ${(Math.round(miz.weather.clouds.base * 3.28 / 100) * 100).toLocaleString("en-US")} ft<br /><br />
                            </td>
                            <td>
                                QNH: ${Math.round(miz.weather.qnh)}<br />
                                inHg: ${Math.round(miz.weather.qnh / 25.368 * 100) / 100}<br /><br />
                            </td>
                            <td>
                                ${Math.round(miz.weather.temp * 9/5 + 32)}&deg; F<br />
                                ${miz.weather.temp}&deg; C<br /><br />
                            </td>
                        </tr>
                    </table>
                </div>
            `)

            function parseDir(dir) {
                dir = parseInt(dir) + 180
                if (dir > 360) dir = dir - 360
                if (dir < 10) dir = `00${dir}`
                else if (dir < 100) dir = `0${dir}`
                return dir
            }
            function parseClouds(name) {
                let preset = name.split("Preset")[1]
                if (name.startsWith("Rainy")) return "Overcast & Rain"
                else if (["1", "2", "3", "4", "8"].includes(preset)) return "Few Scattered"
                else if (["5", "6", "7", "9", "10", "11", "12"].includes(preset)) return "Scattered Clouds"
                else if (["13", "14", "15", "16", "17", "18", "19", "20"].includes(preset)) return "Broken Clouds"
                else if (["21", "22", "23", "24", "25", "26", "27"].includes(preset)) return "Overcast Clouds"
                else return "Scattered"
            }
        }
        else if (element.type == "image") {
            let filterClass = ``
            let filterHTML = ``
            if (element.args.filter == "Satellite") {
                filterClass = "sat-filter"
                filterHTML = `
                    <div class="sat-overlay">
                        <div class="cross cross-1"></div>
                        <div class="cross cross-2"></div>
                        <div class="cross cross-3"></div>
                        <div class="cross cross-4"></div>
                        <div class="corner corner-1"></div>
                        <div class="corner corner-2"></div>
                        <div class="corner corner-3"></div>
                        <div class="corner corner-4"></div>
                        <div class="text text-1">M: SAT</div>
                        <div class="text text-2">D: 23.8</div>
                        <div class="text text-3">02:06:10</div>
                        <div class="text text-4">11:03:22</div>
                    </div>`
            }
            addElement(`<div class="image"><img src="${element.args.link}" class="${filterClass}" />${filterHTML}</div>`)
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
        maxZoom: 11,
        minZoom: 6,
        center: { lat: 45.746, lng: 34.1555 },
        disableDefaultUI: true,
        scrollwheel: true,
        gestureHandling: "greedy",
        zoomControl: false,
        clickableIcons: false,
        mapTypeId: "terrain",
        // tilt: 45,
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



    // Only populate map once miz is loaded.
    const waitMiz = setInterval(() => {
        if (miz) {
            clearInterval(waitMiz)
            populateMap()
        }
    }, 500)

    // Update/put all the elements on the map.
    function populateMap() {
        const coalitions = ["red", "blue"]
        const flightPath = {}
        let waypointPath = null
        let firstAircraft = null

        // Move to relavant area.
        map.setCenter(miz.bullseyes.blue.loc)
        // map.setBounds(null)

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
                if (debugUnits) {
                    // Get name of all units
                    group.units.forEach(unit => {
                        console.log(`%c[${unit.name}]: ${unit.type}`, "color: aqua;")
                    })
                }
                if (group.type == "ground") {
                    if (group.name.startsWith("AIRPORT")) {
                        const airport = group.name.replace("AIRPORT ", "")
                        const html = `<div class="airport airport-${coalition} map-item" data-airport="${airport}"></div>`
                        createHTMLMapMarker({ map, html, position: group.loc })
                    }
                    if (group.name.startsWith("MARKER")) {
                        const marker = group.name.replace("MARKER ", "")
                        const html = `<div class="marker marker-${coalition} map-item" data-marker="${marker}"></div>`
                        createHTMLMapMarker({ map, html, position: group.loc })
                    }
                    if (group.hiddenOnMFD == "true") return
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
                    let html = `<div class="ship icon-${coalition} map-item" data-ship="${ship}"></div>`
                    // let html = `<div class="airport airport-${coalition} map-item" data-airport="${ship}"></div>`
                    createHTMLMapMarker({ map, html, position: group.loc })
                }
                else if (group.type == "aircraft") {
                    // Racetrack aircraft
                    if (group.task == "Refueling" || group.task == "AWACS") {
                        if (coalition != "blue") return
                        let path = []
                        let length = group.route.length - 1
                        if (length < 2) return
                        group.route.forEach(waypoint => {
                            if (!waypoint || waypoint.id < length - 1) return
                            path.push(waypoint.loc)
                            if (waypoint.id == length - 1) {
                                let angle = google.maps.geometry.spherical.computeHeading(waypoint.loc, group.route[length].loc)
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
        let aircraftHTML = `<ul class="aircrafts">`
        let aircraftElement = document.createElement("aircrafts")
        miz.groups["blue"].forEach(group => {
            if (group.type != "aircraft") return
            if (group.units[0].skill != "Client") return
            if (!firstAircraft) firstAircraft = group.name
            aircraftHTML += `<li data-aircraft="${group.name}"><img class="icon-blue" src="${group.units[0].icon}" /><span>${group.name} (${group.units[0].short})</span></li>`
        })
        aircraftHTML += `</ul>`
        aircraftElement.innerHTML = aircraftHTML.trim()
        document.querySelector("#map").appendChild(aircraftElement)

        const aircraftElements = document.querySelectorAll("[data-aircraft]")
        aircraftElements.forEach(element => {
            element.addEventListener("click", () => {
                showWaypoints(element.dataset.aircraft)
            })
        })

        // Show waypoints on map for specified group.
        function showWaypoints(name) {
            aircraftElements.forEach(element => { element.classList.remove("item-selected") })
            document.querySelector(`[data-aircraft="${name}"]`).classList.add("item-selected")

            if (waypointPath) waypointPath.setMap(null)
            document.querySelectorAll(".waypoint").forEach(waypoint => {
                waypoint.remove()
            })

            const group = getGroupByName(name)
            if (!group) return

            const path = []
            group.route.forEach(waypoint => {
                if (!waypoint || waypoint.id <= 1) return
                path.push(waypoint.loc)
                let html = `<div class="waypoint map-item" data-label="${waypoint.id - 1}"></div>`
                createHTMLMapMarker({ map, html, position: waypoint.loc })
            })
            waypointPath = new google.maps.Polyline({
                path, strokeColor: "#FFF", strokeWeight: 0.7
            })
            waypointPath.setMap(map)
            
        }

        if (firstAircraft) showWaypoints(firstAircraft)

        // Map options sidebar selection.
        let optionsHTML = `<ul class="options">`
        let optionsElement = document.createElement("options")
        optionsHTML += `<li data-option="terrain" class="item-selected"><img class="icon-blue" src="/assets/infantry-icon-red.png" /><span>Terrain</span></li>`
        optionsHTML += `<li data-option="sams" class="item-selected"><img class="icon-blue" src="/assets/motorized-sam-icon-red.png" /><span>SAM Rings</span></li>`
        optionsHTML += `<li data-option="airports" class="item-selected"><img class="icon-blue" src="/assets/truck-icon-red.png" /><span>Airfields</span></li>`
        optionsHTML += `</ul>`
        optionsElement.innerHTML = optionsHTML.trim()
        document.querySelector("#map").appendChild(optionsElement)

        const optionElements = document.querySelectorAll("[data-option]")
        optionElements.forEach(element => {
            element.addEventListener("click", () => {
                toggleOption(element.dataset.option)
            })
        })

        const options = {}

        function toggleOption(option) {
            if (options[option] == undefined) options[option] = false
            else if (options[option]) options[option] = false
            else options[option] = true

            if (options[option]) document.querySelector(`[data-option="${option}"]`).classList.add("item-selected")
            else document.querySelector(`[data-option="${option}"]`).classList.remove("item-selected")

            if (option == "terrain") {
                if (options[option]) map.setMapTypeId("terrain")
                else map.setMapTypeId("satellite")
            }
            if (option == "sams") {
                if (options[option]) $(".sam-ring").fadeIn(300)
                else $(".sam-ring").fadeOut(0)
            }
            if (option == "airports") {
                if (options[option]) $(".airport").fadeIn(300)
                else $(".airport").fadeOut(0)
            }
        }
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