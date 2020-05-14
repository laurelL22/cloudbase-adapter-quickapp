### cloudbase-adapter-quickapp

## 介绍

利用 cloudbase-adapter-quickapp 快应用适配器可以在快应用中使用 JavaScript 代码服务访问 TCB 的的服务。

云开发（CloudBase） 是基于Serverless架构构建的一站式后端云服务，涵盖函数、数据库、存储、CDN等服务，免后端运维，支持小程序、Web和APP开发。[云开发 CloudBase](https://cloud.tencent.com/product/tcb?from=12334)

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
    appSign: 'appSign'
});

```

### Tips:

- 快应用的storage 数据缓存没有同步的API. genAdapter 可以不设置localStorage，设置root即可

- 在manifest.json文件里声明adapter中用到的接口:

    - @system.fetch
    - @system.request
    - @system.websocketfactory