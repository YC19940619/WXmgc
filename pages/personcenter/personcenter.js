//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
import login from "../../common/js/logs";
const app = getApp()
Page({
    data: {
        userInfo:{},
        hasUserInfo:false,
        personbj_url:'../../common/img/personcenter/personbj.png'
    },
    onShow: function () {
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
    },
    bindViewTap: function(){
        // wx.openSetting({
        //     success: (res) => {
        //         res.authSetting = {
        //             "scope.userInfo": false,
        //             "scope.userLocation": true
        //         }
        //     }
        // })
    },
    gohref:function(e){
        console.log(e)
        var name = e.currentTarget.dataset.name;
        login.getUserInfo(function(){
            wx.navigateTo({
                url: `../../pages/${name}/${name}`
            })
        })
    },
    gocoupon:function(){
        let that = this;
        login.getUserInfo(function(){
            if(that.data.userInfo.phone_num.length>0){
                wx.navigateTo({
                    url: '../../pages/coupon/coupon'
                })
            }else{
                wx.showToast({
                    title: '绑定手机号才能查看优惠券哦！',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    }
})
