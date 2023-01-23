import db from '../../database.js'

// Get user info based of id, ucid, or key.
export default function getUser(id, ucid, key) {
  return new Promise(resolve => {
    if (id == '*') { // Fetch all users.
      db.all(`SELECT * FROM users`, (err, rows) => {
        if (!rows) resolve([])
        else {
          const users = rows.map(row => {
            return parseUserRow(row)
          })
          resolve(users)
        }
      })
    }
    else { // Fetch specific user.
      db.get(`SELECT * FROM users WHERE id=?1 OR ucid=?2 OR key=?3`, { 1: id, 2: ucid, 3: key }, (err, row) => {
        if (err) { console.log(err); resolve(null) }
        else if (!row) resolve(null)
        else resolve(parseUserRow(row))
      })
    }
  })

  // Parse unit data from db, specifically the JSON.
  function parseUserRow(row) {
    return {
      id: row.id,
      ucid: row.ucid,
      key: row.key,
      data: JSON.parse(row.data)
    }
  }
}