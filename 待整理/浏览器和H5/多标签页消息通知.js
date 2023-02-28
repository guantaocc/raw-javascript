// stale-session.js

// 展示标签如果在其他标签页登录
// 如果浏览器不支持 BroadcaseChannel, 则 logged-in localstorage将会被使用
// On browsers that don't support BroadcastChannel, the `logged-in`
// localStorage key is used to send messages between tabs.

/**
 * 
 * @param {String} loggedIn 'true' or 'false'
 */
function sessionChanged(loggedIn) {
  console.log('其他页面登录', loggedIn)
}

let bc

if (typeof BroadcastChannel === 'function') {
  try {
    bc = new BroadcastChannel('stale-session')
    bc.onmessage = event => {
      if(typeof event.data === 'string') sessionChanged(event.data)
    }
  } catch {
    // ignore
  }
}

if (!bc) {
  // polyfill bc
  let postingMessage = false
  // postMessage is BroadcastChannel api to send message
  bc = {
    postMessage(message) {
    postingMessage = true
      try {
        window.localStorage.setItem('logged-in', message)
      } finally {
        postingMessage = false
      }
    }
  }
  // 在发送消息时候 判断
  window.addEventListener('storage', function (event) {
    if (!postingMessage && event.storageArea === window.localStorage && event.key === 'logged-in') {
      try {
        if (event.newValue === 'true' || event.newValue === 'false') {
          // 触发change 事件
          sessionChanged(event.newValue)
        }
      } finally {
        // 移除
        this.window.localStorage.removeItem(event.key)
      }
    }
  })
}

// 登录或退出登录 则 postMessage 到其他的标签页