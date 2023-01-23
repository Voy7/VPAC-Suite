import getUserInfo from '/functions/getUserInfo'

export default async function handler(req, res) {
  const user = await getUserInfo(req.query.id)
  res.status(200).json(user)
}