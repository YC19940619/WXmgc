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
    defaultaddress: function(e){
        let that = this;
        let address_id = e.currentTarget.dataset.address_id;
        let index = e.currentTarget.dataset.index;
        wx.request({
            url: app.Interfaces.addressDefault,
            data: {
                uid: app.globalData.userInfo.uid,
                sessionid: app.globalData.userInfo.sessionid,
                shipping_address_id:address_id
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                let addresslist = that.data.addresslist;
                addresslist.forEach(function(value,index){
                    value.is_default = false;
                })
                addresslist[index].is_default = true;
                that.setData({
                    addresslist
                })
            }
        })
    },
    editaddress: function(e){
        let address_id = e.currentTarget.dataset.address_id;
        wx.navigateTo({
            url: `../../pages/editaddress/editaddress?address_id=${address_id}`
        })
    },
    getData: function(){
        let that = this;
        wx.request({
            url: app.Interfaces.addressSearch,
            data: {
                uid: app.globalData.userInfo.uid,
                sessionid: app.globalData.userInfo.sessionid
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
