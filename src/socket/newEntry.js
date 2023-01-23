import addMissionEvent from '../web/functions/addMissionEvent.js'
import setUser from '../web/functions/setUser.js'

// Called when DCS socket client sends something.
export default function newEntry(args, clients, clientAddress) {
  if (!args[1]) return
  const mission = args[1].replace(/ /g, '_')

  // -- Parse and submit all these events. --
  // Player status (e.g in menu, loading, playing).
  if (args[0] == 'STATUS') {
    clients.set(clientAddress, args[1])
    setUser(null, args[1], args[2], {
      status: args[4],
      version: args[3],
      multiplayer: args[5],
      mission: args[6],
      map: args[7],
      aircraft: args[8]
    })
  }

  // Player kills something.
  if (args[0] == 'KILL') {
    addMissionEvent(mission, 'KILL', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      playerSide: args[5],
      killedID: args[6],
      killedUnit: args[7],
      killedSide: args[8],
      weapon: args[9],
      time: args[10]
    })
  }

  // Player takeoffs from airport.
  if (args[0] == 'TAKEOFF') {
    addMissionEvent(mission, 'TAKEOFF', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      playerSide: args[5],
      airfield: args[6],
      time: args[7]
    })
  }

  // Player lands at airport.
  if (args[0] == 'LANDING') {
    addMissionEvent(mission, 'LANDING', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      playerSide: args[5],
      airfield: args[6],
      time: args[7]
    })
  }

  // Player ejects from aircraft.
  if (args[0] == 'EJECT') {
    addMissionEvent(mission, 'EJECT', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      time: args[5]
    })
  }

  // Player destroys their aircraft.
  if (args[0] == 'CRASH') {
    addMissionEvent(mission, 'CRASH', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      time: args[5]
    })
  }

  // Player's pilot dies.
  if (args[0] == 'DEATH') {
    addMissionEvent(mission, 'DEATH', {
      playerUCID: args[2],
      playerName: args[3],
      playerAircraft: args[4],
      time: args[5]
    })
  }

  // Mission ends.
  if (args[0] == 'END') {
    addMissionEvent(mission, 'END', { time: args[5] })
  }

  // All 'custom' events, or events from the mission
  // scripting enviorement that needs furter parsing.
  if (args[0] == 'CUSTOM') {
    
    // Carrier trap grades.
    if (args[3] == 'TRAP') {
      addMissionEvent(mission, 'TRAP', {
        playerName: args[4],
        carrier: args[5],
        comment: args[6],
        time: args[7]
      })
    }
  }
}