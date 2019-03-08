const q = require('q');

function t1() {
    var deferred = q.defer();
    var msg = 't1';
    console.log(msg);
    deferred.resolve(msg);
    return deferred.promise;
}

function t2() {
    var deferred = q.defer();
    var msg = t1();
    console.log(msg);
    deferred.resolve(msg);
    return deferred.promise;
}

function t3() {
    var deferred = q.defer();
    var msg = 't3';
    console.log(msg);
    deferred.resolve(msg);
    return deferred.promise;
}

return t1()
.then(function (one) {
    return t2(one);
})
.then(function (two) {
    return t3 (two)
})
.then(function (three) {
    console.log('done');
});
