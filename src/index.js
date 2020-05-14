"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var adapter_interface_1 = require("@cloudbase/adapter-interface");
function isMatch() {
    try {
        var app = require('@system.app');
        var info = app.getInfo();
        return !!info;
    }
    catch (e) {
        return false;
    }
}
var QappRequest = (function (_super) {
    __extends(QappRequest, _super);
    function QappRequest() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    QappRequest.prototype.post = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var fetch_1 = require('@system.fetch');
                var url = options.url, data = options.data, headers = options.headers;
                fetch_1.fetch({
                    url: adapter_interface_1.formatUrl('https:', url),
                    data: JSON.stringify(data),
                    method: 'POST',
                    header: headers,
                    responseType: 'json',
                    success: function (res) {
                        res.statusCode = res.code;
                        resolve(res);
                    },
                    fail: function (err) {
                        reject(err);
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    QappRequest.prototype.upload = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var request = require('@system.request');
                var url = options.url, data_1 = options.data, file = options.file, headers = options.headers;
                var dlist_1 = [];
                Object.keys(data_1).forEach(function (i) {
                    dlist_1.push({ name: i, value: data_1[i] });
                });
                request.upload({
                    url: adapter_interface_1.formatUrl('https:', url),
                    header: headers,
                    files: [
                        {
                            uri: file,
                            filename: file,
                        }
                    ],
                    data: __spreadArrays(dlist_1, [
                        {
                            name: 'form_' + Date.now(),
                            value: 'value_' + Date.now(),
                        }
                    ]),
                    success: function (res) {
                        var result = {
                            statusCode: res.code,
                            data: res.data || {}
                        };
                        if (res.code === 200 && data_1.success_action_status) {
                            result.statusCode = parseInt(data_1.success_action_status, 10);
                        }
                        resolve(result);
                    },
                    fail: function (data, code) {
                        reject({ data: data, code: code });
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    QappRequest.prototype.download = function (options) {
        return new Promise(function (resolve, reject) {
            try {
                var request = require('@system.request');
                var url_1 = options.url, headers = options.headers;
                request.download({
                    url: adapter_interface_1.formatUrl('https:', url_1),
                    header: headers,
                    success: function (res) {
                        if (res.token) {
                            resolve({
                                statusCode: 200,
                                tempFilePath: url_1
                            });
                        }
                        else {
                            resolve(res);
                        }
                    },
                    fail: function (data, code) {
                        reject(JSON.stringify({ data: data, code: code }));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    };
    return QappRequest;
}(adapter_interface_1.AbstractSDKRequest));
exports.QappRequest = QappRequest;
exports.QappStorage = {
    setItem: function (key, value) {
        return new Promise(function (resolve, reject) {
            try {
                var storage = require('@system.storage');
                storage.set({
                    key: key,
                    value: value,
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data, code) {
                        reject(JSON.stringify({ data: data, code: code }));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    },
    getItem: function (key) {
        return new Promise(function (resolve, reject) {
            try {
                var storage = require('@system.storage');
                storage.get({
                    key: key,
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data, code) {
                        reject(JSON.stringify({ data: data, code: code }));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    },
    removeItem: function (key) {
        return new Promise(function (resolve, reject) {
            try {
                var storage = require('@system.storage');
                storage.delete({
                    key: key,
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data, code) {
                        reject(JSON.stringify({ data: data, code: code }));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    },
    clear: function () {
        return new Promise(function (resolve, reject) {
            try {
                var storage = require('@system.storage');
                storage.clear({
                    success: function (data) {
                        resolve(data);
                    },
                    fail: function (data, code) {
                        reject(JSON.stringify({ data: data, code: code }));
                    }
                });
            }
            catch (e) {
                reject(e);
            }
        });
    }
};
var QappWebSocket = (function () {
    function QappWebSocket(url, options) {
        if (options === void 0) { options = {}; }
        try {
            var websocketfactory = require('@system.websocketfactory');
            var ws_1 = websocketfactory.create(__assign({ url: url }, options));
            var socketTask = {
                set onopen(cb) {
                    ws_1.onopen = cb;
                },
                set onmessage(cb) {
                    ws_1.onmessage = cb;
                },
                set onclose(cb) {
                    ws_1.onclose = cb;
                },
                set onerror(cb) {
                    ws_1.onerror = cb;
                },
                send: function (data) {
                    return ws_1.send({ data: data });
                },
                close: function (code, reason) {
                    return ws_1.close({
                        code: code,
                        reason: reason
                    });
                },
                get readyState() {
                    return ws_1.readyState;
                },
                CONNECTING: 0,
                OPEN: 1,
                CLOSING: 2,
                CLOSED: 3
            };
            return socketTask;
        }
        catch (e) { }
    }
    return QappWebSocket;
}());
exports.QappWebSocket = QappWebSocket;
function genAdapter() {
    var adapter = {
        root: global,
        reqClass: QappRequest,
        wsClass: QappWebSocket,
        getAppSign: function () {
            try {
                var app = require('@system.app');
                return app.getInfo().packageName;
            }
            catch (e) { }
        }
    };
    return adapter;
}
var adapter = {
    genAdapter: genAdapter,
    isMatch: isMatch,
    runtime: 'quickapp'
};
exports.default = adapter;
