import dataImg from "./dataImg";

const app = getApp();
const getUserInfo = function (successcallback) {//判断用户是否授权
  wx.getUserInfo({
    withCredentials: true,
    success: res => {
      // 可以将 res 发送给后台解码出 unionI
      wx.request({
        url: getApp().Interfaces.data_decrypt,
        data: {
          encrypted_data: res.encryptedData,
          iv: res.iv,
          session_key: wx.getStorageSync('session_key'),
          rawdata: res.rawData,
          signature: res.signature
        },
        method: "GET",
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          // console.log(res)
          if(res.statusCode === 200 && res.data.status === 0){
              let userInfo = res.data.data;
              if (userInfo) {
                  userInfo.head_image = dataImg.addSrc(userInfo.head_image)
                  getApp().globalData.userInfo =  userInfo;
              }
              if(successcallback){
                  successcallback()
              }
          }else{
              wx.showToast({
                  title: '信息获取失败',
                  icon: 'none',
                  duration: 2000
              })
          }
        },
        fail: function () {
          wx.showToast({
            title: '网络错误',
            icon: 'none',
            duration: 2000
          })
        }
      })
    },
    fail: res => {
      wx.showModal({
        title: '警告',
        content: '您尚未进行登录授权，是否前往登录授权页面',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.navigateTo({
              url: '../../pages/guide/guide',
            })
          }
        }
      })
    }
  })
}
const wxlogin = function(){
    wx.login({//获取session_key
        success: function (res) {
            if (res.code) {
                wx.request({
                    url: getApp().Interfaces.jscode_session,
                    data: {
                        code: res.code
                    },
                    method: "GET",
                    header: {
                        'content-type': 'application/json'
                    },
                    success: function (res) {
                        // console.log(res)
                        wx.setStorageSync('session_key', res.data.session_key);
                        wx.setStorageSync('openid', res.data.openid);
                        getUserInfo()
                    },
                    fail:function(){
                        wx.showToast({
                            title: '网络错误',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            }
        }
    });
}
export default {
  getUserInfo,
  wxlogin
}
