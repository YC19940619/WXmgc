const app = getApp();
const gopay = function(order_serial_number,success,error){//支付
    wx.request({
        url: app.Interfaces.jsapi_prepay,
        data: {
            uid: app.globalData.userInfo.uid,
            sessionid: app.globalData.userInfo.sessionid,
            openid:wx.getStorageSync('openid'),
            order_serial_number
        },
        method: "POST",
        header: {
            "content-type": "application/x-www-form-urlencoded"
        },
        success: function (data) {
            console.log(data)
            wx.requestPayment({
                'timeStamp': data.data.timeStamp,
                'nonceStr': data.data.nonceStr,
                'package': data.data.package,
                'signType': data.data.signType,
                'paySign': data.data.paySign,
                'success':function(res){
                    if(success){
                        success(order_serial_number)
                    }
                },
                'fail':function(res){
                    if(error){
                        error(order_serial_number)
                    }
                }
            })
        },
        fail:function(){
            wx.showToast({
                title: '支付失败！',
                icon: 'none',
                duration: 2000
            })
        }
    })
}
export default {
    gopay
}
