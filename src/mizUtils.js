import dcs from './dcsUtils.js'

// To get center of map, click neutral bullseye.
// Convert from Degrees Minutes Seconds to Decimal Degree here:
// Converter: https://coordinates-converter.com/

const mapInfo = {}
mapInfo["Caucasus"] = { center: { lat: 45.129444, lng: 34.265278 }}
mapInfo["MarianaIslands"] = { center: { lat: 13.484722, lng: 144.7975 }}
mapInfo["PersianGulf"] = { center: { lat: 26.171819, lng: 56.241925 }}
mapInfo["Syria"] = { center: { lat: 35.021667, lng: 35.900556 }}
mapInfo["Falklands"] = { center: { lat: -52.280247, lng: -59.102165 }}

// Convert .miz coords to lat, long.
function convertMapCoords(map, x, y) {
    if (!mapInfo[map]) return null
    let R = 6378.1
    let dr = Math.PI / 180
    let bearing = (Math.atan2(y, x) * (180 / Math.PI)) * dr
    let range = Math.sqrt(x * x + y * y)
    let lat = mapInfo[map].center.lat * dr
    let lng = mapInfo[map].center.lng * dr
    lat = Math.asin(Math.sin(lat) * Math.cos((range / 1000) / R) + Math.cos(lat) * Math.sin((range / 1000) / R) * Math.cos(bearing))
    lng += Math.atan2(
        Math.sin(bearing) * Math.sin((range / 1000) / R) * Math.cos(lat), 
        Math.cos((range / 1000) / R) - Math.sin(lat) * Math.sin(lat)
    )
    return { lat: lat /= dr, lng: lng /= dr }
}

async function getMissionData(data) {
    data = data.body[0].init[0].fields
    return p = new Promise(async (resolve, reject) => {
        let map = await get(data, "theatre")
        let coalitions = ["blue", "red"]
        let groups = {}
        let bullseyes = {}
        coalitions.forEach(async coalition => {
            groups[coalition] = []
            let countries = await get(data, `coalition.${coalition}.country`)
            countries.forEach(async country => {
                let vehicles = await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group`)
                if (vehicles) {
                    vehicles.forEach(async vehicle => {
                        let unitList = []
                        let routeList = []
                        let units = await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units`)
                        units.forEach(async unit => {
                            unitList.push({
                                id: unit.key.value,
                                name: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.name`),
                                type: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`),
                                short: dcs.parseShort(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                long: dcs.parseLong(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                ring: dcs.unitThreatRing(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                code: dcs.unitCode(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.y`),
                            })
                        })
                        let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points`)
                        routes.forEach(async route => {
                            let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}`)
                            routeList[route.key.value] = {
                                id: route.key.value,
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}.y`),
                                alt: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.route.points.${route.key.value}.alt`)
                            }
                        })
                        groups[coalition].push({
                            type: "ground",
                            name: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.name`),
                            loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.y`)),
                            x: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.x`),
                            y: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.y`),
                            hiddenOnMFD: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.hiddenOnMFD`),
                            lateActivation: await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.lateActivation`),
                            units: unitList,
                            route: routeList
                        })
                    })
                }
                let ships = await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group`)
                if (ships) {
                    ships.forEach(async ship => {
                        let unitList = []
                        let routeList = []
                        let units = await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units`)
                        units.forEach(async unit => {
                            unitList.push({
                                id: unit.key.value,
                                name: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.name`),
                                type: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.type`),
                                short: dcs.parseShort(await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.type`)),
                                long: dcs.parseLong(await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.type`)),
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.type`)),
                                ring: dcs.unitThreatRing(await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.type`)),
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.units.${unit.key.value}.y`),
                            })
                        })
                        let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points`)
                        routes.forEach(async route => {
                            let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}`)
                            routeList[route.key.value] = {
                                id: route.key.value,
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}.y`),
                                alt: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.route.points.${route.key.value}.alt`)
                            }
                        })
                        groups[coalition].push({
                            type: "ship",
                            name: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.name`),
                            loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.y`)),
                            x: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.x`),
                            y: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.y`),
                            hiddenOnMFD: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.hiddenOnMFD`),
                            lateActivation: await get(data, `coalition.${coalition}.country.${country.key.value}.ship.group.${ship.key.value}.lateActivation`),
                            units: unitList,
                            route: routeList
                        })
                    })
                }
                let planes = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group`)
                if (planes) {
                    planes.forEach(async plane => {
                        let unitList = []
                        let routeList = []
                        let units = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units`)
                        units.forEach(async unit => {
                            let radioList = []
                            let radios = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.Radio`)
                            if (radios) {
                                radios.forEach(async radio => {
                                    let freqs = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.Radio.${radio.key.value}.channels`)
                                    radioList[radio.key.value] = []
                                    freqs.forEach(freq => {
                                        radioList[radio.key.value][freq.key.value] = freq.value.raw
                                    })
                                })
                            }
                            unitList.push({
                                id: unit.key.value,
                                name: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.name`),
                                type: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.type`),
                                short: dcs.parseShort(await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.type`)),
                                long: dcs.parseLong(await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.type`)),
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.type`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.y`),
                                skill: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.skill`),
                                radios: radioList
                            })
                        })
                        let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points`)
                        routes.forEach(async route => {
                            let tasks = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.task.params.tasks`)
                            let orbit = "None"
                            tasks.forEach(async task => {
                                let taskID = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.task.params.tasks.${task.key.value}.id`)
                                if (taskID == "Orbit" && await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.task.params.tasks.${task.key.value}.params.pattern`) == "Circle") orbit = "Circle"
                                if (taskID == "Orbit" && await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.task.params.tasks.${task.key.value}.params.pattern`) == "Race-Track") orbit = "Race-Track"
                            })
                            routeList[route.key.value] = {
                                id: route.key.value,
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.y`),
                                alt: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.alt`),
                                eta: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.ETA`),
                                etaFixed: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.ETA_locked`),
                                orbit: orbit
                            }
                        })
                        groups[coalition].push({
                            type: "aircraft",
                            name: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.name`),
                            loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.y`)),
                            x: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.x`),
                            y: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.y`),
                            hiddenOnMFD: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.hiddenOnMFD`),
                            task: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.task`),
                            units: unitList,
                            route: routeList
                        })
                    })
                }
                let helicopters = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group`)
                if (helicopters) {
                    helicopters.forEach(async helicopter => {
                        let unitList = []
                        let routeList = []
                        let units = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units`)
                        units.forEach(async unit => {
                            let radioList = []
                            let radios = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.Radio`)
                            if (radios) {
                                radios.forEach(async radio => {
                                    let freqs = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.Radio.${radio.key.value}.channels`)
                                    radioList[radio.key.value] = []
                                    freqs.forEach(freq => {
                                        radioList[radio.key.value][freq.key.value] = freq.value.raw
                                    })
                                })
                            }
                            unitList.push({
                                id: unit.key.value,
                                name: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.name`),
                                type: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.type`),
                                short: dcs.parseShort(await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.type`)),
                                long: dcs.parseLong(await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.type`)),
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.type`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.y`),
                                skill: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.units.${unit.key.value}.skill`),
                                radios: radioList
                            })
                        })
                        let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points`)
                        routes.forEach(async route => {
                            let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}`)
                            routeList[route.key.value] = {
                                id: route.key.value,
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.y`),
                                alt: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.alt`),
                                eta: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.ETA`),
                                etaFixed: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.route.points.${route.key.value}.ETA_locked`)
                            }
                        })
                        groups[coalition].push({
                            type: "aircraft",
                            name: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.name`),
                            loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.y`)),
                            x: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.x`),
                            y: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.y`),
                            hiddenOnMFD: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.hiddenOnMFD`),
                            task: await get(data, `coalition.${coalition}.country.${country.key.value}.helicopter.group.${helicopter.key.value}.task`),
                            units: unitList,
                            route: routeList
                        })
                    })
                }
            })
            bullseyes[coalition] = {
                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.bullseye.x`), await get(data, `coalition.${coalition}.bullseye.y`)),
                x: await get(data, `coalition.${coalition}.bullseye.x`),
                y: await get(data, `coalition.${coalition}.bullseye.y`)
            }
        })
        
        const miz = {
            map, groups, bullseyes,
            date: {
                day: await get(data, "date.Day"),
                month: await get(data, "date.Month"),
                year: await get(data, "date.Year"),
                time: await get(data, "start_time")
            },
            weather: {
                name: await get(data, "weather.name"),
                qnh: await get(data, "weather.qnh"),
                temp: await get(data, "weather.season.temperature"),
                dust: await get(data, "weather.dust_density"),
                turbulence: await get(data, "weather.groundTurbulence"),
                visibility: await get(data, "weather.visibility.distance"),
                wind: {
                    at0: { speed: await get(data, "weather.wind.atGround.speed"), dir: await get(data, "weather.wind.atGround.dir") },
                    at2000: { speed: await get(data, "weather.wind.at2000.speed"), dir: await get(data, "weather.wind.at2000.dir") },
                    at8000: { speed: await get(data, "weather.wind.at8000.speed"), dir: await get(data, "weather.wind.at8000.dir") }
                },
                clouds: {
                    base: await get(data, "weather.clouds.base"),
                    thickness: await get(data, "weather.clouds.thickness"),
                    density: await get(data, "weather.clouds.density"),
                    preset: await get(data, "weather.clouds.preset")
                },
                fog: {
                    thickness: await get(data, "weather.fog.thickness"),
                    visibility: await get(data, "weather.fog.visibility")
                }
            }
        }

        // Fetch value from lua array.
        function get(fields, key) {
            return p = new Promise((resolve, reject) => {
                let loop = true
                let index = 0
                let keys = key.split(".")
                key = keys[index]
                while (loop == true) {
                    index++
                    let found = false
                    fields.forEach(field => {
                        if (field.key.raw == key || field.key.raw == `"${key}"`) {
                            found = true
                            if (field.value.raw) res(field.value.raw.replace(/"/g, ""))
                            else if (field.value.argument) res(`${field.value.operator}${field.value.argument.raw}`)
                            else {
                                key = keys[index]
                                if (key) fields = field.value.fields
                                else res(field.value.fields)
                            }
                        }
                    })
                    if (found == false) res(null)
                }
                function res(result) { resolve(result); loop = false }
            })
        }

        // Wait x time (temp solution) before returning.
        setTimeout(() => { resolve(miz) }, 100)
    })
}

// Export modules.
export default { getMissionData }