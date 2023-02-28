// wx-js-sdk授权 获取jssdk需要的签名等参数
import { getConfig } from '../api/common'

// api地址列表
// 必填，需要使用的JS接口列表 如果要做分享给好友和分享到朋友圈就写这两个
/**
 jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData',] 
 * 
 */

import { apiConfigList } from '../config/index'
import wx from 'weixin-js-sdk'

export default {
  async initConfig() {
    const dmap = {
      url: encodeURIComponent(window.location.href.split('#')[0])
    }
    let res = await getConfig(dmap)
    const { nonceStr, timestamp, signature } = res.data
    wx.config({
      debug: false,
      appId: process.env.VUE_APP_APPID,
      nonceStr: nonceStr,
      timestamp: timestamp,
      signature: signature,
      jsApiList: apiConfigList,
      openTagList: ['wx-open-launch-weapp']
    })
    wx.ready(function() {})
    wx.ready( () => {
      wx.updateAppMessageShareData({
        title: '答题领奖励，名额有限，先到先得哟', // 分享标题
        desc: '答题领奖励，名额有限，先到先得哟', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: process.env.VUE_APP_BASE_URL + '/red.jpg', // 分享图标
        success: function () {
          // 设置成功
        }
      })
      wx.updateTimelineShareData({
        title: '答题领奖励，名额有限，先到先得哟', // 分享标题
        desc: '答题领奖励，名额有限，先到先得哟', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: process.env.VUE_APP_BASE_URL + '/red.jpg', // 分享图标
        success: function () {
          // 设置成功
        }
      })
    })
  }
}