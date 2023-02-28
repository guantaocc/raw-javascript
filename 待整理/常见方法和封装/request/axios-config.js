/**
 * axios 封装技巧
 */
import axios, { CancelToken } from "axios";
import { message as antMessage } from "ant-design-vue";
import store from "../store";
import router from "../router";

export const baseURL =
  process.env.NODE_ENV === "production" ? "https://xxxx" : "/api";
const instance = axios.create({
  baseURL,
  timeout: 5000,
});

instance.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers = config.headers || {};
    config.headers["Authorization"] = `${store.getters.token}`;
  }
  return config;
});

instance.interceptors.response.use(
  async (res) => {
    // 统一返回结果
    if (res.status < 300 && res.status >= 200) {
      // 下载类型
      if (res.data instanceof Blob) {
        return {
          error: false,
          data: res.data,
          detail: res.request.response,
        };
      }
      const { code, data, msg } = res.data;
      if (code === 200) {
        return {
          error: false,
          data,
        };
      }
      if (code === 401) {
        antMessage.error("登陆到期，请重新登陆");
        setTimeout(() => {
          router
            .replace({
              path: "/auth/login",
              query:
                store.getters.userType === "admin"
                  ? { redirect_type: "admin" }
                  : {},
            })
            .then(() => {
              location.reload();
            });
        }, 500);
        return;
      }
      if (msg) {
        antMessage.error(msg);
      }
      return Promise.reject(res);
    }

    return {
      error: res.statusText,
      data: res.data,
      detail: { status: res.status },
    };
  },
  (res) => {
    console.error(res.name, res.message);
    let message = res?.response?.data?.msg;
    if (res?.response?.status) {
      const status = res.response.status;
      if (status === 401) {
        store.dispatch("logout");
        router.replace({
          name: "login",
          query: { from: router.currentRoute.fullPath },
        });
      }
    }

    if (message) {
      antMessage.error(message);
    }
    antMessage.error("服务异常，请重试！");
    return Promise.reject(res);
  }
);

// 取消请求列表
const cancelSourceList = [];

// 默认一页10条数据
export const ITEMS_PER_PAGE = 10;

// 取消所有请求
export function cancelAllRequest(reason) {
  for (const _cancelSource of cancelSourceList) {
    // 特权请求不取消，例如获取用户信息等
    if (!_cancelSource.keepWhenNavigate) {
      _cancelSource.cancel(reason);
    }
  }
}

// 添加请求取消
function pushCancelSource(_cancelSource) {
  cancelSourceList.push(_cancelSource);
}

// 移除请求取消
function removeCancelSource(_cancelSource) {
  if (_cancelSource) {
    const index = cancelSourceList.indexOf(_cancelSource);
    cancelSourceList.splice(index, 1);
  }
}

// 统一封装请求接口
// keepWhenNavigate 路由跳转时是否保留而不取消
export async function request(method, url, paramsOrData, ext = {}) {
  // console.log(ext)
  const source = CancelToken.source();
  const { keepWhenNavigate, bodyParams } = Object.assign(
    {
      keepWhenNavigate: false,
      bodyParams: {},
    },
    ext
  );
  source.keepWhenNavigate = keepWhenNavigate;
  pushCancelSource(source);
  let ret;
  if (["post", "put", "patch"].includes(method)) {
    ret = await instance[method](url, paramsOrData, {
      cancelToken: source.token,
      params: bodyParams,
      responseType: ext.responseType || "json",
      timeout: ext.timeout || 30000,
    });
  } else {
    ret = await instance[method](url, {
      cancelToken: source.token,
      params: paramsOrData,
      responseType: ext.responseType || "json",
      timeout: ext.timeout || 30000,
    });
  }
  removeCancelSource(source);
  return ret;
}

// api upload
export async function uploadFile(file, ext = {}, onProgress = () => {}) {
  const form = new FormData();
  form.append("file", file);
  const { error, data } = await instance.post("/common/upload", form, {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round(
        (progressEvent.loaded * 100) / progressEvent.total
      );
      onProgress(percentCompleted);
    },
  });
  return error ? {} : data;
}
