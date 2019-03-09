const config = require('./cfg/config');
const whitelist = require('./cfg/whitelist');

const Q = require('q');

/*******************************************
** DISCORD setup
*******************************************/

const discord = require("discord.js");
const client = new discord.Client();
const token = config.discord.token;

// Set the prefix
const prefix = ".";

/*******************************************
** FUNCTIONS
*******************************************/

function serverProcessCheck(details) {
    var deferred = Q.defer();

    if (details == 1) {
        const exec = require('child_process').exec;
        var script = exec('ps -fC arma3server', (error, stdout, stderr) => {
            if (error) {
                var msg = 'Server not running.';
                deferred.resolve(msg);
            }
            if (stdout.indexOf('arma3server') != -1) {
                var s = stdout.slice(stdout.indexOf('arma3server'),stdout.length);
                var s1 = s.split(" ");
                var msg = 'Server running.';

                //console.log(msg);
                deferred.resolve(msg);
            }
            //console.log(`exec stout: ${stdout}`);
            //console.log(`exec sterr: ${stderr}`);
        });
    }

    if (details == 0) {
        const exec = require('child_process').exec;
        var script = exec('ps -fC arma3server', (error, stdout, stderr) => {
            if (error) {
                var msg = 'Server not running.';
                deferred.resolve(msg);
            }
            if (stdout.indexOf('arma3server') != -1) {
                var msg = 'Server running.';
                deferred.resolve(msg);
            }
            //console.log(`exec stout: ${stdout}`);
            //console.log(`exec sterr: ${stderr}`);
        });
    }

    if (details == 3) {
        const exec = require('child_process').exec;
        var script = exec('ps -fC arma3server', (error, stdout, stderr) => {
            if (error) {
                deferred.resolve(0);
            }
            if (stdout.indexOf('arma3server') != -1) {
                deferred.resolve(1);
            }
            //console.log(`exec stout: ${stdout}`);
            //console.log(`exec sterr: ${stderr}`);
        });
    }

    return deferred.promise;
}


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
		message.channel.send('\n**Available commands**```.server start [type]  (1)\n        stop\n        restart\n        status <details>\n\n(1) available types: liberation```');
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
        if (args[0] === undefined || (args[0] === 'start' && args[1] === undefined)) {
            message.reply('**Git gud!**\n```\n.server [start] <type>\n        [stop]\n        [restart]\n        [status]\n```');
        }

        if (args[0] === 'start' && args[1] === 'liberation') {
            // check whitelist
            if(whitelist.start.includes(message.author.id) !== true) {
    		          message.reply('Access denied!');
    		return;
    	    }

            // check if server is running
            serverProcessCheck(3)
            .then(function (code) {
                console.log(code);
                if(code == 1){
                    message.reply('Server is already running!')
                }
                if(code == 0){
                    // exec startup script
                    const exec = require('child_process').exec;
                    var script = exec('sh liberation.sh start', { cwd: '/home/arma3server/' }, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`exec error: ${error}`);
                            return;
                        }
                        console.log(`exec stout: ${stdout}`);
                        console.log(`exec sterr: ${stderr}`);
                        message.reply('```' + stdout + '```')
                    });
                }
            });

        }

        if (args[0] === 'stop') {
            // check whitelist
            if(whitelist.stop.includes(message.author.id) !== true) {
    		          message.reply('Access denied!');
    		return;
    	    }

            // check if server is running
            serverProcessCheck(3)
            .then(function (code) {
                console.log(code);
                if(code == 0){
                    message.reply('Server is not running!')
                }
                if(code == 1){
                    // exec startup script
                    const exec = require('child_process').exec;
                    var script = exec('sh liberation.sh stop', { cwd: '/home/arma3server/' }, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`exec error: ${error}`);
                            return;
                        }
                        console.log(`exec stout: ${stdout}`);
                        console.log(`exec sterr: ${stderr}`);
                        message.reply('```' + stdout + '```')
                    });
                }
            });

        }

        if (args[0] === 'restart') {
            // check whitelist
            if(whitelist.restart.includes(message.author.id) !== true) {
    		          message.reply('Access denied!');
    		return;
    	    }

            // check if server is running
            serverProcessCheck(3)
            .then(function (code) {
                console.log(code);
                if(code == 0){
                    message.reply('Server is not running! Use start command.')
                }
                if(code == 1){
                    // exec startup script
                    const exec = require('child_process').exec;
                    var script = exec('sh liberation.sh restart', { cwd: '/home/arma3server/' }, (error, stdout, stderr) => {
                        if (error) {
                            console.log(`exec error: ${error}`);
                            return;
                        }
                        console.log(`exec stout: ${stdout}`);
                        console.log(`exec sterr: ${stderr}`);
                        message.reply('```' + stdout + '```')
                    });
                }
            });

        }

        if (args[0] === 'status') {
            if (args[1] === 'details') {
                // 1 = full details / 0 = no details
                serverProcessCheck(1)
                .then(function (msg) {
                    console.log(msg);
                    message.reply(msg);
                });
            } else {
                // 1 = full details / 0 = no details
                serverProcessCheck(0)
                .then(function (msg) {
                    console.log(msg);
                    message.reply(msg);
                });
            }
        }
    }

    // whitelist - syntax      .whitelist list <whitelist>
    //                                    add [whitelist] [@user]
    //                                    remove [whitelist] [@user]
    if (command === 'whitelist') {
        if (args[0] === undefined || (args[0] === 'add' && (args[1] === undefined || args[2] === undefined))) {
            message.reply('**Git gud!**\n```\n.whitelist [list] <whitelist>\n           [add] [@user]\n           [remove] [@user]```');
        }

        if (args[0] === 'list') {
            if (args[1] === 'start' || args[1] === 'stop' || args[1] === 'restart') {
                var whitelistPath = whitelist.whitelistPath(args[1]);
                message.reply(whitelistPath);
                return;
            }

        }

        if (args[0] === 'add' && args[1] === 'start' || args[1] === 'stop' || args[1] === 'restart' && args[2] !== undefined ) {
            if (args[1] === 'start' || args[1] === 'stop' || args[1] === 'restart') {

                var msg = whitelist.addToWhitelist(whitelist.selectWhitelist(args[1]),whitelist.whitelistPath(args[1]),args[2]);
                message.reply(msg);
            }
            message.reply('do stuff');


        }

        if (args[0] === 'remove' && args[1] === 'start' || args[1] === 'stop' || args[1] === 'restart' && args[2] !== undefined ) {
            if (args[1] === 'start' || args[1] === 'stop' || args[1] === 'restart') {

                var msg = whitelist.removeFromWhitelist(whitelist.selectWhitelist(args[1]),whitelist.whitelistPath(args[1]),args[2]);
                message.reply(msg);
            }
            message.reply('do stuff');


        }

    }
});

client.login(token);
