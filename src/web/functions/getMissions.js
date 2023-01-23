import getBriefing from './getBriefing.js'
import getUserInfo from './getUserInfo.js'
import dcsUtils from '../../dcsUtils.js'
import db from '../../database.js'

// Get specific or all missions, only full player
// stats is given if selecting a specific mission.
// (mission = Name of mission).
export default function getMission(mission) {
  return new Promise(async resolve => {
    const missions = new Map()
    
    const briefings = await getBriefing('*')

    const query = mission == '*'
      ? `SELECT * FROM missions`
      : `SELECT * FROM missions WHERE mission=?1`
    const values = mission == '*'
      ? {}
      : { 1: mission }

    db.all(query, values, async (err, rows) => {
      if (err) resolve(null)
      else {
        rows.forEach(row => {
          const data = JSON.parse(row.data)
          let info = missions.get(row.mission)
          if (!info) info = {
            name: row.mission,
            date: '-/-',
            players: [],
            aakills: 0,
            agkills: 0,
            takeoffs: 0,
            landings: 0,
            crashes: 0,
            ejections: 0,
            hasBriefing: !!briefings.find(f => f.name == row.mission)?.public
          }

          if (data.time && info.date == '-/-') {
            info.date = data.time.split(' ')[0]
          }

          // Add list of player's DCS UCID.
          if (data.playerUCID && !info.players.includes(data.playerUCID)) {
            info.players.push(data.playerUCID)
          }

          // Adding to stats from the events.
          if (row.event == 'KILL') {
            const type = dcsUtils.unitType(data.killedUnit)
            if (type == 'A' || type == 'H') info.aakills++
            else if (data.killedUnit != 'Unknown') info.agkills++
          }
          else if (row.event == 'TAKEOFF') info.takeoffs++
          else if (row.event == 'LANDING') info.landings++
          else if (row.event == 'CRASH') info.crashes++
          else if (row.event == 'EJECT') info.ejections++
          
          missions.set(row.mission, info)
        })
        
        if (mission == '*') resolve(sortMissions(missions))
        else { // If fetching specific mission, we'll including all the player stats.
          const FILTER_EVENTS = ['KILL', 'TAKEOFF', 'LANDING', 'CRASH']

          // Filter only the needed events and parse them.
          const events = []
          rows.forEach(row => {
            if (!FILTER_EVENTS.includes(row.event)) return
            const event = JSON.parse(row.data)
            event.type = row.event
            events.push(event)
          })

          // Create an object (promise) for each player.
          const promises = missions.get(mission).players.map(playerUCID => {
            return getPlayerStats(playerUCID, events)
          })

          missions.get(mission).playerStats = await Promise.all(promises)
          resolve(sortMissions(missions.get(mission)))
        }
      }
    })
  })

  // Get full detailed stats & user info for player.
  async function getPlayerStats(playerUCID, events) {
    const firstEvent = events.find(f => f.playerUCID == playerUCID)
    const player = {
      ucid: firstEvent.playerUCID,
      name: firstEvent.playerName,
      aircraft: firstEvent.playerAircraft,
      side: 2, // Assume blue until kill entry.
      icon: dcsUtils.unitIcon(firstEvent.playerAircraft),
      kills: new Map(),
      takeoffs: [],
      landings: [],
      crashes: [],
      user: await getUserInfo(playerUCID)
    }
    
    // Loop through all events and do stuff with them!
    events.forEach(event => {
      if (event.playerUCID != playerUCID) return
      if (event.type == 'KILL') { // Unit kills.
        // Organized into clusters based off unit type + side.
        let killCluster = player.kills.get(`${event.killedUnit} - ${event.killedSide}`)
        if (!killCluster) killCluster = {
          unit: event.killedUnit,
          side: event.killedSide,
          details: []
        }
        killCluster.details.push({
          weapon: event.weapon,
          time: dcsUtils.parseTimeShort(event.time)
        })
        player.side = event.playerSide // Update side.
        player.kills.set(`${event.killedUnit} - ${event.killedSide}`, killCluster)
      }
      else if (event.type == 'TAKEOFF') { // Takeoffs.
        player.takeoffs.push({
          airfield: event.airfield,
          time: dcsUtils.parseTimeShort(event.time)
        })
      }
      else if (event.type == 'LANDING') { // Landings.
        player.landings.push({
          airfield: event.airfield,
          time: dcsUtils.parseTimeShort(event.time)
        })
      }
      else if (event.type == 'CRASH') { // Crashes.
        player.crashes.push({
          time: dcsUtils.parseTimeShort(event.time)
        })
      }
    })

    player.kills = sortPlayers(player.kills)
    return player
  }

  // Utility function to turn map to
  // array and filter "non" missions.
  function sortMissions(map) {
    const missions = Array.from(map, ([index, value]) => value)
    const sorted = []
    missions.forEach(mission => {
      if (mission.players.length <= 2) return
      sorted.unshift(mission)
    })
    return sorted
  }

  function sortPlayers(map) {
    return Array.from(map, ([index, value]) => value)
  }
}