// Import node modules & start express.
const express = require("express")
const app = express()
const https = require("https")
const cors = require("cors")
const session = require("express-session")
const fs = require("fs")
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
    app.set('trust proxy', 1)
    app.use(session({
        secret: "VoyIsAwesome",
        resave: true,
        saveUninitialized: true,
        cookie: { secure: false }
    }))

    // Simple custom URL requests.
    app.get("/", async (req, res) => {
        let squadrons = await squadronsAndMembers(g.config.web.squadrons)
        render(req, res, "home", { squadrons })
    })

    app.get("/resources", async (req, res) => render(req, res, "resources"))
    
    // Custom URL requests with more info.
    app.get("/login", (req, res) => {
        if (req.query.r) req.session.redirect = req.query.r
        render(req, res, "login")
    })

    app.get("/squadrons", async (req, res) => {
        let squadrons = await squadronsAndMembers(g.config.web.squadrons)
        render(req, res, "squadrons", { squadrons })
    })

    app.get("/missions", async (req, res) => {
        let missions = await db.missionGetInfo("*")
        render(req, res, "missions", { missions })
    })

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
            let info = (await db.missionGetInfo(mission))
            if (info.get(mission)) {
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
                render(req, res, "mission", { mission, info, events, userList, dcs })
            }
            else render(req, res, "unknown")
        }

        if (req.url.startsWith("/briefing-editor/")) {
            wasCustom = true
            let briefing = req.url.split("/")[2]
            console.log(briefing)
            let info = (await db.briefingGetInfo(briefing))
            console.log(info)
            if (info) {
                render(req, res, "briefingEditor", { info }, { adminOnly: true })
            }
            else render(req, res, "unknown")
        }

        // Non-custom URLs.
        if (!wasCustom) {
            console.log(`REQUEST: ${req.url}`.cyan)
            res.sendFile(__dirname + `/client/${req.url}`, err => {
                if (err) render(req, res, "unknown")
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
    }

    const server = https.createServer({
        key: fs.readFileSync("ssl/key.pem"),
        cert: fs.readFileSync("ssl/cert.pem"),
    }, app)

    server.listen(g.config.web.port, ()=>{
        let host = server.address().address
        let port = server.address().port
        console.log(`Web server listening on ${host}:${port}`.green)
    })

    // Set web server to listen on port.
    // const server = app.listen(g.config.web.port, () => {
        // let host = server.address().address
        // let port = server.address().port
        // console.log(`Web server listening on ${host}:${port}`.green)
    // })

    // SocketIO section
    const socketIO = require("socket.io")
    io = socketIO(server)

    // Socket requests & emits.
    io.sockets.on("connection", socket => {
        socket.on("briefing-update", async briefing => {
            console.log(briefing)
            db.run(`UPDATE briefings SET name='${briefing.name}', data='${JSON.stringify(briefing.data)}' WHERE id = ${briefing.id}`)
            io.sockets.emit("briefing-data", briefing)
        })
        // socket.on("request-events", async () => {
        //     let events = await db.get("events")
        //     socket.emit("event-list", { data: events })

        //     setInterval(async () => {
        //         let events = await db.get("events")
        //         socket.emit("event-list", { data: events })
        //     }, 3000)
        // })
        
        // socket.on("request-squadrons-and-members", async () => {
        //     squadronsAndMembers(socket, g.config.web.squadrons)
        // })

        // socket.on("request-missions", async () => {
        //     let missions = await db.getMissions()
        //     socket.emit("missions", { missions })
        // })

        // socket.on("request-mission", async mission => {
        //     let events = await db.missionGetEvent(mission, null)
        //     let users = await db.getUser("*")
        //     let guild = await db.get("guild")
        //     let userList = []

        //     guild.members.forEach(member => {
        //         users.forEach(user => {
        //             if (member.id != user.id) return
        //             let nickname = member.nickname
        //             if (!nickname) nickname = member.name
        //             userList.push({
        //                 ucid: user.ucid,
        //                 name: member.name,
        //                 nickname: nickname,
        //                 avatar: member.avatar
        //             })
        //         })
        //     })
        //     socket.emit("mission", { events, userList })
        // })
    })

    // Update squadrons & members for sockets every 5 seconds.
    // setInterval(() => { squadronsAndMembers(io, g.config.web.squadrons) }, 5000999)

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