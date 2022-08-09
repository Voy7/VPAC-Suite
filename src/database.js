const dcsUtils = require("./web/dcsUtils")
const sqlite3 = require("sqlite3")
const db = new sqlite3.Database("./database.sqlite")
const fs = require("fs")
const miz = require("./web/mizUtils")
const luaJson = require("luaparse")

// Run given query/queries.
function run(queries) {
    if (!Array.isArray(queries)) queries = [queries]
    db.serialize(() => {
        queries.forEach(query => {
            db.run(query)
        })
    })
}

// Replace all data in table with given JSON.
function set(table, data) {
    db.serialize(() => {
        db.run(`DROP TABLE IF EXISTS ${table}`)
        db.run(`CREATE TABLE IF NOT EXISTS ${table} (data TEXT)`)
        db.run(`REPLACE INTO ${table} VALUES ('${JSON.stringify(data)}')`)
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
    let where = `WHERE id = '${id}' OR ucid = '${ucid}' OR key = '${key}'`
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS users (id TEXT, ucid TEXT, key TEXT, data TEXT)`)
        db.get(`SELECT * FROM users ${where}`, (err, row) => {
            if (!row) {
                if (id != null && ucid != null && key != null) {
                    db.run(`INSERT INTO users (id, ucid, key, data) VALUES ('${id}', '${ucid}', '${key}', '${JSON.stringify(data)}')`)
                }
            }
            else {
                if (key != null) {
                    if (ucid != null) db.run(`UPDATE users SET ucid = '${ucid}', data = '${JSON.stringify(data)}' WHERE key = '${key}'`)
                    else db.run(`UPDATE users SET data = '${JSON.stringify(data)}' WHERE key = '${key}'`)
                }
                else if (id != null) db.run(`UPDATE users SET data = '${JSON.stringify(data)}' WHERE id = '${id}'`)
                else if (ucid != null) db.run(`UPDATE users SET data = '${JSON.stringify(data)}' WHERE ucid = '${ucid}'`)
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
            db.get(`SELECT * FROM users WHERE id ='${id}' OR ucid = '${ucid}' OR key = '${key}'`, (err, row) => {
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

function missionAddEvent(mission, event, data) {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS missions (mission TEXT, event TEXT, data TEXT)`)
        db.run(`INSERT INTO missions (mission, event, data) VALUES ('${mission}', '${event}', '${JSON.stringify(data)}')`)
    })
}

function missionGetEvent(mission, event) {
    return p = new Promise((resolve, reject) => {
        let where = ` WHERE mission = "${mission}"`
        if (event != null) where += ` AND event = "${event}"`
        db.all(`SELECT * FROM missions${where}`, (err, rows) => {
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

function missionGetInfo(mission) {
    return p = new Promise((resolve, reject) => {
        const missions = new Map()
        let where = ""
        if (mission != "*") where = `WHERE mission = "${mission}"`
        db.all(`SELECT * FROM missions ${where}`, (err, rows) => {
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
                        else info.agkills++
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

function squadronGetInfo(id, role) {
    return p = new Promise((resolve, reject) => {
        let data = { description: "description.", callsigns: "C1,C2,C3", airframes: "A1,A2,A3", checkride: "No checkride info" }
        db.serialize(() => {
            db.run(`CREATE TABLE IF NOT EXISTS squadrons (id TEXT, role TEXT, data TEXT)`)
            db.get(`SELECT * FROM squadrons WHERE id = "${id}"`, (err, row) => {
                if (!row) {
                    db.run(`INSERT INTO squadrons (id, role, data) VALUES ("${id}", "${role}", '${JSON.stringify(data)}')`)
                    resolve(data)
                }
                else resolve(JSON.parse(row.data))
            })
        })
    })
}

function resourceGetInfo(resource) {
    return p = new Promise((resolve, reject) => {
        const resources = new Map()
        let where = ""
        if (resource != "*") where = `WHERE resource = "${resource}"`
        db.all(`SELECT * FROM resources ${where}`, (err, rows) => {
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

function briefingGetInfo(id, name) {
    return p = new Promise((resolve, reject) => {
        // let data = { description: "description.", callsigns: "C1,C2,C3", airframes: "A1,A2,A3" }
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
                let select = `SELECT * FROM briefings WHERE id = "${id}"`
                if (name) `SELECT * FROM briefings WHERE name = "${name}"`
                db.get(select, (err, row) => {
                    if (!row) {
                        if (!id) return
                        db.run(`INSERT INTO briefings (id, name, public, elements, data) VALUES ("${id}", "Untitled Briefing", "false", '[]', '[]')`)
                        resolve([])
                    }
                    else {
                        // const mizRaw = await fs.readFileSync(`miz/${id}/mission`)
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

// Export modules.
module.exports = { run, set, get, setUser, getUser, missionAddEvent, missionGetEvent, missionGetInfo, squadronGetInfo, resourceGetInfo, briefingGetInfo }