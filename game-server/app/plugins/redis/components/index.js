'use strict';
class plComponent{
    // opts 配置文件透传参数
    constructor( app, opts ){
        //do construction
        let config = 'redis'
        app.loadConfig(config, app.getBase() + `/config/${config}.json`); // 添加配置

        app.set('redis', require('../lib/redis').init(app.get(config)));
    }

    // next() 回调不能缺省，否则服务器启动会无错误中断
    // start(next){
    //     // do something application start
    //     console.log('plugin start')
    //     next();
    // }
    //
    // afterStart(next){
    //     // do something after application started
    //     console.log('plugin afterStart')
    //     next()
    // }
    //
    // stop(next){
    //     // do something on application stop
    //     console.log('plugin stop')
    //     next()
    // }
}


module.exports = function(app, opts) {
    return new plComponent(app, opts);
};

