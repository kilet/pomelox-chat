
const BaseRemote = require('../../../basic/BaseRemote');
// const PlayService = require('./service/playerService');

class PlayerRemote extends BaseRemote{
	constructor( app ){
		super(app);
	}
}


module.exports = function(app) {
	return new PlayerRemote(app);
};



