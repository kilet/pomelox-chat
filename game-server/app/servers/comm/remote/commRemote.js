
const BaseRemote = require('../../../basic/BaseRemote');


class CommRemote extends BaseRemote{
	constructor( app ){
		super(app);
	}
    async genVerifyCode(phone){
        return await this.commService.genVerifyCode(phone,6);
    }

    async authVerify(phone, code){
        return await this.commService.authVerifyCode(phone,code);
    }

    // async decryptData(data){
    //     return await this.wechatService.decryptData(data);
    // }
    // async authorize(data){
    //     return await this.wechatService.authorize(data);
    // }
}


module.exports = function(app) {
	return new CommRemote(app);
};



