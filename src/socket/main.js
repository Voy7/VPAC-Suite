const net = require("net")
const db = require("../database")

const clients = new Map()

// Main TCP socket function.
function main(g) {
    g.socket = net.createServer()

    // Set TCP socket to listen on IP & port.
    g.socket.listen(g.config.socket.port, g.config.socket.host, () => { 
        console.log(`TCP socket listening on ${g.config.socket.host}:${g.config.socket.port}`.green)
    })

    // On new connect, add IP to clients list for later use.
    g.socket.on("connection", (socket) => { 
        let clientAddress = `${socket.remoteAddress}:${socket.remotePort}`
        clients.set(clientAddress, null)
        if (g.config.log.socketConnect) console.log(`Socket connected: ${clientAddress}`.green)
   
        // When new data is sent, parse it in entry.js.
        socket.on("data", data => {
            if (g.config.log.socketStatus && data.toString().startsWith("STATUS;")) console.log(`${clientAddress}: `.cyan + `${data}`.gray)
            else if (g.config.log.socketEntry) console.log(`${clientAddress}: `.cyan + `${data}`.gray)
            data.toString().split(";;").forEach(entry => {
                if (entry == "") return
                let args = entry.split(";")
                require("./entry") (socket, args, clients, clientAddress)
            })
        })

        // When connection closes, see if a ucid was set for
        // the client IP and then set their status to nothing.
        socket.on("close", (data) => { 
            if (g.config.log.socketConnect) console.log(`Socket closed: ${clientAddress}`.yellow)
            db.setUser(null, clients.get(clientAddress), null, [])
        })

        // Log any socket errors.
        socket.on("error", (err) => { 
            console.log(`Error occurred in ${clientAddress}: ${err.message}`.red)
            db.setUser(null, clients.get(clientAddress), null, [])
        })
    })
}

// Export module.
module.exports = main