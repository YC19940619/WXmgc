//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
const app = getApp()
Page({
    data: {
        userInfo:{},
        scrollY:true,//滚动方向
        starX:0,//删除滑动初始
        list:[],//购物车数据
        Mwidth:150,//删除按钮的width
        imgH : 40,//详情图片的高度
        detailsTab:-1,//详情展开标识
        editdetele:true,//编辑删除标识
        checkedArr:[],//选中数组
        totalprice:'0.00',//总价格
        checked:false,//全选标
    },
    onLoad:function(){
        // let userInfo = app.globalData.userInfo;
        // console.log(userInfo)
        // if (userInfo) {
        //     this.setData({
        //         userInfo
        //     })
        // }
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
    check:function(e){//单选
        var index = e.currentTarget.dataset.index;
        var shopid = e.currentTarget.dataset.shopid;
        let totalprice = parseInt(this.data.totalprice);
        var checked;
        this.data.list[index].checked = !this.data.list[index].checked;
        if(this.data.list[index].checked){
            this.data.checkedArr.push(shopid);
        }else{
            var n = this.data.checkedArr.indexOf(shopid);
            this.data.checkedArr.splice(n,1)
        }

        if(this.data.checkedArr.length >= this.data.list.length){
            checked = true;
        }else{
            checked = false;
        }
        this.setData({
            list:this.data.list,
            checkedArr:this.data.checkedArr,
            checked
        })
        this.changeprice()//计算价格
    },
    checkall:function(e){//全选
        let checked = !this.data.checked;
        let list = this.data.list;
        let checkedArr = [];
        if(checked){
            list.forEach(function(value,index,arr){
                value.checked = true;//选中标志
                checkedArr.push(value.id)
            })
        }else{
            checkedArr = [];
            list.forEach(function(value,index,arr){
                value.checked = false;//选中标志
            })
        }
        this.setData({
            checked,
            checkedArr,
            list
        })
        this.changeprice()//计算价格
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
    editDetele:function(e){//编辑商品
        this.setData({
            editdetele:!this.data.editdetele
        })
    },
    delete:function(e){//删除操作
        let that = this;
        wx.showModal({
            title: '提示',
            content: '是否进行删除操作',
            success: function(res) {
                if (res.confirm) {
                    that.ajaxdelete(e.currentTarget.dataset.shopid.toString())
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })

    },
    deteleall:function(e){//批量删除操作
        let that = this;
        if(this.data.checkedArr.length > 0){
            wx.showModal({
                title: '提示',
                content: '是否进行删除操作',
                success: function(res) {
                    if (res.confirm) {
                        that.ajaxdelete(that.data.checkedArr.join(','))
                    } else if (res.cancel) {
                        console.log('用户点击取消')
                    }
                }
            })
        }else{
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
                duration: 2000
            })
        }
    },
    goorder:function(e){//批量下单操作
        if(this.data.checkedArr.length > 0){
            let shopids = `[${this.data.checkedArr.join(',')}]`;
            wx.navigateTo({
                url: `../../pages/firmorder/firmorder?cartitem_idarr=${shopids}`
            })
        }else{
            wx.showToast({
                title: '请选择商品',
                icon: 'none',
                duration: 2000
            })
        }
    },
    ajaxdelete:function(shopids){
        let that = this;
        shopids = shopids.split(',');
        wx.request({
            url: app.Interfaces.cart_drop,
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data:{
                uid:that.data.userInfo.uid,
                sessionid:that.data.userInfo.sessionid,
                cartitem_id: `[${shopids}]`
            },
            success: function (data) {
                data = data.data;
                let list = that.data.list;
                let checkedArr = that.data.checkedArr;
                if (data.status === 0){
                    wx.showToast({
                        title: '删除成功',
                        icon: 'none',
                        duration: 2000
                    })
                    shopids.forEach(function(shopid,n){
                        list.forEach(function(item,m){
                            if(shopid == item.id){
                                item.remove = true;
                                that.setData({
                                    list
                                })
                            }
                        })
                    })
                    setTimeout(function(){
                        shopids.forEach(function(shopid,n){
                            list = that.data.list;
                            checkedArr = that.data.checkedArr;
                            list.forEach(function(item,m){
                                if(shopid == item.id){
                                    list.splice(m,1);
                                    that.setData({
                                        list
                                    })
                                }
                            })
                            checkedArr.forEach(function(value,m){
                                if(shopid == value){
                                    checkedArr.splice(m,1);
                                    that.setData({
                                        checkedArr
                                    })
                                }
                            })
                        })
                        that.changeprice()
                    },1000)
                }else{
                    wx.showToast({
                        title: '删除失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            error: function () {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    jian:function(e){//修改数量
        var index = e.currentTarget.dataset.index;
        let shop_id = this.data.list[index].id;//id
        let quantity = this.data.list[index].quantity;//数量
        if(quantity <= 1){
            wx.showToast({
                title: '亲，不能再少啦！',
                icon: 'none',
                duration: 2000
            })
        }else{
           quantity--
           this.changenum(index,quantity,shop_id,false)
        }
    },
    jia:function(e){
        let index = e.currentTarget.dataset.index;
        let shop_id = this.data.list[index].id;//id
        let quantity = this.data.list[index].quantity;//数量
        let stocks = this.data.list[index].stocks;//库存
        if(quantity >= stocks){
            wx.showToast({
                title: '亲，库存不够啦！',
                icon: 'none',
                duration: 2000
            })
        }else{
            quantity++
            this.changenum(index,quantity,shop_id,true)
        }
    },
    changenum:function(index,quantity,shop_id,type){
        var that = this;
        wx.request({
            url: app.Interfaces.cart_change,
            method: "POST",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            data:{
                uid:that.data.userInfo.uid,
                sessionid:that.data.userInfo.sessionid,
                cartitem_id: shop_id,
                quantity: quantity
            },
            success: function (data) {
                data = data.data;
                if (data.status === 0) {
                    that.data.list[index].quantity = quantity;
                    that.changeprice()//计算价格
                    that.setData({
                        list:that.data.list,
                        totalprice: parseInt(that.data.totalprice).toFixed(2)
                    })
                }else{
                    wx.showToast({
                        title: '修改失败',
                        icon: 'none',
                        duration: 2000
                    })
                }
            },
            error: function () {
                wx.showToast({
                    title: '网络错误',
                    icon: 'none',
                    duration: 2000
                })
            }
        })
    },
    changeprice:function(){
        let totalprice = 0;
        let checkedArr = this.data.checkedArr;
        let list = this.data.list;
        checkedArr.forEach(function(value,n){
            list.forEach(function(item,m){
                if(value == item.id){
                    totalprice += item.quantity*parseInt(item.sku.price)
                }
            })
        })
        this.setData({
            totalprice:totalprice.toFixed(2)
        })
    },
    getData: function () {//获取数据
        wx.showLoading({
            title:'加载中',
            mask:true
        })
        let that = this;
        wx.request({
            url: app.Interfaces.cart_display,
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
                let list = [];
                if(data.data.status === 0){
                    let statics = data.data.static.subattributes;//表情
                    data.data.data.forEach(function(value,index,array){
                        if(value.sku){
                            value.itemStyle = 0;//删除样式
                            value.remove = false;//删除标志
                            if(that.data.checkedArr.includes(value.id)){
                                value.checked = true;//选中标志
                            }else{
                                value.checked = false;//选中标志
                            }
                            value.stocks = 1000000000;//库存
                            value.sku.threedfileparams[0].params = encodeURI(value.sku.threedfileparams[0].params);
                            value.sku.threedfileparams[0].img = dataImg.addSrc(value.sku.threedfileparams[0].img);
                            var options = value.sku.attributes_values;
                            options.forEach(function(option,index,array){
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
                            list.push(value)
                        }
                    });
                }else{
                    list = []
                }
                console.log(list)
                that.setData({
                    list
                })
                wx.hideLoading()
                // console.log(that.data.list)
            }
        })
    },
    imgW:function(e){//设置图片width高
        var parentIndex = e.currentTarget.dataset.pidx;
        var childIndex =  e.currentTarget.dataset.load;
        let imgh = e.detail.height;
        let imgw = e.detail.width;
        let imgH = this.data.imgH;
        let imgW = (imgH/imgh)*imgw;
        let list = this.data.list;
        let obj = list[parentIndex].sku.attributes_values[childIndex];
        obj.imgH = imgH+'rpx';
        obj.imgW = imgW+'rpx';
        this.setData({
            list
        })
    },
    gohref:function(e){
        // wx.navigateTo({
        //     url: "../../pages/getphonenum/getphonenum"
        // })
    },
    gobuy:function(e){
        wx.navigateTo({
            url: "../../pages/made/made"
        })
    },
    touchStart:function(e){
        if(e.touches.length===1){
            this.setData({
                starX:e.touches[0].pageX
            })
        }
    },
    touchMove:function(e){
        var index = e.currentTarget.dataset.index;
        var X = e.touches[0].pageX;//滑动的位置
        var starX = this.data.starX;
        var changeX = starX - X;//位置差值
        var reX = this.data.Mwidth;//最大滑动差值==删除按钮的width
        var list = this.data.list;
        var marX = list[index].itemStyle;//整体滑动位置
        if (changeX > 0 && changeX <= reX && -marX <reX) {//左滑
            list[index].itemStyle =-changeX;
        } else if (changeX < 0 && parseInt(marX) < 0) {//右划
            list[index].itemStyle = -reX - changeX
        }
        this.setData({list})
    },
    touchEnd:function(e){
        var index = e.currentTarget.dataset.index;
        var endX = e.changedTouches[0].clientX;
        var starX = this.data.starX;
        var changeX = starX - endX;//初始位置和结束位置的差值
        var reX = this.data.Mwidth;//最大滑动差值==删除按钮的width
        var list = this.data.list;
        if (changeX > 0) {
            //if (changeX >= reX / 2) {//如果达到一半就全部显示
                list[index].itemStyle = -reX;
            // } else {//如果没有达到一半就不显示
            //     list[index].itemStyle = 0;
            // }
        } else if (changeX < 0) {
            //if (-changeX >= reX / 2) {//如果达到一半就全部显示
                list[index].itemStyle = 0;
            // } else {//如果没有达到一半就不显示
            //     list[index].itemStyle = -reX;
            // }
        }
        this.setData({list})
    }
})
