//index.js
//获取应用实例
import dataImg from "../../common/js/dataImg";
import util from "../../common/js/util";
const app = getApp()
Page({
  data: {
      avaliablelist:[],
      usedlist:[],
      timeoutlist:[],
      price:null,
      index:0
  },
  onLoad:function(options){
      if(options.price){
          this.setData({
              price:options.price
          })
      }
  },
  onShow:function(){
      this.getData();
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
    },
  gouse:function(e){
      let usestatus = e.currentTarget.dataset.usestatus;
      let index = e.currentTarget.dataset.index;
      if(this.data.price){
          if(usestatus){
              let pages = getCurrentPages();
              let pervpage = pages[pages.length-2];
              pervpage.setData({
                  coupon:this.data.avaliablelist[index]
              })
              wx.navigateBack({//返回上一页
                  delta: 1
              })
          }
      }else{
          wx.navigateTo({
              url: '../made/made'
          })
      }
  },
  getData:function(){
      let that =this;
      wx.showLoading({
          title: '优惠券获取中...',
          mask: true
      });
      wx.request({
          url: app.Interfaces.coupon,
          data:{
              uid:app.globalData.userInfo.uid,
              sessionid:app.globalData.userInfo.sessionid,
              user_phone:app.globalData.userInfo.phone_num,
          },
          method: "GET",
          header: {
              "content-type": "application/x-www-form-urlencoded"
          },
          success: function (data) {
              if(data.data.status == 0){
                  let avaliablelist = [];
                  let usedlist  =[];
                  let timeoutlist = [];
                data.data.data.forEach(function(item,index){
                    item.end_time = util.formatTime(new Date(item.end_time)).split(' ')[0];
                    item.start_time = util.formatTime(new Date(item.start_time)).split(' ')[0];
                    item.usestatus = true;
                    if(that.data.price && parseInt(that.data.price) < parseInt(item.reduce_limit)){
                        item.usestatus=false;
                    }
                    if(item.state === 'avaliable'){
                        avaliablelist.push(item)
                    }else if(item.state === 'used'){
                        item.usestatus=false;
                        usedlist.push(item)
                    }else if(item.state === 'timeout'){
                        item.usestatus=false;
                        timeoutlist.push(item)
                    }
                });
                that.setData({
                    avaliablelist,
                    usedlist,
                    timeoutlist
                })
              }
              wx.hideLoading()
          },
          fail:function(){
              wx.showToast({
                  title: '网络错误',
                  icon: 'none',
                  duration: 2000
              })
              wx.hideLoading()
          }
      })
  }
})
