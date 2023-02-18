import getLoginInfo from '/functions/getLoginInfo'
import getSquadrons from '/functions/getSquadrons'
import uploadImage from '/functions/uploadImage'
import db from '../../../database'

// Update squadron info.
export default async function handler(req, res) {
  const login = await getLoginInfo(req)
  if (!login?.isAdmin) return res.status(403).json({ success: false, err: 'No permission' })

  let url = req.body.banner
  if (url.startsWith('data:')) { // Base64, upload image.
    let { url, err } = await uploadImage(req.body.banner)
    if (err) return res.status(400).json({ success: false, err })
  }

  db.run(`UPDATE squadrons SET data=?1 WHERE id=?2`, {
    1: JSON.stringify({
      banner: url,
      darkness: req.body.darkness,
      color: req.body.color,
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