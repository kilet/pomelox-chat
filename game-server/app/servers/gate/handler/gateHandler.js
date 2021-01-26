'use strict';
const dispatcher = require('../../../util/dispatcher');
const BaseHandler = require('../../../basic/BaseHandler');

class GateHandler extends BaseHandler{
	constructor(app){
		super(app);
	}

	/**
	 * Gate handler that dispatch user to connectors.
	 *
	 * @param {Object} msg message from client
	 * @param {Object} session
	 * @param {Function} next next stemp callback
	 *
	 */
	queryEntry (msg, session, next) {
        console.log('msg',msg)
        let uid = msg.uid;
		if(!uid) {
			next(null, {
				code: 500
			});
			return;
		}
		// get all connectors
		let connectors = this.app.getServersByType('connector');
		if(!connectors || connectors.length === 0) {
			next(null, {
				code: 500
			});
			return;
		}
		// select connector
		let res = dispatcher.dispatch(uid, connectors);
		next(null, {
			code: 200,
			host: res.host,
			port: res.clientPort
		});
	};

	async login(msg, session){
        // msg.ipaddr = session.remoteIp(); // 登陆时连接的Ip
        await this.loginService.login(session,msg);
    }

    async verifyCode(msg, session){
	    console.log('msg',msg);
        let result = await this.rpc('comm.commRemote.genVerifyCode',session,msg.phone)
        console.log('result',result)
        return result;
    }

    async authVerify(msg, session){
        return await this.commService.authVerify(msg.phone,msg.code);
    }
}


module.exports = function(app) {
	return new GateHandler(app);
};


