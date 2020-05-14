import {
  AbstractSDKRequest,
  IRequestOptions,
  IUploadRequestOptions,
  StorageInterface,
  WebSocketInterface,
  WebSocketContructor,
  SDKAdapterInterface,
  formatUrl
} from '@cloudbase/adapter-interface';

// isMatch函数判断当前平台是否匹配
function isMatch(): boolean {
  try {
    const app = require('@system.app');
    const info = app.getInfo();
    return !!info;
  }
  catch (e) {
    return false;
  }
}

// Request类为平台特有的网络请求，必须实现post/upload/download三个public接口
export class QappRequest extends AbstractSDKRequest {
  // 实现post接口
  public post(options: IRequestOptions) {
    return new Promise((resolve, reject) => {
      try {
        const fetch = require('@system.fetch');
        const {
          url,
          data,
          headers
        } = options;

        fetch.fetch({
          url: formatUrl('https:', url),
          data: JSON.stringify(data), // fixed quickapp post fetch isn't support 'Content-Type' when post json object
          method: 'POST',
          header: headers,
          responseType: 'json', // set reponseType is 'json', default 'text'
          success: function (res) {
            res.statusCode = res.code; // fixed res.status is undefined in tcb-js-sdk

            resolve(res);
          },
          fail: function (err) {
            reject(err);
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }
  // 实现upload接口
  public upload(options: IUploadRequestOptions) {
    return new Promise((resolve, reject) => {
      try {
        const request = require('@system.request');
        const { url, data, file, headers } = options;
        // format data
        let dlist = [];
        Object.keys(data).forEach(i => {
          dlist.push({name: i, value: data[i]})
        })

        request.upload({
          url: formatUrl('https:', url),
          header: headers,
          files: [
            {
              uri: file,
              filename: file,
            }
          ],
          data: [
            ...dlist,
            {
              name: 'form_' + Date.now(), // form 元素的名称, fixed: no value for name
              value: 'value_' + Date.now(), // form 元素的值
            }
          ],
          success: function(res) {
            const result = {
              statusCode: res.code,
              data: res.data || {}
            };

            // 200转化为201
            if (res.code === 200 && data.success_action_status) {
              result.statusCode = parseInt(data.success_action_status, 10);
            }
            resolve(result);
          },
          fail: function(data, code) {
            reject({ data, code });
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }
  // 实现download接口
  public download(options: IRequestOptions) {
    return new Promise((resolve, reject) => {
      try {
        const request = require('@system.request');
        const { url, headers } = options;

        request.download({
          url: formatUrl('https:', url),
          header: headers,
          success: function(res) {
            if (res.token) {
              // 只返回临时链接不保存到设备
              resolve({
                statusCode: 200,
                tempFilePath: url
              });
            } else {
              resolve(res);
            }
          },
          fail: function(data, code) {
            reject(JSON.stringify({ data, code }));
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }
}

// Storage为平台特有的本地存储，必须实现setItem/getItem/removeItem/clear四个接口
export const QappStorage: StorageInterface = {
  setItem(key: string, value: any) {
    return new Promise((resolve, reject) => {
      try {
        const storage = require('@system.storage');
        storage.set({
          key,
          value,
          success: function(data) {
            resolve(data);
          },
          fail: function(data, code) {
            // reject({ data, code });
            reject(JSON.stringify({ data, code }));
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  },
  getItem(key: string): any {
      return new Promise((resolve, reject) => {
        try {
          const storage = require('@system.storage');
          storage.get({
            key,
            success: function(data) {
              resolve(data);
            },
            fail: function(data, code) {
              reject(JSON.stringify({ data, code }));
            }
          });
        } catch(e) {
          reject(e);
        }
      });
  },
  removeItem(key: string) {
    return new Promise((resolve, reject) => {
      try {
        const storage = require('@system.storage');
        storage.delete({
          key,
          success: function(data) {
            resolve(data);
          },
          fail: function(data, code) {
            reject(JSON.stringify({ data, code }));
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  },
  clear() {
    return new Promise((resolve, reject) => {
      try {
        const storage = require('@system.storage');
        storage.clear({
          success: function(data) {
            resolve(data);
          },
          fail: function(data, code) {
            reject(JSON.stringify({ data, code }));
          }
        });
      } catch(e) {
        reject(e);
      }
    });
  }
};

// WebSocket为平台特有的WebSocket，与HTML5标准规范一致
export class QappWebSocket {
  constructor(url: string, options: object = {}) {
    try {
      const websocketfactory = require('@system.websocketfactory');
      let ws = websocketfactory.create({
        url,
        ...options
      });

      const socketTask: WebSocketInterface = {
        set onopen(cb) {
          ws.onopen = cb;
        },
        set onmessage(cb) {
          ws.onmessage = cb;
        },
        set onclose(cb) {
          ws.onclose = cb;
        },
        set onerror(cb) {
          ws.onerror = cb;
        },
        send: (data) => {
          return ws.send({ data });
        },
        close: (code? : number, reason? : string) => {
          return ws.close({
            code: code,
            reason: reason
          });
        },
        get readyState() {
          return ws.readyState;
        },
        CONNECTING: 0,
        OPEN: 1,
        CLOSING: 2,
        CLOSED: 3
      };
      return socketTask;
    } catch (e) {}
  }
}

// genAdapter函数创建adapter实体
function genAdapter() {
  const adapter: SDKAdapterInterface = {
    root: global,
    reqClass: QappRequest,
    wsClass: QappWebSocket as WebSocketContructor,
    getAppSign: function () {
      try {
        const app = require('@system.app')
        return app.getInfo().packageName;
      } catch(e) {}
    }
  };
  return adapter;
}

const adapter = {
  genAdapter,
  isMatch,
  // runtime为标记平台唯一性的说明
  runtime: 'quickapp'
};

export default adapter;