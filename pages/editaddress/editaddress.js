import dataImg from "../../common/js/dataImg";
const app = getApp()
Page({
    data: { // 参与页面渲染的数据
        receiver:'',
        phone_number:'',
        region:[],
        address_details:'',
        title:['新增收货地址','编辑收货地址'],
        address_id:null,
    },
    onLoad: function(options){
        if(options.address_id && options.address_id != 'undefined'){//保存地址ID
            this.setData({
                address_id:options.address_id
            })
            wx.setNavigationBarTitle({//编辑收货地址
                title: this.data.title[1]
            })
        }else{
            wx.setNavigationBarTitle({
                title: this.data.title[0]//添加收货地址
            })
        }
    },
    onShow: function(){
        if(this.data.address_id){
            this.getData()
        }
    },
    getReceiver:function (e) {
        this.setData({
            receiver:e.detail.value
        })
    },
    getPhone:function (e) {
        this.setData({
            phone_number:e.detail.value
        })
    },
    bindRegionChange:function(e){
        this.setData({
            region:e.detail.value
        })
    },
    getAddressdetails:function (e) {
        this.setData({
            address_details:e.detail.value
        })
    },
    getData:function(){
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
                let list = data.data.sa_list;
                console.log(list)
                list.forEach(function(item,index){
                    if(that.data.address_id == item.id){
                        that.setData({
                            receiver:item.receiver,
                            phone_number:item.phone_num,
                            region:item.province.split("-"),
                            address_details:item.detail_address
                        })
                    }
                })
            }
        })
    },
    saveaddress:function () {
        let phonereg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
        if(this.data.receiver.length<=0){
            wx.showToast({
                title: '请填写收货人姓名',
                icon: 'none',
                duration: 2000
            })
        }else if(!phonereg.test(this.data.phone_number)){
            wx.showToast({
                title: '请填写正确的手机号码',
                icon: 'none',
                duration: 2000
            })
        }else if(this.data.region.length<=0){
            wx.showToast({
                title: '请选择所在地区',
                icon: 'none',
                duration: 2000
            })
        }else if(this.data.address_details.length<=0){
            wx.showToast({
                title: '请填写详细地址',
                icon: 'none',
                duration: 2000
            })
        }else{
            let that = this;
            let data = {
                uid: app.globalData.userInfo.uid,
                sessionid: app.globalData.userInfo.sessionid,
                receiver: this.data.receiver,
                phone_num: this.data.phone_number,
                province: this.data.region,
                detail_address: this.data.address_details
            };
            let url;
            if(this.data.address_id ){//编辑收货地址
                data.shipping_address_id = that.data.address_id;
                url = app.Interfaces.addressUpdate
            }else{//新增收货地址
                url = app.Interfaces.addressAdd
            }
            this.ajaxaddress(data,url)
        }
    },
    ajaxaddress:function(data,url){
        wx.request({
            url,
            data,
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                if(data.data.status === 0){
                    wx.navigateBack({//返回上一页
                        delta: 1
                    })
                }else{
                    wx.showToast({
                        title: '地址录入失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            }
        })
    }
})
