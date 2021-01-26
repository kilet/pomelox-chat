
var _poolModule = require('generic-pool');
var mysql = require('mysql');
/*
 * Create mysql connection pool.
 */
var createMysqlPool = function (config) {
    const factory = {
        create: function () {
            return new Promise(function (resolve, reject) {

                var client = mysql.createConnection({
                    host: config.host,
                    user: config.user,
                    password: config.password,
                    database: config.database,
                    port: config.port
                });
                client.on('error', function () {
                    client.connect();
                });
                client.connect(function (error) {
                    if (error) {
                        console.log('sql connect error');
                    }
                    resolve(client)
                });

            })
        },
        destroy: function (client) {
            return new Promise(function (resolve) {
                client.on('end', function () {
                    resolve()
                })
                client.end()
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
};
exports.createMysqlPool = createMysqlPool;
