//index.js
//获取应用实例
import dataImg from '../../common/js/dataImg.js'
const app = getApp()
Page({
  data: {
    banner:{
      swiperH:500+'rpx',
      lazyLoad: true,
      indicatorDots: true,
      indicatorColor:"#fff",
      indicatorActiveColor:"#000",
      autoplay:true,
      interval:3000,
      carousel_pictures: []
    }
  },
  onLoad: function () {
    this.getData()
  },
  onShow: function () {},
  imgH: function (e) {
    var winWid = wx.getSystemInfoSync().windowWidth;
    var imgh = e.detail.height;
    var imgw = e.detail.width;
    var swiperH = winWid * imgh / imgw + "px";
    this.data.banner.swiperH = swiperH
    this.setData({
      banner: this.data.banner
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
        console.log(data)
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