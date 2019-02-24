/*******************************************
/!\ /!\ /!\ RENAME TO 'whitelist.js' /!\ /!\ /!\
/!\ /!\ /!\ create below whitelist files on your system /!\ /!\ /!\
*******************************************/
// files with whitelisted discord ids (1 per line)
const wl_start = './cfg/wl_data_start';
const wl_stop = './cfg/wl_data_stop';
const wl_restart = './cfg/wl_data_restart';

function createWhitelist(whitelist){
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(whitelist)
    });

    var array = [];
    lineReader.on('line', function (line) {
        var data = line;
        var newArray = array.push(data);
    });

    return array;
}

var whitelist = {};
// hardcoded admin whitelist
whitelist.admin = [
    '',   // /!\ /!\ /!\ set admin discord user id
]

whitelist.start = createWhitelist(wl_start);
whitelist.stop = createWhitelist(wl_stop);
whitelist.restart = createWhitelist(wl_restart);

module.exports = whitelist;
