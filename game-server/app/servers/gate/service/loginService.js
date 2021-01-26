'use strict';
const BaseService = require('../../../basic/BaseService');
const Time = require('../../../util/time');

class LoginService extends BaseService{
    //生成验证码
    async login(data) {
        this.log('check do login');
    }
}

module.exports = function(app) {
    return new LoginService(app);
};
