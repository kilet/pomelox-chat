-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: usedCar
-- ------------------------------------------------------
-- Server version	5.7.28-log

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `account` varchar(32) NOT NULL COMMENT '账号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `name` varchar(45) DEFAULT '' COMMENT '名称',
  `roleid` int(11) DEFAULT '2' COMMENT '权限类型（对应权限表的id）,0：超级管理员，最高权限不受限制，1：开发人员；2：运营人员',
  `loginCount` int(11) DEFAULT '0' COMMENT '登录次数',
  `lastLoginTime` bigint(20) DEFAULT NULL COMMENT '最后登录时间，登录自动更新',
  `lastLoginIP` varchar(16) DEFAULT '' COMMENT '最后登录ip',
  `token` varchar(64) DEFAULT '' COMMENT '登录token',
  `expireTime` bigint(20) DEFAULT NULL COMMENT 'token过期时间',
  `status` int(11) DEFAULT '0' COMMENT '账号状态：0正常，99：封号',
  `createTime` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `banners`
--

DROP TABLE IF EXISTS `banners`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `banners` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `category` int(11) DEFAULT NULL COMMENT '显示位置：0：推荐页，1：最新页，2：高阶页，3：个人中心页',
  `image` varchar(64) NOT NULL,
  `sort` int(11) DEFAULT '0',
  `purpose` int(11) DEFAULT NULL COMMENT '指定usage用途类型：1跳转到页面,2跳转到导航页， 3跳转至车辆详情页,4展示大图',
  `usage` varchar(512) DEFAULT NULL COMMENT '需要purpose确定用途',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COMMENT='轮播图，广告图';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `config`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `config` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT '' COMMENT '中文名称',
  `key` varchar(32) NOT NULL COMMENT '配置的名称',
  `value` json DEFAULT NULL COMMENT 'json数据',
  `comment` varchar(256) DEFAULT '' COMMENT '配置备注说明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COMMENT='应用部分界面相关配置，如分享图等';
/*!40101 SET character_set_client = @saved_cs_client */;


--
-- Table structure for table `dateStatics`
--

DROP TABLE IF EXISTS `dateStatics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `dateStatics` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `date` varchar(16) DEFAULT '0' COMMENT '日期',
  `loginCount` int(11) DEFAULT '0' COMMENT '登录人数',
  `registerCount` int(11) DEFAULT '0' COMMENT '注册人数',
  `redPrice` int(11) DEFAULT '0' COMMENT '红包总额',
  `redCount` int(11) DEFAULT '0' COMMENT '红包总额',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb4 COMMENT='日期统计表（dateStatics）,按日期统计的数据 ( id=0第一条为 总累计的统计数据 )';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `help`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `help` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL COMMENT '帮助标题',
  `content` varchar(512) NOT NULL COMMENT '帮助文本内容',
  `sort` int(11) DEFAULT '0' COMMENT '排序',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='帮助中心';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `loginRecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `loginRecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `loginid` int(11) NOT NULL,
  `loginTime` datetime DEFAULT CURRENT_TIMESTAMP,
  `type` int(11) DEFAULT '0' COMMENT '类型，0：管理员登陆，1：管理员退出,2：用户登录，3，用户退出',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=235 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `message`
--

DROP TABLE IF EXISTS `message`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `message` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `type` int(11) DEFAULT '0' COMMENT '100以下对单个用户（有已读状态）：0：系统消息，1：用户私信，2：推送消息，3：召唤队员消息，100：广告，',
  `title` varchar(45) NOT NULL COMMENT '消息标题',
  `content` varchar(512) NOT NULL,
  `fromid` int(11) DEFAULT '0' COMMENT '发送者id，0：系统',
  `recvid` int(11) DEFAULT '0' COMMENT '接收者id，0：所有',
  `url` varchar(64) DEFAULT NULL COMMENT '跳转url',
  `sendTime` bigint(20) DEFAULT NULL COMMENT '创建时间',
  `readTime` bigint(20) DEFAULT NULL,
  `status` int(11) DEFAULT '0' COMMENT '消息状态：根据类型不同意义不同，私信类：0未读，1已读；2无效（表示删除）',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='消息';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `oprecord`
--

DROP TABLE IF EXISTS `oprecord`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `oprecord` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `adminid` int(11) NOT NULL,
  `createTime` bigint(20) DEFAULT '0' COMMENT '登录时间',
  `action` int(11) DEFAULT '0' COMMENT '操作类型：1：查看，2：修改，3：添加，4：删除',
  `value` int(11) DEFAULT '0' COMMENT '操作值',
  `params` json DEFAULT NULL COMMENT '其他参数',
  `describe` varchar(128) DEFAULT '' COMMENT '描述说明',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COMMENT='操作记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

DROP TABLE IF EXISTS `role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `role` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL COMMENT '角色名称，如：超级管理员',
  `permission` json DEFAULT NULL COMMENT '导航栏权限字典',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `trade`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `trade` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL COMMENT '提现用户',
  `money` int(11) NOT NULL COMMENT '提现或者支付金额',
  `stime` bigint(20) DEFAULT '0' COMMENT '发起时间',
  `phase` int(11) DEFAULT '0' COMMENT '交易阶段：0 审批中（或者等待用户付费），1转账中，2成功， 3失败，4超时，5用户取消，6官方拒绝，7模拟付款，8已退款',
  `payTime` bigint(20) DEFAULT '0' COMMENT '付款时间',
  `doneTime` bigint(20) DEFAULT '0',
  `reason` varchar(45) DEFAULT '' COMMENT '转账失败原因（如系统出错）',
  `channel` int(11) NOT NULL DEFAULT '1' COMMENT '提现途径 1:微信，2：支付宝，3模拟支付，4苹果支付，10人工方式实现用户提现',
  `tradeNo` varchar(64) DEFAULT '' COMMENT '订单号',
  `paymentNo` varchar(64) DEFAULT '' COMMENT '预付单号，或支付订单号',
  `direction` int(11) DEFAULT '0' COMMENT '金钱流向：0用户支付，1用户提现，2系统退款',
  `note` varchar(128) DEFAULT '' COMMENT '用户备注',
  `usage` int(11) DEFAULT '0' COMMENT '用途：未定义',
  `params` json DEFAULT NULL COMMENT '附带参数，用于付费成功后创建订单',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=370 DEFAULT CHARSET=utf8mb4 COMMENT='交易表：用户提现，充值';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `nickname` varchar(32) DEFAULT '-' COMMENT '昵称',
  `phone` varchar(16) DEFAULT '' COMMENT '手机号',
  `password` varchar(64) DEFAULT NULL COMMENT '密码',
  `openid` varchar(64) DEFAULT '' COMMENT '微信openid',
  `unionid` varchar(64) DEFAULT '' COMMENT '微信unionid',
  `registerTime` bigint(20) NOT NULL COMMENT '注册时间',
  `type` int(11) DEFAULT '0' COMMENT '用户类型：0普通用户，1商家',
  `gender` int(11) DEFAULT '0' COMMENT '0:保密，1：男性，2：女性',
  `avatar` varchar(256) DEFAULT '' COMMENT '头像',
  `signature` varchar(45) DEFAULT '' COMMENT '个性签名',
  `inviterid` int(11) DEFAULT '0' COMMENT '邀请者id（上家id）',
  `loginCount` int(11) DEFAULT '0',
  `lastLoginTime` bigint(20) NOT NULL DEFAULT '0' COMMENT '最后登录时间戳',
  `lastLoginIP` varchar(16) DEFAULT '' COMMENT '最后登录ip',
  `deviceCode` varchar(45) DEFAULT '' COMMENT '注册设备码',
  `deviceType` varchar(8) DEFAULT '' COMMENT '登录类型',
  `token` varchar(64) DEFAULT '',
  `expireTime` bigint(20) DEFAULT NULL COMMENT 'token过期时间',
  `channel` varchar(16) DEFAULT '1' COMMENT '注册渠道',
  `valid` int(11) DEFAULT '1' COMMENT '1有效用户，2：封号',
  `birthmark` varchar(32) DEFAULT '' COMMENT '用户唯一标识',
  `viplevel` int(11) DEFAULT '0' COMMENT 'vip等级',
  `vipExpire` int(11) DEFAULT '0' COMMENT 'vip到期时间',
  `city` varchar(45) DEFAULT '' COMMENT '用户所在城市',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=100017 DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `userStatics`
--

DROP TABLE IF EXISTS `userStatics`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `userStatics` (
  `userid` int(11) NOT NULL DEFAULT '0' COMMENT '用户id',
  `money` int(11) DEFAULT '0' COMMENT '账户余额',
  `picked` int(11) DEFAULT '0' COMMENT '已提现',
  `redCount` int(11) DEFAULT '0' COMMENT '红包个数',
  PRIMARY KEY (`userid`)
  
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `verification`
--

DROP TABLE IF EXISTS `verification`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `verification` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sendTime` bigint(20) NOT NULL COMMENT '发送时间',
  `expireTime` bigint(20) DEFAULT NULL,
  `count` int(11) NOT NULL DEFAULT '0',
  `phone` varchar(16) NOT NULL,
  `code` varchar(8) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COMMENT='验证码表';
/*!40101 SET character_set_client = @saved_cs_client */;


DROP TABLE IF EXISTS `wechat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wechat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) unsigned NOT NULL,
  `officialOpenid` varchar(64) DEFAULT NULL COMMENT '公众号 openid',
  `unionid` varchar(64) NOT NULL COMMENT '微信用户唯一id',
  `createTime` bigint(20) DEFAULT NULL COMMENT '关注公众号时间',
  `appid` varchar(16) DEFAULT NULL,
  `subscribe` int(11) DEFAULT '1' COMMENT '是否已关注 0：未关注 1：已关注',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='微信公众号相关';
/*!40101 SET character_set_client = @saved_cs_client */;
