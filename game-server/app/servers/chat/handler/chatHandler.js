
const BaseHandler = require('../../../basic/BaseHandler');

class ChatHandler extends BaseHandler{
	constructor(app){
		super(app);
        console.log('ChatHandler')
	}

	/**
	 * Send messages to users
	 *
	 * @param {Object} msg message from client
	 * @param {Object} session
	 * @param  {Function} next next stemp callback
	 *
	 */
	async send(msg, session, next) {
		var rid = session.get('rid');
		var username = session.uid.split('*')[0];

		var param = {
			msg: msg.content ,
			from: username,
			target: msg.target
		};

		let channel = this.cs.getChannel(rid, false);

		if(msg.target == '*') {
			channel.pushMessage('onChat', param);
		}
		//the target is specific user
		else {
			var tuid = msg.target + '*' + rid;
			var tsid = channel.getMember(tuid)['sid'];
			console.log('tuid,tsid',tuid,tsid);
            this.cs.pushMessageByUids('onChat', param, [{
				uid: tuid,
				sid: tsid
			}]);
		}
		// next(null, {
		// 	route: msg.route
		// });
        return {route:msg.route}
	}
}

module.exports = function(app) {
	return new ChatHandler(app);
};


