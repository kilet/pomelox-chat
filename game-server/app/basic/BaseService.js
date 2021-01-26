'use strict';

const BasicFunc = require('./BasicFunc').class
const logger = require('@sex-pomelo/sex-pomelo-logger').getLogger('node-log', __filename);
const Db = require('./Db');

class BaseService extends BasicFunc{
	constructor(app){
		super(app);
        this.app = app;
	}
    //数据库表
    table(name,dbName){
        // 数据库需要初始化，不作数据操作的服务器，不建议初始化
        let db = this.app.get(dbName || 'dbclient');
        if(!db){
            // 检测是否对应的服务器类型已初始化过 mysql
            logger.error('mysql plugin is not initial,check config.js:',dbName || 'dbclient');
        }else{
            return Db.table(name,db);
        }
    }
    // 获取请求的ip地址
    getClinetIp(){
	    return '';
    }
}

module.exports = BaseService;


