import getUser from './getUser.js'
import getGuild from './getGuild.js'
import cookie from 'cookie'

const admins = JSON.parse(process.env.WEB_ADMINS)

export default async function getLoginInfo(req) {
  const password = cookie.parse(req.headers.cookie)['vpac-password']
  const users = await getUser('*')
  const user = users.find(f => f.key == password)
  if (!user) return { user: null }

  const guild = await getGuild()
  const member = guild.members.find(f => f.id == user.id)
  
  if (member) {
    return {
      key: password,
      id: member.id,
      name: member.name,
      nickname: member.nickname,
      avatar: member.avatar,
      isAdmin: admins.includes(password)
    }
  }

  return { login: null }
}