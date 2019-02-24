const config = require('./cfg/config');
const whitelist = require('./cfg/whitelist');

/*******************************************
** DISCORD setup
*******************************************/

const discord = require("discord.js");
const client = new discord.Client();
const token = config.discord.token;

// Set the prefix
const prefix = ".";


const wl = whitelist.start;

/*******************************************
** DISCORD
*******************************************/

client.on("ready", () => {
    console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);
    client.user.setPresence({ game: { name: 'mortar incoming', type: 0 } });
});

client.on("message", (message) => {
	if(message.author.bot) return;
	if(message.content.indexOf(prefix) !== 0) return;

	const args = message.content.slice(prefix.length).trim().toLowerCase().split(/ +/g);
	const command = args.shift().toLowerCase();

	if (command  === 'help') {
		message.channel.send('**Dir ist nicht zu helfen**');
	}

    if (command === 'test') {
        if(whitelist.start.includes(message.author.id) !== true) {
		message.reply('Access denied!');
		return;
	    }

        message.reply('Access granted!');
    }
});

client.login(token);
