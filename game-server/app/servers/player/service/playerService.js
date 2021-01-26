
const BaseService = require('../../../basic/BaseService');

// 存储玩家内存数据模块，该模块不支持热更新
class PlayerService extends BaseService{
	constructor( app ){
		super(app);
	}
}

module.exports = function(app) {
    return new PlayerService(app);
};
