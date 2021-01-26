
const BaseRemote = require('../../../basic/BaseRemote');

class ChatRemote extends BaseRemote{
	constructor( app ){
		super(app);
	}
	async testRpc(a,b,c){
	    console.log('testRpc',a,b,c)
        return 'ok'
    }

    // calledFromRpc(method,param,cb){
    //     console.log('console.log(\'testRpc\',a,b,c)',param  )
    //     cb()
    //     // let result = this[method](...param);
    //     // cb(result);
    // }
	/**
	 * Add user into chat channel.
	 *
	 * @param {String} uid unique id for user
	 * @param {String} sid server id
	 * @param {String} name channel name
	 * @param {boolean} flag channel parameter
	 *
	 */
	add(uid, sid, name, flag, cb) {
		var channel = this.cs.getChannel(name, flag);
		var username = uid.split('*')[0];
		var param = {
			route: 'onAdd',
			user: username
		};
		channel.pushMessage(param);

		if( !! channel) {
			channel.add(uid, sid);
		}

		// cb(this.get(name, flag));
        return this.get(name, flag);
	}

	/**
	 * Get user from chat channel.
	 *
	 * @param {Object} opts parameters for request
	 * @param {String} name channel name
	 * @param {boolean} flag channel parameter
	 * @return {Array} users uids in channel
	 *
	 */
	get(name, flag) {
		var users = [];
		var channel = this.cs.getChannel(name, flag);
		if( !! channel) {
			users = channel.getMembers();
		}
		for(var i = 0; i < users.length; i++) {
			users[i] = users[i].split('*')[0];
		}
		return users;
	};

	/**
	 * Kick user out chat channel.
	 *
	 * @param {String} uid unique id for user
	 * @param {String} sid server id
	 * @param {String} name channel name
	 *
	 */
	kick(uid, sid, name, cb) {
		var channel = this.cs.getChannel(name, false);
		// leave channel
		if( !! channel) {
			channel.leave(uid, sid);
		}
		var username = uid.split('*')[0];
		var param = {
			route: 'onLeave',
			user: username
		};
		channel.pushMessage(param);
		cb();
	}

}


module.exports = function(app) {
	return new ChatRemote(app);
};



