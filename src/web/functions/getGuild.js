import db from '../../database.js'

// Get the Discord guild object, members, roles, etc.
export default function getGuld() {
  return new Promise(resolve => {
    db.get(`SELECT * FROM guild`, (err, row) => {
      if (err) { console.log(err); resolve(null) }
      else resolve(JSON.parse(row.data))
    })
  })
}