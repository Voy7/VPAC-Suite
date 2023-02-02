import db from '../../database.js'

// Get specific or all missions, only full player
// stats is given if selecting a specific mission.
// (mission = Name of mission, options.createIfNull = boolean).
export default function getBriefings(briefing, name, options) {
  return new Promise(resolve => {
    const query = briefing == '*'
      ? `SELECT * FROM briefings`
      : `SELECT * FROM briefings WHERE id=?1 OR name=?2`
    const values = briefing == '*'
      ? {}
      : { 1: briefing, 2: briefing }
    
    db.all(query, values, (err, rows) => {
      if (err) resolve(null)
      else {
        if (briefing == '*') {
          const briefings = rows.map(row => {
            return {
              name: row.name,
              id: row.id,
              public: row.public == 'true'
            }
          })

          resolve(briefings)
        }
      }
    })
  //   if (id == "*") {
  //     let briefings = new Map()
  //     db.all(`SELECT * FROM briefings`, (err, rows) => {
  //         if (!rows) resolve([])
  //         else {
  //             rows.forEach(row => {
  //                 let data = JSON.parse(row.data)
  //                 let info = briefings.get(row.id)
  //                 if (!info) info = {
  //                     id: row.id,
  //                     name: row.name,
  //                     public: row.public
  //                 }
  //                 briefings.set(row.id, info)
  //             })
  //             resolve(briefings)
  //         }
  //     })
  // }
  // else {
  //     let query = `SELECT * FROM briefings WHERE id=?1`
  //     let values = { 1: id }
  //     if (name) {
  //         query = `SELECT * FROM briefings WHERE name=?1`
  //         values = { 1: name }
  //     }
  //     db.get(query, values, (err, row) => {
  //         if (!row) {
  //             if (!id) return
  //             db.run(`INSERT INTO briefings (id, name, public, elements, data) VALUES ("${id}", "Untitled Briefing", "false", '[]', '[]')`)
  //             resolve([])
  //         }
  //         else {
  //             fs.readFile(`miz/${id}/mission`, "utf8", async (err, mizRaw) => {
  //                 let mizRawData = null
  //                 if (!err) mizRawData = await miz.getMissionData(luaJson.parse(mizRaw.toString()))
  //                 resolve({
  //                     id: row.id,
  //                     name: row.name,
  //                     public: row.public,
  //                     elements: JSON.parse(row.elements),
  //                     data: JSON.parse(row.data),
  //                     miz: mizRawData
  //                 })
  //             })
  //         }
  //     })
  // }
  })
}