//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
import wxpay from '../../common/js/wxpay.js'
import util from "../../common/js/util";
const app = getApp()
Page({
    data: {
        userInfo:{},
        address:null,
        cartitem_ids:null,
        order_serial_number:null,
        totalPrice:0,
        imgH : 40,//详情图片的高度
        list:[],
        detailsTab:0,
        coupon:{},
        needpay:0
    },
    onLoad: function (options) {
        this.setData({
            cartitem_ids:options.cartitem_idarr
        })
    },
    onShow: function () {
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
        this.getAddress();//获取收货地址
        this.getData();//获取订单信息
        let pages = getCurrentPages();
        let nowpage = pages[pages.length-1];
        this.setData({
            coupon:nowpage.data.coupon
        })
    },
    imgW:function(e){//设置图片width高
        var parent_index = e.currentTarget.dataset.parent_index;
        var child_index =  e.currentTarget.dataset.child_index;
        let imgh = e.detail.height;
        let imgw = e.detail.width;
        let imgH = this.data.imgH;
        let imgW = (imgH/imgh)*imgw;
        let list = this.data.list;
        let obj = list[parent_index].sku.attributes_values[child_index];
        obj.imgH = imgH+'rpx';
        obj.imgW = imgW+'rpx';
        this.setData({
            list
        })
    },
    goAddress: function(){
        wx.navigateTo({
            url:'../../pages/addresslist/addresslist'
        })
    },
    details:function(e){//点击详情
        console.log(e)
        var detailsTab = e.currentTarget.dataset.index;
        if(detailsTab === this.data.detailsTab){
            detailsTab = -1
        }
        this.setData({
            detailsTab
        })
    },
    getAddress: function(){
        if(wx.getStorageSync('address')){//如果本地缓存地址存在
            let address = JSON.parse(wx.getStorageSync('address'))
            this.setData({
                address
            })
        }else{

        }
    },
    getcoupon:function(){
        let that = this;
        wx.request({
            url: app.Interfaces.coupon,
            data:{
                head_office_id:app.globalData.head_office_id,
                user_phone:app.globalData.userInfo.phone_num,
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                if(data.data.error_code == 0){
                    let couponlist = [];
                    data.data.result.forEach(function(item){
                        item.end_time = util.formatTime(new Date(item.end_time)).split(' ')[0];
                        item.start_time = util.formatTime(new Date(item.start_time)).split(' ')[0];
                        if(parseInt(that.data.totalPrice) <= parseInt(item.reduce_limit)){
                            couponlist.push(item)
                        }
                    });
                    that.setData({
                        couponlist
                    })
                }
            }
        })
    },
    changecoupon:function(e){
        let that =this;
        if(app.globalData.userInfo.phone_num){//如果手机号存在
            wx.navigateTo({
                url: `../../pages/coupon/coupon?price=${that.data.totalPrice}`
            })
        }else{
            wx.showModal({
                title: '提示',
                content: '绑定手机号可查看优惠券，是否前去绑定？',
                success: function(res) {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '../../pages/getphonenum/getphonenum'
                        })
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }

    },
    goorder: function(){//生成订单和支付
        if(this.data.address){
            wx.showLoading({
                title:'加载中',
                mask:true
            })
            let that = this ;
            let data = {
                uid: that.data.userInfo.uid,
                sessionid: that.data.userInfo.sessionid,
                cartitem_id:that.data.cartitem_ids,
                shippingaddress_id:that.data.address.id
            }
            if(that.data.coupon.user_coupon_id){
                data.coupon_id = that.data.coupon.user_coupon_id;
            }
            wx.request({
                url: app.Interfaces.addorder,
                data: data,
                method: "POST",
                header: {
                    "content-type": "application/x-www-form-urlencoded"
                },
                success: function (data) {
                    if(data.data.status == 0){
                        wxpay.gopay(data.data.data.order_serial_number,function(order_serial_number){
                            wx.navigateTo({
                                url: `../../pages/orderdetails/orderdetails?order_serial_number=${order_serial_number}`
                            })
                        },function (order_serial_number) {
                            wx.navigateTo({
                                url: `../../pages/orderdetails/orderdetails?order_serial_number=${order_serial_number}`
                            })
                        });
                        wx.hideLoading();
                    }else{
                        wx.hideLoading()
                        wx.showToast({
                            title: '生成订单失败',
                            icon: 'none',
                            duration: 2000
                        })
                    }

                }
            })
        }else{
            wx.showToast({
                title: '请选择收货地址',
                icon: 'none',
                duration: 2000
            })
        }
    },
    getData: function(){
        let that = this;
        wx.request({
            url: app.Interfaces.confirm_order,
            data: {
                uid: that.data.userInfo.uid,
                sessionid: that.data.userInfo.sessionid,
                cartitem_id:that.data.cartitem_ids
            },
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (data) {
                let list = data.data.data;
                let statics = data.data.static.subattributes;//表情
                let totalPrice = that.data.totalPrice;
                let needpay = that.data.needpay;
                list.forEach(function(item,index){
                    let quantity = item.quantity;
                    let price = item.sku.price;
                    totalPrice += quantity*price;
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
                let reduce_price = 0;
                if(that.data.coupon.reduce_price){
                    reduce_price = that.data.coupon.reduce_price
                }
                needpay = parseInt(totalPrice) - parseInt(reduce_price);
                console.log(needpay)
                that.setData({
                    totalPrice:parseInt(totalPrice).toFixed(2),
                    needpay:needpay.toFixed(2),
                    list
                });
                // that.getcoupon();//获取优惠卷信息
            }
        })
    }
})
