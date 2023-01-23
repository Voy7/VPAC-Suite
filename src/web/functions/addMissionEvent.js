import db from '../../database.js'

// Add an event with a mission name to the database.
export default function addMissionEvent(mission, event, data) {
  db.run(`INSERT INTO missions (mission, event, data) VALUES (?1, ?2, ?3)`, { 1: mission, 2: event, 3: JSON.stringify(data) })
}