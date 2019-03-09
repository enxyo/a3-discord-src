/*******************************************
/!\ /!\ /!\ RENAME TO 'config.js' /!\ /!\ /!\
*******************************************/

var config = {};
config.discord = {};
config.whitelist = {};
config.whitelist.path = {};

/*******************************************
** DISCORD setup
*******************************************/

config.discord.token = ''; // discord bot token

// whitelist files
config.whitelist.path.start = '';
config.whitelist.path.stop = '';
config.whitelist.path.restart = '';
config.whitelist.admin = '';


module.exports = config;
