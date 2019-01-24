//index.js
//获取应用实例
import dataImg from "../../common/js/dataImg";
import wxpay from '../../common/js/wxpay.js'
const app = getApp()
Page({
    data: {
        userInfo:{},
        order_serial_number:null,
        order:{},
        sessionid:"kuqxq1bkmaa2gqjwwgw3chi8gsr7l53r",
        uid:"wMDkAXxW23JsHfPi7c",
        detailsTab:-1,
        imgH : 40,//详情图片的高度
    },
    onLoad: function(options){
        this.setData({
            order_serial_number:options.order_serial_number
        })
    },
    onShow: function () {
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
        this.getData();
    },
    details:function(e){//点击详情
        var detailsTab = e.currentTarget.dataset.index;
        if(detailsTab === this.data.detailsTab){
            detailsTab = -1
        }
        this.setData({
            detailsTab
        })
    },
    // onUnload: function () {
    //     wx.navigateBack({//返回上一页
    //         delta: 1
    //     })
    // },
    paynow:function(e){
        let that = this;
        wxpay.gopay(this.data.order_serial_number,function () {
            that.getData()
        },function () {
            that.getData()
        })
    },
    cancel:function(){//取消订单
        let that = this;
        this.operations(app.Interfaces.orderlist,'0','是否取消订单',function(){
            wx.showToast({
                title: '订单取消成功',
                icon: 'none',
                duration: 2000
            })
            that.getData()
        },function(){
            wx.showToast({
                title: '订单取消失败',
                icon: 'none',
                duration: 2000
            })
        })
    },
    delete:function(){//删除订单
        this.operations(app.Interfaces.orderlist,3,'是否删除订单',function(){
            wx.showToast({
                title: '订单删除成功',
                icon: 'none',
                duration: 2000
            })
            wx.navigateBack({//返回上一页
                delta: 1
            })
        },function(){
            wx.showToast({
                title: '订单删除失败',
                icon: 'none',
                duration: 2000
            })
        })
    },
    confirm:function(){//确认收货
        let that = this;
        this.operations(app.Interfaces.confirm_receipt,null,'是否确认收货',function(){
            wx.showToast({
                title: '确认收货成功',
                icon: 'none',
                duration: 2000
            })
            that.getData()
        },function(){
            wx.showToast({
                title: '确认收货失败',
                icon: 'none',
                duration: 2000
            })
        })
    },
    operations:function(url,content_type_id,title,successback,errorback){
        let that = this;
        let data = {
            uid:that.data.userInfo.uid,
            sessionid:that.data.userInfo.sessionid,
            order_serial_number:that.data.order_serial_number
        }
        if(content_type_id){
            data.content_type_id = content_type_id;
        }
        wx.showModal({
            title: '提示',
            content: title,
            success: function(res) {
                if (res.confirm) {
                    wx.request({
                        url,
                        data,
                        method: "POST",
                        header: {
                            "content-type": "application/x-www-form-urlencoded"
                        },
                        success: function (data) {
                            if(data.data.status == 0){
                                successback()
                            }else{
                                errorback()
                            }
                        },
                        fail:function (res) {
                            wx.showToast({
                                title: '网络加载失败',
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },
    imgW:function(e){//设置图片width高
        var parent_index = e.currentTarget.dataset.parent_index;
        var child_index =  e.currentTarget.dataset.child_index;
        let imgh = e.detail.height;
        let imgw = e.detail.width;
        let imgH = this.data.imgH;
        let imgW = (imgH/imgh)*imgw;
        let order = this.data.order;
        let list = order.cartitem;
        let obj = list[parent_index].sku.attributes_values[child_index];
        obj.imgH = imgH+'rpx';
        obj.imgW = imgW+'rpx';
        this.setData({
            order
        })
    },
    getData: function () {
        wx.showLoading({
            title:'订单加载中',
            mask:true
        })
        let that =this;
        let order = this.data.order;
        wx.request({
            url: app.Interfaces.orderlist,
            data:{
                uid:that.data.userInfo.uid,
                sessionid:that.data.userInfo.sessionid,
                content_type_id:1,
                order_serial_number:that.data.order_serial_number
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                if(data.data.status == 0){
                    let order = data.data.data[0];
                    let statics = data.data.static.subattributes;//表情
                    order.cartitem.forEach(function(item,index){
                        item.sku.threedfileparams[0].params = encodeURI(item.sku.threedfileparams[0].params);
                        item.sku.threedfileparams[0].img = dataImg.addSrc(item.sku.threedfileparams[0].img);
                        let options = item.sku.attributes_values;
                        options.forEach(function(option,index,array){
                            var _value;
                            if(option.attribute.name==='定制内容'){
                                let textname = option.manually_attribute_value.name;
                                let left = new RegExp("\\[", "g");
                                let right = new RegExp("]", "g");
                                textname = textname.replace(left,",").replace(right,",").split(",");
                                textname.forEach(function(value,index){
                                    for (var n =0;n<statics.length;n++) {//表情转换
                                        for (var m = 0; m < statics[n].values.length; m++) {
                                            let item = dataImg.addSrc(statics[n].values[m].img)
                                            let num = statics[n].values[m].webgl_num;
                                            if(value == num){
                                                textname[index] = item
                                            }
                                        }
                                    }
                                })
                                for(var i=0;i<textname.length;i++){
                                    textname[i] =  {
                                        door:textname[i].includes('http'),
                                        name:textname[i]
                                    }
                                }
                                option.manually_attribute_value.name = textname;
                            }else{
                                if(option.attribute_value){
                                    if(option.attribute_value.img){
                                        option.attribute_value.img = dataImg.addSrc(option.attribute_value.img);
                                    }
                                }else{
                                    if( option.manually_attribute_value.img){
                                        option.manually_attribute_value = dataImg.addSrc(option.manually_attribute_value.img);
                                    }
                                }
                            }

                        });
                    });
                    that.setData({
                        order
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
    }
})
