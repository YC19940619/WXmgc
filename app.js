//app.js
import login from 'common/js/logs.js'
let domainL = "https://api.lovecantouch.com";
// let domainL = "http://apidev.lovecantouch.com";
// var domainL = "http://192.168.3.66:8000";
let domainLm = "http://www.lovecantouch.com/share/";
App({
  onLaunch: function (path){
      // wx.showLoading({
      //     title:'版本更新获取中',
      //     mask:true
      // });
      const updateManager = wx.getUpdateManager();//版本更新
      // updateManager.onCheckForUpdate(function (res) {
      //     // 请求完新版本信息的回调
      //     console.log(res.hasUpdate)
      //    // wx.hideLoading();
      // })
      updateManager.onUpdateReady(function () {
          wx.showModal({
              title: '更新提示',
              content: '新版本已经准备好，是否重启应用？',
              success: function (res) {
                  if (res.confirm) {
                      // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                      updateManager.applyUpdate()
                  }
              }
          })
      })
      // updateManager.onUpdateFailed(function () {
      //     // 新的版本下载失败
      // })
      // wx.checkSession({
      //     success: function(){
      //         //session_key 未过期，并且在本生命周期一直有效  直接获取用户信息
      //         login.getUserInfo(function(){
      //             // wx.switchTab({
      //             //     url: "../../pages/index/index"
      //             // })
      //         })
      //     },
      //     fail: function(){
      //         // session_key 已经失效，需要重新执行登录流程
              login.wxlogin()
      //     }
      // })
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
      userInfo: null,
      appName:'随我个性珠宝',
      logo:'login/logo.png',
      version:'1.0.5',
      companyName:'梦工场珠宝企业管理有限公司'
  },
  Interfaces: {
      domainL,
      domainLm,
      index_htnk: domainL + "/news/index/",//首页
      wechat_authorization: domainL + "/frontend/wechat_authorization",
      jscode_session: domainL + "/frontend/wechat/miniprogram/jscode/session",
      data_decrypt: domainL + "/frontend/wechat/miniprogram/data/decrypt",
      customproducts: domainL + "/shopping/customproducts",//定制商品
      series : domainL + "/series",//定制系列
      customproducts_search:domainL + '/customproducts/search?q=',
      cart_display: domainL + "/shopping/show/cart/",//查看购物车
      cart_change: domainL + "/shopping/change/cart/",//修改购物车数量
      cart_drop: domainL + "/shopping/drop/cart/",//删除购物车
      confirm_order: domainL + "/shopping/confirm/order/",//确认订单信息
      addressSearch: domainL + "/personal/sa_display",//收货地址列表
      addressDelete: domainL + "/personal/sa_drop",//删除收获地址
      addressUpdate: domainL + "/personal/sa_change",//编辑收获地址
      addressAdd: domainL + "/personal/sa_addition",//添加新收获地址
      addressDefault: domainL + "/personal/sa_default_address",//默认收货地址
      phoneBindvcode: domainL + "/personal/phone_num_binding_vcode",//绑定手机号发送验证码：
      phone_num_binding: domainL+ "/personal/phone_num_binding",//手机号绑定
      addorder: domainL + "/shopping/add/order/",//生成订单
      jsapi_prepay: domainL + "/order/wechatpay/jsapi/prepay",//支付
      orderlist: domainL + "/order/",//订单信息
      confirm_receipt: domainL + "/order/confirm/receipt/",//确认收货
      coupon:domainL+'/coupons'//优惠券
  }
})
