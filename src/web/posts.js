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
        db.run(`UPDATE missions SET mission=?1 WHERE mission=?2`, { 1: req.body.missionName.replace(/ /g, '_'), 2: req.body.mission })
        res.redirect("/admin")
    })

    app.post("/mission_delete", async (req, res) => {
        if (!await authUser(req, res)) return
        db.run(`DELETE FROM missions WHERE mission=?1`, { 1: req.body.mission })
        res.redirect("/admin")
    })

    app.post("/squadron_update", async (req, res) => {
        if (!await authUser(req, res)) return
        let data = {
            description: req.body.squadronDescription,
            callsigns: req.body.squadronCallsigns,
            airframes: req.body.squadronAirframes,
            checkride: req.body.squadronCheckride
        }
        db.run(`UPDATE squadrons SET data=?1 WHERE id=?2`, { 1: JSON.stringify(data), 2: req.body.squadron })
        res.redirect("/admin")
    })

    app.post("/briefing_create", async (req, res) => {
        if (!await authUser(req, res)) return
        const id = Date.now().toString()
        await db.briefingGetInfo(id)
        const briefings = await db.briefingGetInfo("*")
        if (briefings.get(req.body.briefingClone)) {
            const clone = await db.briefingGetInfo(req.body.briefingClone)
            db.run(`UPDATE briefings SET name=?1, elements=?2, data=?3 WHERE id=?4`, { 1: req.body.briefingName, 2: JSON.stringify(clone.elements), 3: JSON.stringify(clone.data), 4: id })
            if (!fse.existsSync(`miz/${req.body.briefingClone}/`)) return
            fse.cp(`miz/${req.body.briefingClone}/`, `miz/${id}/`, { recursive: true }, err => {
                res.redirect(`/briefing-editor/${id}`)
            })
        }
        else {
            db.run(`UPDATE briefings SET name=?1 WHERE id=?2`, { 1: req.body.briefingName, 2: id })
            res.redirect(`/briefing-editor/${id}`)
        }
    })

    app.post("/briefing_delete", async (req, res) => {
        if (!await authUser(req, res)) return
        db.run(`DELETE FROM briefings WHERE id=?1`, { 1: req.body.briefing })
        res.redirect("/admin")
    })
}

// Export module.
module.exports = main