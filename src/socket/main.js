import newEntry from './newEntry.js'
import setUser from '../web/functions/setUser.js'
import net from 'net'

const clients = new Map()

// Main TCP socket function.
export default function initializeTCPSocket() {
  const socket = net.createServer()

  // Set TCP socket to listen on configured port.
  socket.listen(process.env.SOCKET_PORT, 'localhost', () => { 
    console.log(`[Socket] TCP socket listening on: localhost:${process.env.SOCKET_PORT}`.green)
  })

  // On new connect, add IP to clients list for later use.
  socket.on('connection', connection => { 
    const clientAddress = `${connection.remoteAddress}:${connection.remotePort}`
    clients.set(clientAddress, null)
    if (process.env.LOG_SOCKET_CONNECT) console.log(`[Socket] ${clientAddress}: Socket connected.`.green)
   
    // When new data is sent, parse it in newEntry.js.
    connection.on('data', data => {
      if (process.env.LOG_SOCKET_STATUS && data.toString().includes('event=STATUS')) console.log(`[Socket] ${clientAddress}: `.cyan + `${data}`.gray)
      else if (process.env.LOG_SOCKET_ENTRY) console.log(`[Socket] ${clientAddress}: `.cyan + `${data}`.gray)
      data.toString().split(';;').forEach(entry => {
        newEntry(entry, clients, clientAddress)
      })
    })

    // When connection closes, see if a ucid was set for
    // the client IP and then set their status to nothing.
    connection.on('close', (data) => { 
      if (process.env.LOG_SOCKET_CONNECT) console.log(`[Socket] ${clientAddress}: Socket closed.`.yellow)
      setUser(null, clients.get(clientAddress), null, {})
    })

    // Log any socket errors.
    connection.on('error', (err) => { 
      console.log(`[Socket] ${clientAddress}: Error occurred: ${err.message}`.red)
      setUser(null, clients.get(clientAddress), null, {})
    })
  })
}