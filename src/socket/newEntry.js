import addMissionEvent from '../web/functions/addMissionEvent.js'
import setUser from '../web/functions/setUser.js'

// Parse and do whatever with DCS socket entries.
export default function newEntry(entry, clients, clientAddress) {
  const args = {}
  entry.split(', ').forEach(arg => {
    const key = arg.split('=')[0]
    const value = arg.split('=')[1]
    args[key] = value
  })

  console.log(args)
  // Player status update.
  if (args['event'] == 'STATUS' && args['id'] && args['key']) {
    const ucid = args['ucid']
    const key = args['key']
    delete args['event']
    delete args['key']
    clients.set(clientAddress, ucid)
    setUser(null, ucid, key, args)
  }

  // Server stats events.
  else if (args['password'] == process.env.SOCKET_PASSWORD && args['event'] && args['mission']) {
    const mission = args['mission'].replace(/ /g, '_')
    const event = args['event']
    delete args['mission']
    delete args['event']
    delete args['password']
    addMissionEvent(mission, event, args)
  }
}