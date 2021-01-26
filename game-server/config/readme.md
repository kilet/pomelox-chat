### 加载配置文件顺序

1. 优先判断对应开发环境目录下是否有相对应配置文件（development | production）
2. 若没有，则加载当前目录下是否有相关配置文件

### 配置文件说明

1. config.js 服务器启动加载的配置文件
  + + filters：指定过滤器实现文件
  + + route：指定路由配置文件
  + + plugins：指定加载的pomelo插件，
        例如：
        ```javascript 
        {
           package: '@sex-pomelo/pomelo-i18n',//加载的插件名，也可以是本地插件的路径
           //package: app.getBase() + '/app/plugins/mysql',//require 路径
           serverType: '!master|chat',// 指定需要加载的服务器，！表示指定的服务器排除
           cfg: {params:''}//透传参数
        }
        ```
        
2. log4js.json 设置日志输出文件
3. 
