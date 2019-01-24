//index.js
//获取应用实例
import dataImg from "../../common/js/dataImg";

const app = getApp()
Page({
    data: {
        userInfo:{},
        index:0,
        orderlist:[
            {
                order_status:null,
                list:[]
            },{
                order_status:'0',
                list:[]
            },{
                order_status:'1',
                list:[]
            },{
                order_status:'2',
                list:[]
            },{
                order_status:'3',
                list:[]
            }
        ]

    },
    onShow: function () {
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
        this.getData(this.data.index)
    },
    togglenav:function(e){
        let index = e.currentTarget.dataset.index;
        this.setData({
            index
        })
    },
    toggleswiper:function(e){
        let index = e.detail.current;
        this.setData({
            index
        })
        this.getData(index)
    },
    orderdetails:function(e){
        let order_serial_number = e.currentTarget.dataset.order_serial_number;
        wx.navigateTo({
            url: `../../pages/orderdetails/orderdetails?order_serial_number=${order_serial_number}`
        })
    },
    getData:function(index){
        let that =this;
        let order_status = that.data.orderlist[index].order_status;
        let orderlist = that.data.orderlist;
        if(orderlist[index].list.length <= 0 ) {
            wx.showLoading({
                title: '订单加载中',
                mask: true
            })
        }
        //if(orderlist[index].list.length <= 0 ){
            let data = {
                uid: that.data.userInfo.uid,
                sessionid: that.data.userInfo.sessionid,
                content_type_id: 1
            }
            if(order_status){
                data.order_status = order_status
            }
            wx.request({
                url: app.Interfaces.orderlist,
                data:data,
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (data) {
                    if(data.data.status == 0){
                        let list = [];
                        data.data.data.forEach(function(item,index){
                            if(item.cartitem.length>0&&item.cartitem[0].sku){
                                item.cartitem[0].sku.threedfileparams[0].img = dataImg.addSrc(item.cartitem[0].sku.threedfileparams[0].img);
                                list.push(item)
                            }
                        });
                        orderlist[index].list = list;
                        that.setData({
                            orderlist
                        })
                    }else{
                        wx.showToast({
                            title: '订单查询失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }
                    wx.hideLoading()
                }
            })
        // }else{
        //     wx.hideLoading()
        // }
    }
})
