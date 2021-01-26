"use strict";

const Cron = require('@sex-pomelo/sex-pomelo/base').Cron;
const BasicFunc = require('./BasicFunc')

class BaseCron extends Cron{
	constructor(app){
		super(app);

        // 必须放在最后面
        BasicFunc.extend(this , app);//通用函数继承
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
}

module.exports = BaseCron;


