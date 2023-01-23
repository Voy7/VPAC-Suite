import db from '../../database.js'

// Set/replace the Discord guild object in the database.
export default function setGuild(data) {
  db.serialize(() => {
    db.run(`DELETE FROM guild`)
    db.run(`REPLACE INTO guild VALUES (?1)`, { 1: JSON.stringify(data) })
  })
}