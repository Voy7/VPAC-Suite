import cookie from 'cookie'

export default function handler(req, res) {
  res.setHeader(
    'Set-Cookie',
    cookie.serialize('vpac-password', '', {
        httpOnly: true,
        secure: true,
        maxAge: new Date(0),
        sameSite: 'strict',
        path: '/'
    })
  )
  res.status(200).redirect('/login')
}