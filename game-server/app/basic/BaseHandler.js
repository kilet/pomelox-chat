'use strict';
const GameHandler = require('@sex-pomelo/sex-pomelo/base').GameHandler;
const BasicFunc = require('./BasicFunc')

class BaseHandler extends GameHandler{
	constructor(app){
		super(app);

		//获取所有子类定义的函数
        let names = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
        for(let i = 0;i < names.length;i++){
            let method = names[i];
            if(method === 'constructor'){
                continue
            }
            //判断是否为Async函数，若为Async函数，则以await 方式执行
            // 完美兼容 await 方式与回调方式
            if(Object.prototype.toString.call(this[method]) === '[object AsyncFunction]'){
                let asyncFunc = this[method].bind(this);
                this[method] = (msg,session,next)=>{
                    asyncFunc(msg,session).then((result) =>{
                        if(typeof result == 'string'){
                            next(null,{code:result == 'ok'?0:1,msg:result,data:null});//返回错误提示,0没有错误，1默认错误码
                        }
                        else {
                            next(null,{code:0,msg:'ok',data:result});//自定义数据返回
                        }
                    })
                }
            }
        }

        // 必须放在最后面
        BasicFunc.extend(this , app);//通用函数继承
	}

    // 类方法编写示例
    //传统回调方式：有next参数
    example (msg, session, next) {
        next(null,'result data')
    }

    // async 函数不需要next 参数，直接return 返回结果就可以
    async exampeAsync(msg, session,){
        // throw 'err' ，若要中断操作可以使用抛出错误
        return 'result data'
    }

	// // 统一默认错误处理
	// handlerError(method,e,next){
    //     next(e,null);
    // }
}

module.exports = BaseHandler;


