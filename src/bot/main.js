const database = require("../database")

function main(g) {
    // Initialize the Discord bot.
    const { Client, Intents } = require("discord.js")
    g.bot = new Client({ intents: [
        "GUILDS",
        "GUILD_MESSAGES",
        "GUILD_MEMBERS",
        "GUILD_PRESENCES",
        "GUILD_VOICE_STATES"
    ]})

    // Grab and set the specified server/guild.
    

    g.bot.on("ready", async () => {
        g.bot.user.setActivity(`vpac-dcs.com`, { type: 1 })
        g.bot.guilds.cache.forEach(guild => {
            if (guild.id == g.config.bot.server) g.guild = guild
        })

        if (g.guild) {
            require("./discordCache") (g)
            require("./banner") (g)
            console.log(`${g.bot.user.username} is now active.`.green)
        }
        else console.log(`Could not find specified Discord server!`.red)
    })

    g.bot.on("messageCreate", message => {
        if (message.author == g.bot.user) return
        if (!message.content.startsWith(g.config.bot.prefix)) return

        let cmd = message.content.toLowerCase().replace(g.config.bot.prefix, "")
        let args = cmd.split(" ")
        
        if (args[0] == "stats") require("./commands/stats") (g, message)
    })

    g.bot.login(g.config.bot.token)
}

// Export module.
module.exports = main