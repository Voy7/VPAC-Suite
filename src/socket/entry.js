const db = require("../database")

// Called when DCS socket client sends something.
function entry(socket, args, clients, clientAddress) {
    if (!args[1]) return
    let mission = args[1].replace(/ /g, "_")

    // -- Parse and submit all these events. --
    // Player status (e.g in menu, loading, playing).
    if (args[0] == "STATUS") {
        clients.set(clientAddress, args[1])
        let status = {
            status: args[4],
            version: args[3],
            multiplayer: args[5],
            mission: args[6],
            map: args[7],
            aircraft: args[8]
        }
        db.setUser(null, args[1], args[2], status)
    }

    // Player kills something.
    if (args[0] == "KILL") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            playerSide: args[5],
            killedID: args[6],
            killedUnit: args[7],
            killedSide: args[8],
            weapon: args[9],
            time: args[10]
        }
        db.missionAddEvent(mission, "KILL", data)
    }

    // Player takeoffs from airport.
    if (args[0] == "TAKEOFF") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            playerSide: args[5],
            airfield: args[6],
            time: args[7]
        }
        db.missionAddEvent(mission, "TAKEOFF", data)
    }

    // Player lands at airport.
    if (args[0] == "LANDING") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            playerSide: args[5],
            airfield: args[6],
            time: args[7]
        }
        db.missionAddEvent(mission, "LANDING", data)
    }

    // Player ejects from aircraft.
    if (args[0] == "EJECT") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            time: args[5]
        }
        db.missionAddEvent(mission, "EJECT", data)
    }

    // Player destroys their aircraft.
    if (args[0] == "CRASH") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            time: args[5]
        }
        db.missionAddEvent(mission, "CRASH", data)
    }

    // Player's pilot dies.
    if (args[0] == "DEATH") {
        let data = {
            playerUCID: args[2],
            playerName: args[3],
            playerAircraft: args[4],
            time: args[5]
        }
        db.missionAddEvent(mission, "DEATH", data)
    }

    // Mission ends.
    if (args[0] == "END") {
        let data = { time: args[5] }
        db.missionAddEvent(mission, "END", data)
    }

    // All "custom" events, or events from the mission
    // scripting enviorement that need furter parsing.
    if (args[0] == "CUSTOM") {
        
        // Carrier trap grades.
        if (args[3] == "TRAP") {
            let data = {
                playerName: args[4],
                carrier: args[5],
                comment: args[6],
                time: args[7]
            }
            db.missionAddEvent(mission, "TRAP", data)
        }
    }
}

// Export module.
module.exports = entry