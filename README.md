### cloudbase-adapter-quickapp

## 安装

npm i cloudbase-adapter-quickapp -S

## 使用

```js
import tcb from 'tsb-js-sdk';
import adapter from 'cloudbase-adapter-quickapp';


tcb.useAdapters(adapter);
// 或 数组方式
// tcb.useAdapters([adapter]);

tcb.init({
    env: 'test-xxx',
    appSecret: {
        appAccessKeyId: 'appAccessKeyId',
        appAccessKey: 'appAccessKey'
    },
    appSign: 'appSign' // 快应用报名
});

```

### Tips:

- 快应用的storage 数据缓存没有同步的API. genAdapter 可以不设置localStorage，设置root即可

- 在manifest.json文件里声明adapter中用到的接口:

    - @system.fetch
    - @system.request
    - @system.websocketfactory