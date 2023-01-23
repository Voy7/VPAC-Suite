import getGuild from '/functions/getGuild.js'
import db from '../../database.js'

const squadronRoles = JSON.parse(process.env.SQUADRONS)

// Get all squadrons, including it's members.
export default async function getSquadrons() {
  const guild = await getGuild()
  
  const promises = squadronRoles.map(squadron => {
    return getSquadronInfo(squadron)
  })

  return Promise.all(promises)

  // Seperate function to allow multiple promises.
  async function getSquadronInfo(squadron) {
    const info = await new Promise((resolve, reject) => {
      const data = { description: "description.", callsigns: "Callsign 1, Callsign 2, Callsign 3", airframes: "Airframe 1 & Airframe 2", checkride: "No checkride info" }
      db.get(`SELECT * FROM squadrons WHERE id=?1`, { 1: squadron.short }, (err, row) => {
        if (!row) {
          db.run(`INSERT INTO squadrons (id, role, data) VALUES (?1, ?2, ?3)`, { 1: squadron.short, 2: squadron.role, 3: JSON.stringify(data) })
          resolve(data)
        }
        else resolve(JSON.parse(row.data))
      })
    })
    
    const role = guild.roles.find(f => f.id == squadron.role)
    
    const members = []
    guild.members.forEach(member => {
      if (!member.roles.includes(squadron.role)) return
      members.push({
        id: member.id,
        name: member.name,
        nickname: member.nickname ? member.nickname : member.name,
        avatar: member.avatar
      })
    })

    return {
      id: role.id,
      name: role.name,
      icon: role.icon,
      color: role.color,
      short: squadron.short,
      description: info.description,
      checkride: info.checkride,
      airframes: info.airframes.split(","),
      callsigns: info.callsigns.split(","),
      members: members
    }
  }
}