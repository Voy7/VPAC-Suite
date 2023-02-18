import getLoginInfo from '/functions/getLoginInfo'
import getMissions from '/functions/getMissions'
import db from '../../../database'

// Update mission info.
export default async function handler(req, res) {
  const login = await getLoginInfo(req)
  if (!login?.isAdmin) return res.status(403).json({ success: false, err: 'No permission' })

  db.run(`UPDATE missions SET mission=?1 WHERE mission=?2`, {
    1: req.body.name.replace(/ /g, '_'),
    2: req.body.id
  })
  
  const newMissions = await getMissions('*')
  res.status(200).json({ success: true, newMissions })
}