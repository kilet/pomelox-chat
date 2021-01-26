'use strict';
const BaseHandler = require('../../../basic/BaseHandler');

class CommHandler extends BaseHandler{
	constructor(app){
		super(app);
	}

	// 获取验证码
	async verifyCode(msg, session){
	    console.log('get verifyCode',msg)
        let result = await this.commService.genVerifyCode(msg.phone,6);
	    if(result.vcode){
	        //发送验证码到手机
	        // await this.thirdService.sendSMS(msg.phone,result.vcode)
        }
	    return result;
    }

    // async authVerify(msg, session){
	//     return await this.commService.authVerifyCode(msg.phone,msg.code);
    // }
}


module.exports = function(app) {
	return new CommHandler(app);
};


