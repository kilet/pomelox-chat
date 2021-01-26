'use strict';
const BaseHandler = require('../../../basic/BaseHandler');

class EntryHandler extends BaseHandler{
	constructor(app){
		super(app);
	}

	/**
	 * New client entry chat server.
	 *
	 * @param  {Object}   msg     request message
	 * @param  {Object}   session current session object
	 * @param  {Function} next    next stemp callback
	 * @return {Void}
	 */
	// enter (msg, session, next) {
    //     var self = this;
    //     var rid = msg.rid;
    //     var uid = msg.username + '*' + rid
    //     var sessionService = self.app.get('sessionService');
    //
    //     //duplicate log in
    //     if( !! sessionService.getByUid(uid)) {
    //         next(null, {
    //             code: 500,
    //             error: true
    //         });
    //     }
    //
    //     session.bind(uid);
    //     session.set('rid', rid);
    //     session.push('rid', function(err) {
    //         if(err) {
    //             console.error('set rid for session service failed! error is : %j', err.stack);
    //         }
    //     });
    //     session.on('closed', onUserLeave.bind(null, self.app));
    //     //put user into channel uid, sid, name, flag, cb
    //     self.app.rpc.chat.chatRemote.add(session, uid, self.app.get('serverId'), rid, true, function(users){
    //     	next(null, {
    //     		users:users
    //     	});
    //     });
    // }

	async enter (msg, session, next) {
		var self = this;
		var rid = msg.rid;
		var uid = msg.username + '*' + rid
		var sessionService = self.app.get('sessionService');

		//duplicate log in
		if( !! sessionService.getByUid(uid)) {
			next(null, {
				code: 500,
				error: true
			});
			return;
		}

		session.bind(uid);
		session.set('rid', rid);
		session.push('rid', function(err) {
			if(err) {
				console.error('set rid for session service failed! error is : %j', err.stack);
			}
		});
		session.on('closed', onUserLeave.bind(null, self.app));

        let reuslt = await this.rpc('chat.chatRemote.add',session,uid, self.app.get('serverId'), rid, true);
        console.log('rpc result',reuslt)

        return {
            users:reuslt
        };
	}
}

module.exports = function(app) {
	return new EntryHandler(app);
};


/**
 * User log out handler
 *
 * @param {Object} app current application
 * @param {Object} session current session object
 *
 */
var onUserLeave = function(app, session) {
	if(!session || !session.uid) {
		return;
	}
	app.rpc.chat.chatRemote.kick(session, session.uid, app.get('serverId'), session.get('rid'), null);
};
