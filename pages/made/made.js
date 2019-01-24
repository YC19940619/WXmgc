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
    },
    custom:[
        {data_id:"10002",spuid:"10037",data_name:"项链",src:"../../common/img/custom/neck.png"},
        {data_id:"10003",spuid:"10042",data_name:"手链",src:"../../common/img/custom/brace.png"},
        {data_id:"10004",spuid:"10047",data_name:"戒指",src:"../../common/img/custom/ring.png"},
        // {data_id:"10008",data_name:"耳饰",src:"../../common/img/custom/ear.png"},
        // {data_id:"10003",data_name:"星牌",src:"../../common/img/custom/star.png"},
    ],
    userInfo:{},
    hasUserInfo:false,
  },
  onShow: function () {
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
    let url
    if(data_name === "星牌")
        url = `../customtion/customtion?spuid=${data_id}`
    else
        url = `../customlist/customlist?data_id=${data_id}&data_name=${data_name}`
      wx.navigateTo({
          url:url
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
        console.log(that.data.banner)
      }
    })
  }
})
