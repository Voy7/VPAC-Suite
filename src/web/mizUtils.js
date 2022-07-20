const dcs = require("./dcsUtils")

const { group } = require("console")
const { resolve } = require("path")

const mapInfo = {}
//mapInfo["Caucasus"] = { center: {lat: 45.746, lng: 34.1555}, deviation: 9.04, expand: 1.059 }
mapInfo["Caucasus"] = { center: {lat: 45.746, lng: 34.1555}, deviation: 6.04, expand: 1.059 }

// Convert .miz coords to lat, long.
function convertMapCoords(map, x, y) {
    if (!mapInfo[map]) return null
    x = x * mapInfo[map].expand
    y = y * mapInfo[map].expand
    let R = 6378.1
    let dr = Math.PI / 180
    let bearing = (Math.atan2(y, x) * (180 / Math.PI) + mapInfo[map].deviation) * dr
    // console.log(Math.atan2(y, x) * (180 / Math.PI))
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

function test() {
    let res = convertMapCoords("Caucasus", -168058, 461921)
    console.log(res)
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
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
                                ring: dcs.unitThreatRing(await get(data, `coalition.${coalition}.country.${country.key.value}.vehicle.group.${vehicle.key.value}.units.${unit.key.value}.type`)),
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
                                icon: dcs.unitIcon(await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.type`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.y`),
                                skill: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.units.${unit.key.value}.skill`),
                                radios: radioList
                            })
                        })
                        let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points`)
                        routes.forEach(async route => {
                            let routes = await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}`)
                            routeList[route.key.value] = {
                                id: route.key.value,
                                loc: convertMapCoords(map, await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.x`), await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.y`)),
                                x: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.x`),
                                y: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.y`),
                                alt: await get(data, `coalition.${coalition}.country.${country.key.value}.plane.group.${plane.key.value}.route.points.${route.key.value}.alt`)
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
module.exports = { getMissionData }