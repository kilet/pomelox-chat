let redisclient = module.exports;

let _pool;

let NND = {};

NND.init = function(config) {
    _pool = require('./redis-pool').createRedisPool(config);
};

NND.execcmd = function(cmdname, args, cb) {
    var promise = _pool.acquire();
    promise.then(function(err, client) {
        if(!!err) {
            console.error('[redisqueryErr] ' + err.stack);
            return;
        }
        var rfunc = client[cmdname];
        rfunc.call(client, args, function (err, res) {
            _pool.release(client);
            cb(err, res);
        });
    }).catch(function (err) {
        cb(err);
        console.log(err);
    });
};

NND.execcmdAsync = async function(cmdname,args){
    return new Promise((resolve,reject)=>{
        let promise = _pool.acquire();
        promise.then(function(err, client) {
            if(!!err) {
                console.error('[redisqueryErr] ' + err.stack);
                return;
            }
            let rfunc = client[cmdname];
            rfunc.call(client, args, function (err, res) {
                _pool.release(client);
                if(err){
                    reject(err);
                }else{
                    resolve(res);
                }
            });
        }).catch(function (err) {
            reject(err);
            console.log(err);
        });
    })
}


NND.execcmds = function(cmdparams, cb) {
    let docmd = async function(cmdparams){
        let res = [];
        let len = cmdparams.length;
        for (let i = 0; i < len; i++) {
            let result = await NND.execcmdAsync(cmdparams[i].cmdname,cmdparams[i].args);
            res.push(result);
        }
        return res;
    };
    docmd(cmdparams).then((res)=>{
        cb(null,res);
    },(err)=>{
        cb(err,null)
    })
};

// NND.execcmds = function(cmdparams, cb) {
//     if (cmdparams.length == 1) {
//         this.execcmd(cmdparams[0].cmdname, cmdparams[0].args, cb);
//         return;
//     }
//     var cmdfuncs = [];
//     var len = cmdparams.length;
//     for (var i = 0; i < len; i++) {
//         var con = { cmdname: cmdparams[i].cmdname, args: cmdparams[i].args };
//         var func = function (callback) {
//             var param = this;
//             _pool.acquire(function (err, client) {
//                 if (!!err) {
//                     console.error('redis execcmds error: ' + err.stack);
//                     return;
//                 }
//                 var rfunc = client[param.cmdname];
//                 rfunc.call(client, param.args, function (err, res) {
//                     _pool.release(client);
//                     callback(err, res);
//                 });
//             });
//         };
//         cmdfuncs.push(func.bind(con));
//     }
//     asyn.parallel(cmdfuncs,
//         function (err, results) {
//             cb(err, results);
//         });
// };

NND.shutdown = function() {
    _pool.drain().then(function () {
        _pool.clear();
    });
};

redisclient.init = function(config) {
    if(!!_pool) {
        return redisclient;
    } else {
        NND.init(config);
        redisclient.execcmd = NND.execcmd;
        redisclient.execcmds = NND.execcmds;
        redisclient.execcmd = function (cmd, args, cb) {
            if(cb){
                NND.execcmd(cmd, args, cb);//兼容不使用 Promise
            }else{
                return new Promise((resolve,reject)=>{
                    NND.execcmd(cmd, args, function (err,result) {
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    });
                })
            };
        }

        redisclient.execcmds = function (cmdargs, cb) {
            if(cb){
                NND.execcmds(cmdargs, cb);//兼容不使用 Promise
            }else{
                return new Promise((resolve,reject)=>{
                    NND.execcmds(cmdargs, function (err,result) {
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    });
                })
            };
        }
        return redisclient;
    }
};

redisclient.shutdown = function() {
    NND.shutdown();
};
