'use strict';

class plEevent {
    // opts 配置文件透传参数
    constructor(app, opts) {
        //do construction
    }

    add_servers(servers) {
        //do something when application add servers
    };

    remove_servers(ids) {
        //do something when application remove servers
    };

    replace_servers(servers) {
        //do something when server reconnected
    };

    bind_session(session) {
        //do something when session binded
    };

    close_session(session) {
        //do something when session closed
    };
}


module.exports = function (app, opts) {
    return new plEevent(app, opts);
};

