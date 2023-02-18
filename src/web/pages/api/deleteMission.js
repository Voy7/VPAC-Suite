import getLoginInfo from '/functions/getLoginInfo'
import getMissions from '/functions/getMissions'
import db from '../../../database'

// Delete specified mission.
export default async function handler(req, res) {
  const login = await getLoginInfo(req)
  if (!login?.isAdmin) return res.status(403).json({ success: false, err: 'No permission' })

  db.run(`DELETE FROM missions WHERE mission=?1`, { 1: req.body.id })
  
  const newMissions = await getMissions('*')
  res.status(200).json({ success: true, newMissions })
}