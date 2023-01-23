import getUser from '/functions/getUser.js'
import getGuild from '/functions/getGuild.js'
import getSquadrons from '/functions/getSquadrons.js'

// Get full user info like squadrons, stats, etc. (No sensitive data)
export default async function getUserInfo(id) {
  const guild = await getGuild()
  const user = await getUser(id, id)
  if (user) {
    const member = guild.members.find(f => f.id == user.id)
    if (!member) return null
    const allSquadrons = await getSquadrons()
    return {
      ucid: user.ucid,
      id: member.id,
      name: member.name,
      nickname: member.nickname,
      avatar: member.avatar,
      squadrons: allSquadrons.filter(squadron => {
        if (squadron.members.find(f => f.id == member.id)) return squadron
      })
    }
  }
  return null
}