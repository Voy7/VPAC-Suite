import getLoginInfo from '/functions/getLoginInfo'
import getSquadrons from '/functions/getSquadrons'
import db from '../../../database'

// Update squadron info.
export default async function handler(req, res) {
  const login = await getLoginInfo(req)
  if (!login?.isAdmin) return res.status(403).send({ error: 'No permission' })

  db.run(`UPDATE squadrons SET data=?1 WHERE id=?2`, {
    1: JSON.stringify({
      description: req.body.description,
      callsigns: req.body.callsigns,
      airframes: req.body.airframes,
      checkride: req.body.checkride
    }),
    2: req.body.id
  })

  const newSquadrons = await getSquadrons('*')
  res.status(200).json({ success: true, newSquadrons })
}