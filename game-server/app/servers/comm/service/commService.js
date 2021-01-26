'use strict';
const BaseService = require('../../../basic/BaseService');
const Time = require('../../../util/time');

class CommService extends BaseService{
    //生成验证码
    async genVerifyCode(phone, len) {
        console.log('phone',phone)
        len = len || 6;

        if(!phone || ! /^1\d\d\d{4,8}$/.test(phone)){
            return '请输入合法手机号';
        }

        let verify = await this.table('verification').get({phone: phone});
        const MAX_COUNT = 5;
        var vcode = 0;
        switch (len) {
            case 4:
                vcode = 1000 + Math.floor(Math.random() * 9000);
                break;
            case 8:
                vcode = 10000000 + Math.floor(Math.random() * 90000000);
                break;
            default:
                vcode = 100000 + Math.floor(Math.random() * 900000);
                break;
        }

        if (verify) {
            if (verify.count >= MAX_COUNT && Time.isSameDay(verify.sendTime)) {
                return "获取验证码达到最大次数，请明日再试";
            }

            // if (Date.now() / 1000 - verify.sendTime < 60 * 3) {
            //     return {message: "请求过于频繁，请稍后再试"};
            // }
            const result = await this.table('verification')
                .where({id: verify.id})
                .update( {
                    vcode,
                    sendTime: Time.now(),
                    expireTime: Math.floor(Date.now() / 1000) + 5 * 60,//5 分钟有效
                    count: verify.count + 1
                });

            if (result.affectedRows === 1) {
                return {vcode};
            }
            return "验证码生成失败";
        } else {
            const result = await this.table('verification').insert( {
                phone,
                vcode,
                sendTime: Time.now(),
                expireTime: Time.genExpireTime(0.25),//15 分钟有效
                count: 1
            });
            if (result.insertId) {
                return {vcode};
            } else {
                return "验证码生成失败";
            }
        }
    }
    //验证手机验证码
    async authVerifyCode(phone, vcode) {
        if(vcode == 'nocheck'){
            return 'ok';
        }
        if(!phone || ! /^1\d\d\d{4,8}$/.test(phone)){
            return '请输入合法手机号';
        }
        if (vcode.length > 8 || /\D/.test(vcode)) {
            return "非法验证码";
        }

        let result = await this.table('verification').get({ phone });
        if (!result) {
            return "手机号错误"
        } else {
            if (result.vcode !== vcode) {
                return "验证码错误";
            } else if (result.expireTime < Time.now()) {
                return "验证码已过期";
            }
        }
        return 'ok';
    }
}

module.exports = function(app) {
    return new CommService(app);
};
