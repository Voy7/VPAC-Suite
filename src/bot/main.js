import { Client, GatewayIntentBits } from 'discord.js'

export default function initializeBot() {
  // Initialize the Discord bot.
  const bot = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildVoiceStates
  ]})

  // Grab and set the specified server/guild.
  bot.on("ready", async () => {
    bot.user.setActivity(`vpac-dcs.com`, { type: 1 })
    const guild = await bot.guilds.fetch(process.env.BOT_SERVER)

    if (guild) {
      import('./discordCache.js').then(module => module.default(guild))
      // import('./banner.js').then(module => module.default(guild))
      console.log(`${bot.user.username} is now active.`.green)
    }
    else console.log(`Could not find specified Discord server!`.red)
  })

  bot.on("messageCreate", message => {
    if (message.author == bot.user) return
    if (!message.content.startsWith(process.env.BOT_PREFIX)) return

    let cmd = message.content.toLowerCase().replace(process.env.BOT_PREFIX, "")
    let args = cmd.split(" ")
        
    if (args[0] == "stats") require("./commands/stats") (message)
  })

  bot.login(process.env.BOT_TOKEN)
}