import newEntry from './newEntry.js'
import setUser from '../web/functions/setUser.js'
import net from 'net'

const clients = new Map()

// Main TCP socket function.
export default function initializeTCPSocket() {
  const socket = net.createServer()

  // Set TCP socket to listen on IP & port.
  socket.listen(process.env.SOCKET_PORT, process.env.SOCKET_HOST, () => { 
    console.log(`TCP socket listening on ${process.env.SOCKET_HOST}:${process.env.SOCKET_PORT}`.green)
  })

  // On new connect, add IP to clients list for later use.
  socket.on('connection', connection => { 
    const clientAddress = `${connection.remoteAddress}:${connection.remotePort}`
    clients.set(clientAddress, null)
    if (process.env.LOG_SOCKET_CONNECT) console.log(`Socket connected: ${clientAddress}`.green)
   
    // When new data is sent, parse it in entry.js.
    connection.on('data', data => {
      if (process.env.LOG_SOCKET_STATUS && data.toString().startsWith('STATUS;')) console.log(`${clientAddress}: `.cyan + `${data}`.gray)
      else if (process.env.LOG_SOCKET_ENTRY) console.log(`${clientAddress}: `.cyan + `${data}`.gray)
      data.toString().split(';;').forEach(entry => {
        if (entry == '') return
        const args = entry.split(';')
        newEntry(args, clients, clientAddress)
      })
    })

    // When connection closes, see if a ucid was set for
    // the client IP and then set their status to nothing.
    connection.on('close', (data) => { 
      if (process.env.LOG_SOCKET_CONNECT) console.log(`Socket closed: ${clientAddress}`.yellow)
      setUser(null, clients.get(clientAddress), null, [])
    })

    // Log any socket errors.
    connection.on('error', (err) => { 
      console.log(`Error occurred in ${clientAddress}: ${err.message}`.red)
      setUser(null, clients.get(clientAddress), null, [])
    })
  })
}