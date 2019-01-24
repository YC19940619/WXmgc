
Page({
    data: { // 参与页面渲染的数据
        spuid: null,
        uid:null,
        sessionid:null
    },
    onLoad: function (options) {
        console.log(options)
        let spuid = options.spuid;
        let uid = options.uid;
        let sessionid = options.sessionid;
        this.setData({
            spuid,
            uid,
            sessionid
        })
    }
})
