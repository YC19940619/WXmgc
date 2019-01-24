//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
import login from '../../common/js/logs.js'
const app = getApp()
Page({
    data: {
        appName:'',
        userInfo:{},
        currentTab:1,
        logo_image:`../../common/img/${app.globalData.logo}`,
        phone_num:'',
        verifica:'',
        disabled:false,
        color:'#fff',
        backgroundcolor:'#c88d6d',
        verificabtn:'发送验证码',
        time:60,
    },
    onShow: function () {
         let userInfo = app.globalData.userInfo;
         let appName = app.globalData.appName;
         this.setData({
             userInfo,
             appName
         })
    },
    toggleclass:function(res){
        this.setData({
            currentTab:res.currentTarget.dataset.currenttab
        })
    },
    inputphone:function(e){
        let phone_num = e.detail.value.replace(/\D/g, '');
        this.setData({
            phone_num
        })
    },
    inputverifica:function(e){
        let verifica = e.detail.value.replace(/\D/g, '');
        this.setData({
            verifica
        })
    },
    getphonenumber: function(){
        let phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        let phone_num = this.data.phone_num;
        let verifica = this.data.verifica;
        let that = this;
        if(!phonereg.test(phone_num)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none',
                duration: 2000
            })
        }else if(verifica.length<=0){
            wx.showToast({
                title: '请填写验证码',
                icon: 'none',
                duration: 2000
            })
        }else{
            wx.request({
                url:app.Interfaces.phone_num_binding,
                data:{
                    phone_num,
                    submit_vcode: verifica,
                    uid:that.data.userInfo.uid,
                    sessionid:that.data.userInfo.sessionid
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (data) {
                    data = data.data;
                    if (data.status === 0) {
                        app.globalData.userInfo.phone_num =  phone_num;
                        wx.showToast({
                            title: '绑定成功',
                            icon: 'none',
                            duration: 2000
                        })
                        setTimeout(function(){
                            wx.navigateBack({//返回上一页
                                delta: 1
                            })
                        },1000)
                    } else if(data.status === 20011) {
                        wx.showToast({
                            title: '验证码错误',
                            icon: 'none',
                            duration: 2000
                        })
                    }else if(data.status===20010){
                        wx.showToast({
                            title: '验证码过期',
                            icon: 'none',
                            duration: 2000
                        })
                    }else{
                        wx.showToast({
                            title: '绑定手机号失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
        }
    },
    sendVerification:function(){
        let phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        let phone_num = this.data.phone_num;
        let verifica = this.data.verifica;
        let that = this;
        if(!phonereg.test(phone_num)) {
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none',
                duration: 2000
            })
        }else{
            wx.request({
                url:app.Interfaces.phoneBindvcode,
                data:{
                    phone_num,
                    uid:that.data.userInfo.uid,
                    sessionid:that.data.userInfo.sessionid
                },
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (data) {
                    data = data.data;
                    if(data.status ===0){
                        that.verificaStatus();
                        wx.showToast({
                            title: '验证码已发送，请注意查收',
                            icon: 'none',
                            duration: 2000
                        })
                    }else if(data.status===20008){
                        wx.showToast({
                            title: '您的操作已达上线，请勿重复提交!',
                            icon: 'none',
                            duration: 2000
                        })
                    }else if(data.status===20007){
                        wx.showToast({
                            title: '操作过于频繁，请在60s之后重新获取验证码!',
                            icon: 'none',
                            duration: 2000
                        })
                    }else if(data.status===20105){
                        wx.showToast({
                            title: '此手机号已绑定，请勿重复绑定!',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                }
            })
        }
    },
    verificaStatus:function(){
        let that = this;
        let time = that.data.time;
        let verificabtn = `${time}s后再次发送`;
        let disabled= true;
        let backgroundcolor= '#888';
        that.setData({
            verificabtn,
            disabled,
            backgroundcolor
        })
        var setint = setInterval(function(){
            time --;
            if(time <= 0){
                verificabtn = '发送验证码';
                disabled = false;
                backgroundcolor = '#c88d6d';
                clearInterval(setint)
            }else{
                verificabtn =`${time}s后再次发送`;
                disabled = true;
                backgroundcolor = '#888';
            }
            that.setData({
                verificabtn,
                disabled,
                backgroundcolor
            })
        },1000)
    }
})
