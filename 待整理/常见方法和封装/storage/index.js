/**
 * 存储相关 storage
 */
const defaultConfig = {
  prefix: "_ls_xxxx_",
};

const _config = {
  ...defaultConfig,
};

const ls = window.localStorage;

const events = {};

export default {
  config: (config) => {
    Object.assign(_config, config);
  },
  // ttl 存活时间 单位秒 0表示无限制
  set: (key, value, ttl = 0) => {
    let data = { data: value };
    if (ttl > 0) {
      data.ttl = ttl;
      data.created = +new Date();
    }
    try {
      ls.setItem(`${_config.prefix}${key}`, JSON.stringify(data));
      if (events[key]) {
        // 事件回调
        events[key].forEach((callback) => {
          callback(value, ttl);
        });
      }
    } catch (error) {}
  },
  get: (key, defaultValue) => {
    try {
      let data = ls.getItem(`${_config.prefix}${key}`);
      if (data) {
        data = JSON.parse(data);
        if (!data.ttl || new Date() - data.created < data.ttl) {
          return data.data;
        }
      }
    } catch (error) {}
    return defaultValue;
  },
  remove: (key) => {
    ls.removeItem(`${_config.prefix}${key}`);
  },
  clear: () => {
    ls.clear();
  },
  // 监听
  on: (key, callback) => {
    if (events[key]) {
      events[key].push(callback);
    } else {
      events[key] = [callback];
    }
  },
  off: (key, callback) => {
    if (events[key]) {
      const index = events[key].indexOf(callback);
      if (~index) {
        events[key].splice(index, 1);
      }
    }
  },
};
