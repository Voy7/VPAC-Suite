import sqlite3 from 'sqlite3'
import luaJson from 'luaparse'
import fs from 'fs'
import dcsUtils from './dcsUtils.js'
import miz from './mizUtils.js'

const db = new sqlite3.Database('./database.sqlite')

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT PRIMARY KEY, ucid TEXT, key TEXT, data TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS missions (mission TEXT PRIMARY KEY, event TEXT, data TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS squadrons (id TEXT PRIMARY KEY, role TEXT, data TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS briefings (id TEXT PRIMARY KEY, name TEXT, public TEXT, elements TEXT, data TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS developers (name TEXT PRIMARY KEY, image TEXT, link TEXT, color TEXT, modules TEXT, extra TEXT)`)
  db.run(`CREATE TABLE IF NOT EXISTS guild (id TEXT PRIMARY KEY, data TEXT)`)
})

// Run given query/queries.
function run(queries, values) {
    if (!Array.isArray(queries)) queries = [queries]
    db.serialize(() => {
        queries.forEach(query => {
            if (!values) db.run(query)
            else db.run(query, values)
        })
    })
}

// Replace all data in table with given JSON.
function set(table, data) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${table}`)
        db.run(`CREATE TABLE IF NOT EXISTS ${table} (data TEXT)`)
        db.run(`REPLACE INTO ${table} VALUES (?1)`, { 1: JSON.stringify(data) })
    })
}

// Return parsed JSON from table.
function get(table) {
    return p = new Promise((resolve, reject) => {
        db.get(`SELECT * FROM ${table}`, (err, row) => {
            if (err) {
                console.log(`Caught error in db fetch '${file}': ${err}`.red)
                resolve([])
            }
            else resolve(JSON.parse(row.data))
        })
    })
}

// Set data for user & create new users.
function setUser(id, ucid, key, data) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT, ucid TEXT, key TEXT, data TEXT)`)
        db.get(`SELECT * FROM users WHERE id=?1 OR ucid=?2 OR key=?3`, { 1: id, 2: ucid, 3: key }, (err, row) => {
            if (!row) {
                if (id != null && ucid != null && key != null) {
                    db.run(`INSERT INTO users (id, ucid, key, data) VALUES (?1, ?2, ?3, ?4)`, { 1: id, 2: ucid, 3: key, 4: JSON.stringify(data) })
                }
            }
            else {
                if (key != null) {
                    if (ucid != null) db.run(`UPDATE users SET ucid=?1, data=?2 WHERE key=?3`, { 1: ucid, 2: JSON.stringify(data), 3: key })
                    else db.run(`UPDATE users SET data=?1 WHERE key=?2`, { 1: JSON.stringify(data), 2: key })
                }
                else if (id != null) db.run(`UPDATE users SET data=?1 WHERE id=?2`, { 1: JSON.stringify(data), 2: id })
                else if (ucid != null) db.run(`UPDATE users SET data=?1 WHERE ucid=?2`, { 1: JSON.stringify(data), 2: ucid })
            }
        })
    })
}

// Get user info based of id, ucid, or key.
function getUser(id, ucid, key) {
    return p = new Promise((resolve, reject) => {
        if (id == "*") {
            db.all(`SELECT * FROM users`, (err, rows) => {
                if (!rows) resolve([])
                else {
                    let users = []
                    rows.forEach(row => {
                        users.push(parseUserRow(row))
                    })
                    resolve(users)
                }
            })
        }
        else {
            db.get(`SELECT * FROM users WHERE id=?1 OR ucid=?2 OR key=?3`, { 1: id, 2: ucid, 3: key }, (err, row) => {
                if (err) {
                    console.log(`Caught error in db fetch 'users': ${err}`.red)
                    resolve([])
                }
                else if (!row) resolve(undefined)
                else resolve(row)
            })
        }
    })
}

// Parse unit data from db, specifically the JSON.
function parseUserRow(row) {
    return {
        id: row.id,
        ucid: row.ucid,
        key: row.key,
        data: JSON.parse(row.data)
    }
}

// Add an event with a mission name to the database.
function missionAddEvent(mission, event, data) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS missions (mission TEXT, event TEXT, data TEXT)`)
        db.run(`INSERT INTO missions (mission, event, data) VALUES (?1, ?2, ?3)`, { 1: mission, 2: event, 3: JSON.stringify(data) })
    })
}

// Get all, or specific events from a mission.
function missionGetEvent(mission, event) {
    return p = new Promise((resolve, reject) => {
        let query = `SELECT * FROM missions WHERE mission=?1`
        let values = { 1: mission }
        if (event != null) {
            query += ` AND event=?2`
            values = { 1: mission, 2: event }
        }
        db.all(query, values, (err, rows) => {
            if (!rows) resolve([])
            else {
                let events = []
                rows.forEach(row => {
                    events.push({
                        mission: row.mission,
                        event: row.event,
                        data: JSON.parse(row.data)
                    })
                })
                resolve(events)
            }
        })
    })
}

// Get only stats of all/or specific mission.
function missionGetInfo(mission) {
    return p = new Promise((resolve, reject) => {
        const missions = new Map()
        let query = `SELECT * FROM missions`
        let values = {}
        if (mission != "*") {
            query += ` WHERE mission=?1`
            values = { 1: mission }
        }
        db.all(query, values, (err, rows) => {
            if (!rows) resolve([])
            else {
                rows.forEach(row => {
                    let data = JSON.parse(row.data)
                    let info = missions.get(row.mission)
                    if (!info) info = {
                        name: row.mission,
                        date: "-/-",
                        players: [],
                        aakills: 0,
                        agkills: 0,
                        takeoffs: 0,
                        landings: 0,
                        crashes: 0,
                        ejects: 0
                    }
                    if (data.time && info.date == "-/-") {
                        info.date = data.time.split(" ")[0]
                    }
                    if (data.playerUCID && !info.players.includes(data.playerUCID)) {
                        info.players.push(data.playerUCID)
                    }
                    if (row.event == "KILL") {
                        let type = dcsUtils.unitType(data.killedUnit)
                        if (type == "A" || type == "H") info.aakills++
                        else if (data.killedUnit != "Unknown") info.agkills++
                    }
                    if (row.event == "TAKEOFF") info.takeoffs++
                    if (row.event == "LANDING") info.landings++
                    if (row.event == "CRASH") info.crashes++
                    if (row.event == "EJECT") info.ejects++
                    missions.set(row.mission, info)
                })
                resolve(missions)
            }
        })
    })
}

// Get info of squadron, and generate it if it didn't exist.
function squadronGetInfo(id, role) {
    return p = new Promise((resolve, reject) => {
        let data = { description: "description.", callsigns: "C1,C2,C3", airframes: "A1,A2,A3", checkride: "No checkride info" }
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS squadrons (id TEXT, role TEXT, data TEXT)`)
            db.get(`SELECT * FROM squadrons WHERE id=?1`, { 1: id }, (err, row) => {
                if (!row) {
                    db.run(`INSERT INTO squadrons (id, role, data) VALUES (?1, ?2, ?3)`, { 1: id, 2: role, 3: JSON.stringify(data) })
                    resolve(data)
                }
                else resolve(JSON.parse(row.data))
            })
        })
    })
}

// Get info of all/of specific resource (WIP).
function resourceGetInfo(resource) {
    return p = new Promise((resolve, reject) => {
        const resources = new Map()
        let query = `SELECT * FROM resources`
        let values = {}
        if (resource != "*") {
            query = `SELECT * FROM resources WHERE resource=?1`
            values = { 1: resource }
        }
        db.all(query, values, (err, rows) => {
            if (!rows) resolve([])
            else {
                rows.forEach(row => {
                    let data = JSON.parse(row.data)
                    let info = resources.get(row.resource)
                    if (!info) info = {
                        name: row.resource,
                    }
                    resources.set(row.resource, info)
                })
                resolve(resources)
            }
        })
    })
}

// Get basic info on all briefings, or all data on specific briefing.
function briefingGetInfo(id, name) {
    return p = new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS briefings (id TEXT, name TEXT, public TEXT, elements TEXT, data TEXT)`)
            if (id == "*") {
                let briefings = new Map()
                db.all(`SELECT * FROM briefings`, (err, rows) => {
                    if (!rows) resolve([])
                    else {
                        rows.forEach(row => {
                            let data = JSON.parse(row.data)
                            let info = briefings.get(row.id)
                            if (!info) info = {
                                id: row.id,
                                name: row.name,
                                public: row.public
                            }
                            briefings.set(row.id, info)
                        })
                        resolve(briefings)
                    }
                })
            }
            else {
                let query = `SELECT * FROM briefings WHERE id=?1`
                let values = { 1: id }
                if (name) {
                    query = `SELECT * FROM briefings WHERE name=?1`
                    values = { 1: name }
                }
                db.get(query, values, (err, row) => {
                    if (!row) {
                        if (!id) return
                        db.run(`INSERT INTO briefings (id, name, public, elements, data) VALUES ("${id}", "Untitled Briefing", "false", '[]', '[]')`)
                        resolve([])
                    }
                    else {
                        fs.readFile(`miz/${id}/mission`, "utf8", async (err, mizRaw) => {
                            let mizRawData = null
                            if (!err) mizRawData = await miz.getMissionData(luaJson.parse(mizRaw.toString()))
                            resolve({
                                id: row.id,
                                name: row.name,
                                public: row.public,
                                elements: JSON.parse(row.elements),
                                data: JSON.parse(row.data),
                                miz: mizRawData
                            })
                        })
                    }
                })
            }
        })
    })
}

// Get info on all DCS developers & modules, or for specified developer.
function developerGetInfo(name) {
    return p = new Promise((resolve, reject) => {
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS developers (name TEXT, image TEXT, link TEXT, color TEXT, modules TEXT, extra TEXT)`)
            if (name == "*") {
                let developers = new Map()
                db.all(`SELECT * FROM developers`, (err, rows) => {
                    if (!rows) resolve([])
                    else {
                        rows.forEach(row => {
                            let info = {
                                name: row.name,
                                image: row.image,
                                link: row.link,
                                color: row.color,
                                modules: row.modules,
                                extra: JSON.parse(row.extra)
                            }
                            developers.set(row.name, info)
                        })
                        resolve(developers)
                    }
                })
            }
            else {
                let query = `SELECT * FROM developers WHERE name=?1`
                let values = { 1: name }
                db.get(query, values, (err, row) => {
                    if (!row) {
                        if (!name) return
                        db.run(`INSERT INTO developers (name, image, link, color, modules, extra) VALUES (?1, ?2, ?3, ?4, ?5, ?6)`, { 1: name, 2: "", 3: "", 4: "#fcba03", 5: "A, Module Name, Status", 6: "{}" })
                        resolve([])
                    }
                    else { // For now, don't do anything, might change later.
                        resolve([])
                    }
                })
            }
        })
    })
}

// Export module.
export default db
// module.exports = { db, run, set, get, setUser, getUser, missionAddEvent, missionGetEvent, missionGetInfo, squadronGetInfo, resourceGetInfo, briefingGetInfo, developerGetInfo }