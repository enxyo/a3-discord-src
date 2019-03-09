const config = require('./cfg/config');

var whitelist = {};
whitelist.path = {};

// files with whitelisted discord ids (1 per line)
whitelist.path.start = config.whitelist.path.start;
whitelist.path.stop = config.whitelist.path.stop;
whitelist.path.restart = config.whitelist.path.restart;

whitelist.createWhitelist = function (whitelistPath) {
    var lineReader = require('readline').createInterface({
        input: require('fs').createReadStream(whitelistPath)
    });

    var array = [];

    lineReader.on('line', function(line) {
        var data = line;
        var newArray = array.push(data);
    });

    return array;
}

whitelist.addToWhitelist = function(whitelistSelected, whitelistPath, discordUid) {

    if (whitelistSelected.includes(discordUid.substring(3,discordUid.length-1)) === true) {
        var msg = '```User is already whitelisted.```';
        return msg;
    }

    require('fs').appendFileSync(whitelistPath, discordUid.substring(3,discordUid.length-1), (err) => {
        if (err) throw err;
    });

    var msg = '```User added to whitelist.```';
    return msg;
};

whitelist.removeFromWhitelist = function(whitelistSelected, whitelistPath, discordUid) {

    if (whitelistSelected.includes(discordUid.substring(3,discordUid.length-1)) !== true) {
        var msg = '```User is not part of whitelist.```';
        return msg;
    }

    var dataArray = whitelistSelected;
    const searchId = discordUid.substring(3,discordUid.length-1);
    var lastIndex = -1;

    for (var index=0; index<dataArray.length; index++) {
        if (dataArray[index].includes(searchId)) {
            lastIndex = index;
            break;
        }
    }

    dataArray.splice(lastIndex, 1);

    const updatedData = dataArray.join('\n');
    require('fs').writeFile(whitelistPath, updatedData, (err) => {
        if (err) throw err;
    });

    var msg = '```User removed from whitelist.```';
    return msg;
};

whitelist.selectWhitelist = function(arg) {
    var whitelistSelected = [];
    switch (arg) {
        case 'start':
            whitelistSelected = whitelist.start;
            break;
        case 'stop':
            whitelistSelected = whitelist.stop;
            break;
        case 'restart':
            whitelistSelected = whitelist.restart;
            break;
    }
    return whitelistSelected;
};

whitelist.whitelistPath = function(arg) {
    var whitelistPath;
    switch (arg) {
        case 'start':
            whitelistPath = whitelist.path.start;
            break;
        case 'stop':
            whitelistPath = whitelist.path.stop;
            break;
        case 'restart':
            whitelistPath = whitelist.path.restart;
            break;
    }
    return whitelistPath;
};

whitelist.refreshWhitelist = function(arg) {
    switch (arg) {
        case 'start':
            whitelist.start = whitelist.createWhitelist(whitelist.path.start);
            break;
        case 'stop':
            whitelist.stop = whitelist.createWhitelist(whitelist.path.stop);
            break;
        case 'restart':
            whitelist.restart = whitelist.createWhitelist(whitelist.path.restart);
            break;
    }
    return;
};

// hardcoded admin whitelist
whitelist.admin = [
    config.whitelist.admin,   //enxyo
];

whitelist.start = whitelist.createWhitelist(whitelist.path.start);
whitelist.stop = whitelist.createWhitelist(whitelist.path.stop);
whitelist.restart = whitelist.createWhitelist(whitelist.path.restart);

module.exports = whitelist;
