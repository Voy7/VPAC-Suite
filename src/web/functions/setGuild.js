import db from '../../database.js'

// Set/replace the Discord guild object in the database.
export default function setGuild(data) {
  db.serialize(() => {
    db.run(`INSERT OR REPLACE INTO guild (id, data) VALUES ("main", ?1)`, { 1: JSON.stringify(data) })
  })
}