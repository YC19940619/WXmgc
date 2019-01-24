//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
import login from '../../common/js/logs.js'
// import bluetooth from '../../common/js/bluetooth.js'
const app = getApp()
Page({
  data: {
    banner:{
      swiperH:500+'rpx',
      lazyLoad: true,
      indicatorDots: true,
      indicatorColor:"#fff",
      indicatorActiveColor:"#c88d6d",
      autoplay:true,
      interval:3000,
      carousel_pictures: []
    }
  },
  onShow: function () {
      wx.showShareMenu({
          withShareTicket: true
      })
      // new bluetooth()
      this.getData()
  },
  imgH: function (e) {
    let winWid = wx.getSystemInfoSync().windowWidth;
    let imgh = e.detail.height;
    let imgw = e.detail.width;
    this.data.banner.swiperH = winWid * imgh / imgw + "px";
    this.setData({
      banner: this.data.banner
    })
  },
  goHref: function(e){
    let data_name = e.target.dataset.data_name;
    let data_id = e.target.dataset.data_id;
    wx.navigateTo({
        url: `../customlist/customlist?data_id=${data_id}&data_name=${data_name}`
    })
  },
  goMade:function(){
      login.getUserInfo(function(){
          wx.navigateTo({
              url: `../customlist/customlist?series_id=10000`
          })
          // wx.navigateTo({
          //     url: '../made/made'
          // })
      })
  },
  getData: function () {
    let that = this;
    wx.request({
      url: app.Interfaces.index_htnk,
      data: {},
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        let data = res.data;
        data.data.carousel_pictures.forEach(function (item, index){
          item.medium_picture = dataImg.addSrc(item.medium_picture)
        })
        that.data.banner.carousel_pictures = data.data.carousel_pictures
        that.setData({
          banner: that.data.banner
        })
      }
    })
  }
})
