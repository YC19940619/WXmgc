//app.js
var domainL = "https://api.lovecantouch.com";
var domainLm = "http://www.lovecantouch.com/share/";
//var domainL = "http://192.168.3.66:8000";
App({
  onLaunch: function (path){
    console.log("监听小程序初始化")
    let that = this;
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          //发起网络请求
          wx.request({
            url:"https://api.weixin.qq.com/sns/jscode2session",
            data:{
              appid:"wx432e28cb7b1a5037",
              secret:"cf2ceb4608419e2403a92a6db9cb3da0",
              js_code: res.code,
              grant_type:"authorization_code"
            },
            method: "GET",
            header: {
              'content-type': 'application/json'
            },
            success: function (res) {
              console.log(res.data)
            }
            // url: that.Interfaces.wechat_authorization,
            // data: {
            //   submit_code: res.code
            // },
            // method: "GET",
            // header: {
            //   'content-type': 'application/json'
            // },
            // success: function (res) {
            //   console.log(res.data)
            // }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    });
  },
  onShow:function(){
    console.log("监听小程序显示")
  },
  onHide:function () {
    console.log("监听小程序隐藏")
  },
  onError: function () {
    console.log("错误监听函数")
  },
  onPageNotFound: function () {
    console.log("页面不存在监听函数")
  },
  globalData: {
    userInfo: null
  },
  Interfaces: {
    domainL,
    domainLm,
    index_htnk: domainL + "/news/index/",
    wechat_authorization: domainL + "/frontend/wechat_authorization"
  }
})

// App({
//   onLaunch: function () {
//     // 展示本地存储能力
//     var logs = wx.getStorageSync('logs') || []
//     logs.unshift(Date.now())
//     wx.setStorageSync('logs', logs)

//     // 登录
//     wx.login({
//       success: res => {
//         // 发送 res.code 到后台换取 openId, sessionKey, unionId
//       }
//     })
//     // 获取用户信息
//     wx.getSetting({
//       success: res => {
//         if (res.authSetting['scope.userInfo']) {
//           // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
//           wx.getUserInfo({
//             success: res => {
//               // 可以将 res 发送给后台解码出 unionId
//               this.globalData.userInfo = res.userInfo

//               // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
//               // 所以此处加入 callback 以防止这种情况
//               if (this.userInfoReadyCallback) {
//                 this.userInfoReadyCallback(res)
//               }
//             }
//           })
//         }
//       }
//     })
//   },
//   globalData: {
//     userInfo: null
//   }
// })