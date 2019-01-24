import dataImg from "../../common/js/dataImg";
const app = getApp()
Page({
    data: { // 参与页面渲染的数据
      items: [],
      limits:[10037,10042,10047],
      userInfo:{},
      category_id:null,
      series_id:null,
      page:1
    },
    onLoad: function (options) {
        // let category_id = options.data_id;
        // this.setData({
        //     category_id
        // })
        this.getData()
    },
    onShow: function(){
        let userInfo = app.globalData.userInfo;
        if (userInfo) {
            this.setData({
                userInfo
            })
        }
    },
    onPullDownRefresh:function(){
        console.log('下啦')
    },
    onReachBottom:function(){
        let page = this.data.page;
        page++;
        this.setData({
            page
        })
        this.getData()
        console.log('上啦')
    },
    goHref: function(e){
        let spuid = e.currentTarget.dataset.spuid;
        let uid = this.data.userInfo.uid;
        let sessionid = this.data.userInfo.sessionid;
        console.log(uid)
        wx.navigateTo({
            url: `../customtion/customtion?spuid=${spuid}&uid=${uid}&sessionid=${sessionid}`
        })
    },
    getData: function () {
        let that = this;
        let q = this.data.limits.join(',');
        wx.request({
            url: app.Interfaces.customproducts_search+q,
            data: {
                // series_id:10000,
                // page:that.data.page
            },
            method: "GET",
            header: {
                "content-type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
                console.log(res)
                let items = that.data.items;
                res.data.data.forEach(function(item, index){
                    item.img = dataImg.addSrc(item.img);
                    item.name = item.name.split('-')[1];
                    if(that.data.limits.includes(item.id)){
                        items.push(item)
                    }
                })
                that.setData({
                    items
                })
            }
        })
    }
})
