'use strict';
// 用户自定义对象数据
var logger = require('@sex-pomelo/sex-pomelo-logger').getLogger('node-log', __filename);
const Db = require('./Db');
const pomelo = require('@sex-pomelo/sex-pomelo');

//数据模型
class BaseModel{
	constructor(){

	}
    //数据库表
    table(name,dbName){
        // 数据库需要初始化
        let db = pomelo.app.get(dbName || 'dbclient');
        if(!db){
            logger.info('no mysql database name:',dbName || 'dbclient');
        }else{
            return Db.table(name,db);
        }
    }
}

module.exports = BaseModel;


