const config = require('./cfg/config');

var whitelist = {};
whitelist.path = {};

// files with whitelisted discord ids (1 per line)
whitelist.path.start = config.whitelist.path.start;
whitelist.path.stop = config.whitelist.path.stop;
whitelist.path.restart = config.whitelist.path.restart;

whitelist.createWhitelist = function (whitelistPath) {

    var array = [];

    const lineByLine = require('n-readlines');
    const liner = new lineByLine(whitelistPath);

    let line;

    while (line = liner.next()) {
        var data = line;
        var newArray = array.push(data.toString('utf8'));
    }

    return array;
}

whitelist.addToWhitelist = function(whitelistSelected, whitelistPath, discordUid) {

    if (whitelistSelected.includes(discordUid.substring(3,discordUid.length-1)) == true) {
        var msg = '```User is already whitelisted.```';
        return msg;
    }

    var dataArray = whitelistSelected;
    dataArray.push(discordUid.substring(3,discordUid.length-1));

    const updatedData = dataArray.join('\n');
    require('fs').writeFile(whitelistPath, updatedData, (err) => {
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
            whitelistSelected = whitelist.createWhitelist(whitelist.path.start);
            break;
        case 'stop':
            whitelistSelected = whitelist.createWhitelist(whitelist.path.stop);
            break;
        case 'restart':
            whitelistSelected = whitelist.createWhitelist(whitelist.path.restart);
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

// hardcoded admin whitelist
whitelist.superadmin = [config.whitelist.superadmin];

module.exports = whitelist;
