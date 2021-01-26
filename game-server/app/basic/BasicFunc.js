'use strict';
const logger = require('@sex-pomelo/sex-pomelo-logger').getLogger('node-log', __filename);
const pomelo = require('@sex-pomelo/sex-pomelo')
const fs = require('fs');
process.env.LOGGER_LINE = true;

class BasicFunc{
    //获取 创建channel
    getChannel(name,bCreate){
        return this.cs.getChannel(name,bCreate)
    }
    // rpc 调用
    rpc(route,session,...param){
        return new Promise(resolve => {
            let m = route.split('.');
            let serverName = m[0],
                remote = m[1],
                method = m[2];
            this.app.rpc[serverName][remote].calledFromRpc(session,method,param,function (result) {
                resolve(result);
            });
        });
    }
    //是否开发环境
    isDevelop(){
        if(process.env.NODE_ENV  === 'prod' || process.env.NODE_ENV === 'production'){
            return false;
        }

        return true;
    }

    // 打印普通日志，日志带堆栈
    log(){
        let e = new Error();
        let trace = e.stack.split('\n');
        logger.info(...arguments,trace[2]);
    }
    logError(){
        logger.error(...arguments);
    }
    logWarn(){
        logger.warn(...arguments);
    }
    trace(){
        let e = new Error();
        console.log(e);//打印堆栈信息
    }
    // 创建模型实例
    createModel(name){
        if(this.models && this.models[name]){
            return new this.models[name];
        }
    }
}

module.exports = {
    class:BasicFunc,
    extend:function(oThis,app){
        // 拷贝所有自定义通用函数
        let ComFunc = new BasicFunc();
        let names = Object.getOwnPropertyNames(Object.getPrototypeOf(ComFunc))
        for(let i = 0;i < names.length;i++){
            if(names[i] != 'constructor'){
                oThis[names[i]] = ComFunc[names[i]].bind(oThis);
            }
        }

        // 赋值内置服务
        oThis.cs = app.get('channelService');
        oThis.ss = app.get('sessionService');
        oThis.bss = app.get('backendSessionService');
        oThis.lss = app.get('localSessionService');

        // load service，加载自定义服务
        let path = app.getBase() +'/app/servers/'+ app.getServerType()+'/service/'
        if(fs.existsSync(path)){
            fs.readdirSync(path).forEach(file => {
                try {
                    console.log('load service',path + file)
                    let service = require(path + file)(app);
                    let name = file.replace('.js','');
                    app.set(name,service,true);
                    oThis[name] = service;
                }catch (e) {
                    logger.error('load service error:',e)
                }
            })
        }
        // load model，加载数据模型
        path = app.getBase() +'/app/servers/'+ app.getServerType()+'/model/'
        if(fs.existsSync(path)){
            oThis.models = {};
            fs.readdirSync(path).forEach(file => {
                try {
                    let model = require(path + file);
                    let name = file.replace('.js','');
                    oThis.models[name] = model;
                }catch (e) {
                    logger.error('load model error:',e)
                }
            })
        }
    }
};
// // 各个基类的通用函数；
// module.exports = {
//     extend:function (oThis,app) {
//         let ComFunc = {
//             //获取channel
//             getChannel:function(name,bCreate){
//                 return this.cs.getChannel(name,bCreate)
//             },
//             //是否开发环境
//             isDevelop:function(){
//                 if(process.env.NODE_ENV  === 'prod' || process.env.NODE_ENV === 'production'){
//                     return false;
//                 }
//
//                 return true;
//             },
//
//             // 打印普通日志，日志带堆栈
//             log:function(){
//                 let e = new Error();
//                 let trace = e.stack.split('\n');
//                 logger.info(...arguments,trace[2]);
//             },
//             logError:function(){
//                 logger.error(...arguments);
//             },
//             logWarn:function(){
//                 logger.warn(...arguments);
//             },
//             trace:function(){
//                 let e = new Error();
//                 console.log(e);//打印堆栈信息
//             }
//         }
//
//         // 通用变量初始化
//         oThis.cs = app.get('channelService');
//         console.log('oThis',pomelo.app.getBase())
//         // 通用函数初始化
//         let names = Object.keys(ComFunc);
//         for(let i = 0;i < names.length;i++){
//             oThis[names[i]] = ComFunc[names[i]].bind(oThis);
//         }
//     }
// };


