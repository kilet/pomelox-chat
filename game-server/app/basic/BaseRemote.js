'use strict';
const GameRemote = require('@sex-pomelo/sex-pomelo/base').GameRemote;
const BasicFunc = require('./BasicFunc')

class BaseRemote extends GameRemote{
	constructor(app){
		super(app);

        // 必须放在最后面
        BasicFunc.extend(this , app);//通用函数继承

        // rpc 未知原因，rpc回调接口，只能在这里定义。构造函数外定义会出错
        this.calledFromRpc = (method,param,cb)=>{
            // 判断是普通函数，还是async 函数
            if(Object.prototype.toString.call(this[method]) === '[object Function]'){
                let result = this[method](...param);
                cb(result);
            }else{
                let result = this[method](...param).then(function (result) {
                    cb(result);
                });
            }
        }
	}

    // calledFromRpc(method,param,cb){
	//     let result = this[method](...param);
	//     cb(result);
    // }
}

module.exports = BaseRemote;


