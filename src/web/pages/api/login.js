import cookie from 'cookie'

export default function handler(req, res) {
  const password = req.body.password ? req.body.password : ''
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('vpac-password', password, {
        httpOnly: true,
        secure: true,
        maxAge: 7889238, // 3 months
        sameSite: 'strict',
        path: '/'
    })
  )
  const admins = JSON.parse(process.env.WEB_ADMINS)
  console.log(admins)
  if (admins.includes(password)) res.status(200).json({ success: true })
  else res.status(200).json({ success: false })
}