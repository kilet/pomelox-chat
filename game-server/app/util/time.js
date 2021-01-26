'use strict';
const utility = require("utility");//密码加密
const moment = require('moment');

const RoundStringPool = "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890";
class Time {

    static get oneDay() {
        return 24 * 60 * 60;
    }

    static now() {
        return Math.floor(Date.now() / 1000);
    }

    //生成数据库查询的时间条件
    static condDayBetween(key, tm,tmEnd) {
        tm = tm?tm*1000:Date.now();
        let start = moment(tm).startOf('days').valueOf()/1000;
        let end = Math.floor(moment((tmEnd?tmEnd*1000:tm)).endOf('days').valueOf()/1000);

        return `(${key} >= ${start} and ${key} <= ${end})`;
    }
    static _momOfCategory(category,offset) {
        // category = week,month,quarter
        let start = 0,end = 0;
        if(offset){
            let mom = moment()[category];
            switch (category) {
                case 'week':
                    start = moment().week(moment().week() + offset).startOf('week')
                    end = moment().week(moment().week() + offset).endOf('week')
                    break;
                case 'month':
                    start = moment().month(moment().month() + offset).startOf('month')
                    end = moment().month(moment().month() + offset).endOf('month')
                    break;
                case 'quarter':
                    start = moment().quarter(moment().quarter() + offset).startOf('quarter')
                    end = moment().quarter(moment().quarter() + offset).endOf('quarter')
                    break;
            }
        }else{
            start = moment().startOf(category)
            end = moment().endOf(category)
        }
        return {start:start.valueOf()/1000,end:Math.floor(end.valueOf()/1000)}
    }
    //指定周，offset 偏移周
    static condOfKind(key,kind) {
        //只能接受时间戳
        let offset = 0;
        let category = '';
        switch (kind) {
            case 'week':
            case 'month':
            case 'quarter':
                category = kind;
                break;
            case 'lastWeek':
                category = 'week';offset = -1;
                break;
            case 'lastMonth':
                category = 'month';offset = -1;
                break;
            case 'lastQuarter':
                category = 'quarter';offset = -1;
                break;
            default:
                console.log("condOfKind invalid kind");
                return null;
        }
        const {start,end} = this._momOfCategory(category,offset);
        return `(${key} >= ${start} and ${key} <= ${end})`
    }

    //生成数据库查询的时间条件
    static condDayOf(key, tm) {
        tm = parseInt(tm);
        if (tm > 1000000) {// 可以判断为秒数或者毫秒
            if(tm > (Date.now()/100)){//根据数量级判断为毫秒
                return "FROM_UNIXTIME(" + key + ",'%Y-%m-%d') =" + moment(tm).format("'YYYY-MM-DD'");
            }
            return "FROM_UNIXTIME(" + key + ",'%Y-%m-%d') =" + moment(tm * 1000).format("'YYYY-MM-DD'");
        } else {
            return "FROM_UNIXTIME(" + key + ",'%Y-%m-%d') = '" + tm + "'";
        }
    }

    // 生成 mysql 条件语句
    static condToday(key) {
        return "FROM_UNIXTIME(" + key + ",'%Y-%m-%d') =" + moment().format("'YYYY-MM-DD'");
    }

    //moment().subtract(1, 'year').format('YYYY-MM-DD');
    //moment().add(2,'hours').format('YYYY-MM-DD HH:mm:ss');
    static condYesterday(key) {
        return "FROM_UNIXTIME(" + key + ",'%Y-%m-%d') =" + moment().add(-1, 'days').format("'YYYY-MM-DD'");
    }

    static genToken() {
        let str = '';// 随机生成 ascII码 0-z 之间的可见字符
        for (let i = 0; i < 4; i++) {
            str = str + String.fromCharCode(48 + (Math.random() * 100) % 78);
        }
        return utility.md5(Date.now() + str);
    }

    static genExpireTime(hour) {
        return Math.floor(Date.now() / 1000 + hour * 60 * 60);
    }

    static toDateString(t,format){
        return moment(t*1000).format(format || "YYYY-MM-DD HH:mm:ss")
    }
    static toTimestamp(date){
        return moment(date).format("X");
    }
    static isSameDay (t1, t2) {
        if (!t1) return false;
        return moment(t1 * 1000).format("YYYYMMDD") === moment(t2 ? t2 * 1000 : Date.now()).format("YYYYMMDD");
    }
    static genSerialNumber(prefix,len){
        let str = '';// 随机生成 ascII码 A-Z 之间的字符
        for (let i = 0; i < 6; i++) {
            str = str + String.fromCharCode(65 + (Math.random() * 100) % 26);
        }
        const tm = Date.now();
        const timestr = moment(tm).format("YYYYMMDDTHHmmss");

        let sn =  (prefix||"") + timestr + str + tm%1000;
        if(len && sn.length < len){
            str = '';
            for (let i = 0; i < len - sn.length; i++) {
                str = str + String.fromCharCode(65 + (Math.random() * 100) % 26);
            }
            return sn + str;
        }
        return sn;
    }

    //唯一随机字符串
    static genRoundString(len,bUnique){
        len = len || 8;//默认生成16位字符串
        let str = '';// 随机生成 ascII码 a-z 之间的字符
        if(bUnique){
            str = Date.now().toString(36);//生成8位唯一字符
            len = len - str.length;
        }
        for (let i = 0; i < len; i++) {
            let idx = Math.floor((Math.random() * 128) % RoundStringPool.length);
            str = str + RoundStringPool[idx];
        }
        return str;
    }
    //过了多少天
    static spanDay(btime){
        let start = moment(btime*1000).startOf('days').valueOf()/1000;
        let now = Date.now() / 1000;

        return Math.floor((now - start)/(24*60*60));
    }
    // FROM_UNIXTIME(registerTime,'%Y-%m-%d')

    //创建微信超时时间
    static wxExpireTime(hour){
        return moment(Date.now() + (hour || 2)*60*60*1000).format("YYYYMMDDHHmmss")
    }
    static weekNumber(){
        //星期几
        return moment().format('d');
    }
}

module.exports = Time;
