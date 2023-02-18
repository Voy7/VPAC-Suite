import getLoginInfo from '/functions/getLoginInfo'
import getBriefings from '/functions/getBriefings'
import db from '../../../database'

// Delete specified mission.
export default async function handler(req, res) {
  const login = await getLoginInfo(req)
  if (!login?.isAdmin) return res.status(403).json({ success: false, err: 'No permission' })

  db.run(`DELETE FROM briefings WHERE id=?1`, { 1: req.body.id })
  
  const newBriefings = await getBriefings('*')
  res.status(200).json({ success: true, newBriefings })
}