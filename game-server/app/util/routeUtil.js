
const dispatcher = require('./dispatcher');

module.exports = (session, msg, app, cb) => {

    console.log('dispath servers');
	const chatServers = app.getServersByType('chat');

	if(!chatServers || chatServers.length === 0) {
		cb(new Error('can not find chat servers.'));
		return;
	}

	const res = dispatcher.dispatch(session.get('rid'), chatServers);
	cb(null, res.id);
};
