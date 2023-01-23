import db from '../../database.js'

// Get info on all DCS developers & modules.
export default function getDCSModules() {
  return new Promise(resolve => {
    db.all(`SELECT * FROM developers`, (err, rows) => {
      if (!rows) resolve([])
      else {
        const developers = rows.map(row => {
          return {
            name: row.name,
            image: row.image,
            link: row.link,
            color: row.color,
            modules: row.modules,
            extra: JSON.parse(row.extra)
          }
        })
        resolve(developers)
      }
    })
  })
}