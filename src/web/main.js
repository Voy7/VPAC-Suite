// Import node modules & start express.
const express = require("express")
const app = express()
const https = require("https")
const cors = require("cors")
const session = require("express-session")
const fs = require("fs")
const zip = require("zip-lib")
const luaJson = require("luaparse")
const db = require("../database")
const dcs = require("./dcsUtils")
const miz = require("./mizUtils")
const root = "./src/web/client/"

// Main website function.
function main(g) {
    // Set express settings.
    app.set("view engine", "ejs")
    app.set("views", "src/web/views/")
    app.use(cors())
    app.use(express.urlencoded({ extended: false }))
    app.set('trust proxy', true)
    app.use(session({
        secret: "VoyIsAwesome",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }
    }))
    
    // Custom URL requests with more info.
    app.get("/", async (req, res) => {
        let squadrons = await squadronsAndMembers(g.config.web.squadrons)
        render(req, res, "home", { squadrons, dcs })
    })

    app.get("/squadrons", async (req, res) => {
        let squadrons = await squadronsAndMembers(g.config.web.squadrons)
        render(req, res, "squadrons", { squadrons, dcs })
    })

    app.get("/missions", async (req, res) => {
        let missions = await db.missionGetInfo("*")
        let briefings = await db.briefingGetInfo("*")
        render(req, res, "missions", { missions, briefings })
    })

    app.get("/resources", async (req, res) => render(req, res, "resources"))

    app.get("/briefing", async (req, res) => {
        let data = await fs.readFileSync(`./mission`)
        data = await miz.getMissionData(luaJson.parse(data.toString()))
        render(req, res, "briefing", { data, dcs })
    })

    app.get("/admin", async (req, res) => {
        let squadrons = await squadronsAndMembers(g.config.web.squadrons)
        let missions = await db.missionGetInfo("*")
        let resources = await db.resourceGetInfo("*")
        let briefings = await db.briefingGetInfo("*")
        render(req, res, "admin", { squadrons, missions, resources, briefings }, { adminOnly: true })
    })

    app.get("/database", async (req, res) => {
        let guild = await db.get("guild")
        let users = await db.getUser("*")
        render(req, res, "database", { guild, users }, { adminOnly: true })
    })

    app.get("/login", (req, res) => {
        if (req.query.r) req.session.redirect = req.query.r
        render(req, res, "login")
    })

    // Logining in logic.
    app.post("/login", async (req, res) => {
        req.session.key = req.body.key
        let info = await getLoginInfo(req.body.key)
        if (info) { // Success, and redirect them if available.
            if (req.session.redirect) res.redirect(req.session.redirect)
            else res.redirect("/")
        } // Failed, give them the "unknown" error.
        else render(req, res, "login", { unknown: true })
    })

    // Logging out logic.
    app.get("/logout", (req, res) => {
        req.session.key = null
        if (req.query.r) res.redirect(req.query.r)
        else res.redirect("/")
    })

    // Import other post handlers.
    require("./posts") (g, app, render, getLoginInfo)

    // Custom URLs with arguments.
    app.use(async (req, res) => {
        let wasCustom = false

        // Custom dynamic URLs with arguments.
        if (req.url.startsWith("/mission/")) {
            wasCustom = true
            let mission = req.url.split("/")[2]
            let info = await db.missionGetInfo(mission)
            let briefings = await db.briefingGetInfo("*")
            let briefing = null
            briefings.forEach(brief => {
                if (brief.public != "true") return
                if (brief.name == mission) briefing = brief
            })
            if (briefing) briefing = await db.briefingGetInfo(briefing.id)
            // console.log(briefing)
            if (info.get(mission) || briefing) {
                info = info.get(mission)
                let events = await db.missionGetEvent(mission, null)
                let users = await db.getUser("*")
                let guild = await db.get("guild")
                let userList = []
                guild.members.forEach(member => {
                    users.forEach(user => {
                        if (member.id != user.id) return
                        let nickname = member.nickname
                        if (!nickname) nickname = member.name
                        userList.push({
                            ucid: user.ucid,
                            name: member.name,
                            nickname: nickname,
                            avatar: member.avatar
                        })
                    })
                })
                render(req, res, "mission", { mission, info, events, userList, briefing, dcs })
            }
            else render(req, res, "unknown")
        }

        if (req.url.startsWith("/briefing-editor/")) {
            wasCustom = true
            let id = req.url.split("/")[2]
            // console.log(briefing)
            let briefing = (await db.briefingGetInfo(id))
            // console.log(info)
            // console.log(briefing)
            let mizData = null
            fs.readFile(`miz/${id}/mission`, "utf8", async (err, data) => {
                if (!err) {
                    // console.log(data.toString())
                    mizData = await miz.getMissionData(luaJson.parse(data.toString()))
                }
                if (briefing) {
                    // render(req, res, "briefingEditor", { info }, { adminOnly: true })
                    render(req, res, "briefingEditor", { briefing, mizData }, { adminOnly: false })
                }
                else render(req, res, "unknown")
            })
        }

        // Non-custom URLs.
        if (!wasCustom) {
            res.sendFile(__dirname + `/client/${req.url}`, err => {
                if (err) {
                    render(req, res, "unknown")
                    if (g.config.log.unknownFile) console.log(`[${(new Date).toLocaleTimeString()}] `.gray + `[WEB] [${req.ip}] unknown file: ${req.url}`.yellow)
                }
                else if (g.config.log.sentFile) console.log(`[${(new Date).toLocaleTimeString()}] `.gray + `[WEB] [${req.ip}] sent file: ${req.url}`.cyan)
            })
        }
    })

    // Main function to render views with login info included.
    async function render(req, res, view, vars, options) {
        let loginInfo = await getLoginInfo(req.session.key)
        if (!vars) vars = {}
        if (!options) options = {}
        vars.loginInfo = loginInfo
        if (options.adminOnly && !loginInfo) res.redirect(`/login?r=${req.url}`)
        else if (options.adminOnly && !loginInfo.admin) render(req, res, "unknown", { notAdmin: true })
        else res.render(view, vars)
        if (g.config.log.visitLink) console.log(`[${(new Date).toLocaleTimeString()}] `.gray + `[WEB] [${req.ip}] visited: ${view}`.cyan)
    }

    const server = https.createServer({
        key: fs.readFileSync("ssl/key.pem"),
        cert: fs.readFileSync("ssl/cert.pem"),
    }, app)

    server.listen(g.config.web.port, ()=>{
        let host = server.address().address
        let port = server.address().port
        console.log(`[WEB] Web server listening on: ${host}:${port}`.green)
    })

    // Set web server to listen on port.
    // const server = app.listen(g.config.web.port, () => {
        // let host = server.address().address
        // let port = server.address().port
        // console.log(`Web server listening on ${host}:${port}`.green)
    // })

    // SocketIO section
    const io = require("socket.io")(server, {
        maxHttpBufferSize: 1e8 // 10 MB
    })

    // Socket requests & emits.
    io.sockets.on("connection", socket => {
        socket.on("briefing-update", async briefing => {
            console.log(briefing)
            db.run(`UPDATE briefings SET name='${briefing.name}', public='${briefing.public}', elements='${JSON.stringify(briefing.elements)}', data='${JSON.stringify(briefing.data)}' WHERE id = ${briefing.id}`)
        })

        socket.on("upload-miz", async ({ id, file }) => {
            console.log(file)
            fs.mkdir(`miz/${id}/`, err => {
                fs.writeFile(`miz/${id}/file.miz`, file, err => {
                    if (!err) {
                        zip.extract(`miz/${id}/file.miz`, `miz/${id}/`).then(() => {
                            fs.readFile(`miz/${id}/mission`, "utf8", async (err, data) => {
                                if (!err) {
                                    // console.log(data.toString())
                                    const mizData = await miz.getMissionData(luaJson.parse(data.toString()))
                                    socket.emit("miz-data", { data: mizData })
                                }
                                else {
                                    console.log(err)
                                    socket.emit("miz-upload-failed")        
                                }
                            })
                        }, err => {
                            console.log(err)
                            socket.emit("miz-upload-failed")
                        })
                    }
                    else {
                        console.log(err)
                        socket.emit("miz-upload-failed")
                    }
                })
            })
        })
    })

    // Fetch user name / profile login info.
    async function getLoginInfo(key) {
        let users = await db.getUser("*")
        let guild = await db.get("guild")
        let loginInfo = null
        users.forEach(user => {
            if (user.key != key) return
            guild.members.forEach(member => {
                if (member.id != user.id) return
                let isAdmin = false
                if (g.config.web.admins.includes(key)) isAdmin = true
                loginInfo = {
                    name: member.nickname,
                    avatar: member.avatar,
                    ucid: user.ucid,
                    admin: isAdmin
                }
            })

        })
        return loginInfo
    }
}



// Fetch & parse squadrons & members, then emit.
async function squadronsAndMembers(squadronRoles) {
    let users = await db.getUser("*")
    let guild = await db.get("guild")

    let squadrons = []
    squadronRoles.forEach(async squadron => {
        let info = await db.squadronGetInfo(squadron.abbreviation, squadron.role)
        let roleData = []
        let memberData = []
        guild.roles.forEach(role => {
            if (role.id != squadron.role) return
            roleData = {
                id: role.id,
                name: role.name,
                icon: role.icon,
                color: squadron.color,
                abbreviation: squadron.abbreviation,
                description: info.description,
                checkride: info.checkride,
                airframes: info.airframes.split(","),
                callsigns: info.callsigns.split(",")
            }
        })

        guild.members.forEach(member => {
            if (!member.roles.includes(squadron.role)) return
            let nickname = member.name
            if (member.nickname != null) nickname = member.nickname
            let data = []
            users.forEach(user => {
                if (user.id == member.id) data = user.data
            })
            memberData.push({ id: member.id, name: member.name, avatar: member.avatar, nickname, data })
        })
        squadrons.push({ squadron: roleData, members: memberData })
    })
    return squadrons
}

// Export module.
module.exports = main