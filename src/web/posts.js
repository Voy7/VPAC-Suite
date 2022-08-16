const fse = require("fs-extra")
const db = require("../database")

function main(g, app, render, getLoginInfo) {
    async function authUser(req, res) {
        let info = await getLoginInfo(req.session.key)
        if (info) return true
        else {
            console.log(`Failed to authorize post: ${req.url}`.yellow)
            render(req, res, "unknown", {}, { notAdmin: true })
        }
    }

    // Fix sql syntax errors.
    function fs(text) {
        return text.replace(/"/g, `'`)
    }

    app.post("/mission_update", async (req, res) => {
        if (!await authUser(req, res)) return
        db.run(`UPDATE missions SET mission = "${fs(req.body.missionName).replace(/ /g, '_')}" WHERE mission = "${req.body.mission}"`)
        res.redirect("/admin")
    })

    app.post("/mission_delete", async (req, res) => {
        if (!await authUser(req, res)) return
        db.run(`DELETE FROM missions WHERE mission = "${req.body.mission}"`)
        res.redirect("/admin")
    })

    app.post("/squadron_update", async (req, res) => {
        if (!await authUser(req, res)) return
        let data = {
            'description': req.body.squadronDescription.replace(/'/g, "@1;"),
            'callsigns': req.body.squadronCallsigns.replace(/'/g, "@1;"),
            'airframes': req.body.squadronAirframes.replace(/'/g, "@1;"),
            'checkride': req.body.squadronCheckride.replace(/'/g, "@1;")
        }
        db.run(`UPDATE squadrons SET data = '${JSON.stringify(data)}' WHERE id = "${req.body.squadron}"`)
        res.redirect("/admin")
    })

    app.post("/briefing_create", async (req, res) => {
        if (!await authUser(req, res)) return
        const id = Date.now().toString()
        await db.briefingGetInfo(id)
        const briefings = await db.briefingGetInfo("*")
        if (briefings.get(req.body.briefingClone)) {
            const clone = await db.briefingGetInfo(req.body.briefingClone)
            db.run(`UPDATE briefings SET name='${req.body.briefingName}', elements='${JSON.stringify(clone.elements)}', data='${JSON.stringify(clone.data)}' WHERE id = ${id}`)
            if (!fse.existsSync(`miz/${req.body.briefingClone}/`)) return
            fse.cp(`miz/${req.body.briefingClone}/`, `miz/${id}/`, { recursive: true }, err => {
                res.redirect(`/briefing-editor/${id}`)
            })
        }
        else {
            db.run(`UPDATE briefings SET name='${req.body.briefingName}' WHERE id = ${id}`)
            res.redirect(`/briefing-editor/${id}`)
        }
    })

    app.post("/briefing_delete", async (req, res) => {
        if (!await authUser(req, res)) return
        db.run(`DELETE FROM briefings WHERE id = "${req.body.briefing}"`)
        res.redirect("/admin")
    })
}

// Export module.
module.exports = main