// mysql CRUD
var sqlclient = module.exports;

var _pool;

var NND = {};

/*
 * Init sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function (config) {
    _pool = require('./mysql-pool').createMysqlPool(config);
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} cb Callback function.
 *
 */
NND.query = function (sql, args, cb) {
    var promise = _pool.acquire();
    promise.then(function (client) {
        client.query(sql, args, function (error, results, fields) {
            if (error) {
                _pool.destroy(client);
                cb(error, results);
            }
            else {
                _pool.release(client);
                cb(error, results);
            }
        });
    }, function () {
        console.log("reject");
    }).catch(function (err) {
        cb(err);
        console.log(err);
    });
};

/**
 * Close connection pool.
 */
NND.shutdown = function () {
    _pool.drain().then(function () {
        _pool.clear();
    });
};

/**
 * init database
 */
sqlclient.init = function (config) {
    if (!!_pool) {
        return sqlclient;
    } else {
        NND.init(config);
        // sqlclient.insert = NND.query;
        // sqlclient.update = NND.query;
        // sqlclient.delete = NND.query;
        // sqlclient.query = NND.query;
        sqlclient.query = function (sql, args, cb) {
            if(cb){
                NND.query(sql, args, cb);//兼容不使用 Promise
            }else{
                return new Promise((resolve,reject)=>{
                    NND.query(sql, args, function (err,result) {
                        if(err){
                            reject(err);
                        }else{
                            resolve(result);
                        }
                    });
                })
            };
        }
        return sqlclient;
    }
};

/**
 * shutdown database
 */
sqlclient.shutdown = function (app) {
    NND.shutdown(app);
};
