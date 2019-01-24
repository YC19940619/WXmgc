import dataImg from "../../common/js/dataImg";
const app = getApp()
Page({
    data: { // 参与页面渲染的数据
        userInfo:{},
        addresslist: []
    },
    onShow: function(){
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
        this.getData()
    },
    changeAddress: function(e){
        let address = this.data.addresslist[e.currentTarget.dataset.index];
        wx.setStorageSync('address', JSON.stringify(address));//存儲收貨地址
        wx.navigateBack({//返回上一页
            delta: 1
        })
    },
    gomanage: function(e){
        wx.navigateTo({
            url: "../../pages/manageaddress/manageaddress"
        })
    },
    getData: function(){
        let that = this;
        wx.request({
            url: app.Interfaces.addressSearch,
            data: {
                uid: app.globalData.userInfo.uid,
                sessionid: app.globalData.userInfo.sessionid,
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                console.log(data)
                that.setData({
                    addresslist:data.data.sa_list//获取收货地址
                })
            }
        })
    }
})
