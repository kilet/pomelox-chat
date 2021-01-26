const _poolModule = require('generic-pool');

const createRedisPool = function (redisConfig) {
    const factory = {
        create: function () {
            return new Promise(function (resolve, reject) {
                let redis = require('redis');
                const client = redis.createClient(redisConfig.port, redisConfig.host, {});

                const pwd = redisConfig.password;
                if (!!pwd && pwd != "")
                    client.auth(pwd);

                const dbn = redisConfig.database;
                if (!!dbn && dbn != 0)
                    client.select(dbn);

                client.on('connect', function () {
                    resolve(client);
                });
                client.on("error", function(err) {
                    reject("Redis error: "+err);
                });
            })
        },
        destroy: function (client) {
            return new Promise(function (resolve) {
                resolve()
                client.quit();
            })
        }
    }

    var opts = {
        max: 10, // maximum size of the pool
        min: 2, // minimum size of the pool
        idleTimeoutMillis: 30000,
        // 如果 设置为 true 的话，就是使用 console.log 打印入职，当然你可以传递一个 function 最为作为日志记录handler
        log: true

    }

    return _poolModule.createPool(factory, opts);



    // return _poolModule.Pool({
    //     name: 'redis',
    //     create: function(callback) {
    //         const redis = require('redis');
    //         const client = redis.createClient(redisConfig.port, redisConfig.host, {});
    //
    //         asyn.waterfall([
    //             function(cb) {
    //                 var pwd = redisConfig.password;
    //                 if (!!pwd && pwd != "")
    //                     client.auth(pwd, cb);
    //                 else
    //                     cb(null);
    //             },
    //             function(res, cb) {
    //                 var dbn = redisConfig.database;
    //                 if (!!dbn && dbn != 0)
    //                     client.select(dbn, cb);
    //                 else
    //                     cb(null);
    //             }
    //         ],
    //         function(err) {
    //             client.on("error", function(err) {
    //                 console.log("Redis error: "+err);
    //             });
    //             callback(null, client);
    //         });
    //     },
    //     destroy: function(client) {
    //         client.quit();
    //     },
    //     max: 10,
    //     idleTimeoutMillis: 3000,
    //     log: false
    // });
};

exports.createRedisPool = createRedisPool;
