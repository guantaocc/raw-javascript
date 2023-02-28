//获取地址栏参数
function GetURL(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

//获取url中code参数
let code = GetURL('code');

//如果没有code，转跳到授权页进行授权
if(!code){
    let url = window.location.href;
    let appid = 'abckdeh129292'; //公众号appid，在微信公众号后台中可以查看
    window.location.href = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid='+appid+'&redirect_uri=' + url + '&response_type=code&scope=snsapi_base&state=123#wechat_redirect';
}

//如果有code
$.ajax({
  url: "https://test.abcd.com/api/WXUserInfo",
  data: { code,},
  type: "get",
  dataType: "json",
  success: function (res) {
      //code可用，拿到用户信息
      if (res.status) {  
          userInfo = res.data;
      }else{
      //code过期，需要重新授权
      window.location.href = 'http://test.abcd.com/juejin/index.html'
  }
})