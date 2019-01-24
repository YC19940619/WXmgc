//index.js
//获取应用实例
import getUserInfo from '../../common/js/logs.js'
const app = getApp()
Page({
  data: {
    logo_image:`../../common/img/${app.globalData.logo}`
  },
  getuserinfo: function (res) {
      console.log(res)
      if(res.detail.errMsg === 'getUserInfo:ok'){
          getUserInfo.getUserInfo(function(){
              wx.switchTab({
                  url: "../../pages/index/index"
              })
              // wx.redirectTo({//关闭当前页面 跳转到应用内的页面
              //     url: "../../pages/getphonenum/getphonenum"
              // })
          })
      }else{
          wx.switchTab({
              url: "../../pages/index/index"
          })
      }
  }
})
