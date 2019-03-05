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

    // server - syntax      .server start [type]
    //                              stop
    //                              restart
    //                              status <details>
    if (command === 'server') {
        if (args[0] === undefined) {
            message.reply('**Git gud!**\n```\n.server [start] <type>\n        [stop]\n        [restart]\n        [status]\n```');
        }

        if (args[0] === 'start' && args[1] === 'liberation') {
            // check whitelist
            if(whitelist.start.includes(message.author.id) !== true) {
    		          message.reply('Access denied!');
    		return;
    	    }

            // check if server is running

            // exec startup script
            const exec = require('child_process').exec;
            var script = exec('sh bottest.sh start', (error, stdout, stderr) => {
                if (error) {
                    console.log(`exec error: ${error}`);
                    return;
                }
                console.log(`exec stout: ${stdout}`);
                console.log(`exec sterr: ${stderr}`);
            });

        }

        if (args[0] === 'status') {
            if (args[1] === 'details') {
                //var s = stdout.slice(stdout.indexOf('arma3server'),stdout.length);
                //var s1 = s.split(" ");

            } else {
                const exec = require('child_process').exec;
                var script = exec('ps -fC arma3server', (error, stdout, stderr) => {
                    if (error) {
                        message.reply('Server not running.');
                        return;
                    }

                    if (stdout.indexOf('arma3server') != -1) {
                        message.reply('Server running.');
                    }

                    //console.log(`exec stout: ${stdout}`);
                    //console.log(`exec sterr: ${stderr}`);
                });
            }
        }
    }
});

client.login(token);
