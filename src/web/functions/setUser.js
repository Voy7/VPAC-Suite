import db from '../../database.js'

// Set data for user & create new users.
export default function setUser(id, ucid, key, data) {
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
}