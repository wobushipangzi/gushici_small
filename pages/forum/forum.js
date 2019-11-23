//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    userInfo: {},
    isShow: false,
    tuijian: null,
    lastSuibiId: null
  },
  onLoad: function() {
    console.log(app.globalData.userInfo)
    var that = this;
    wx.getSetting({
      success(data) {
        if (data.authSetting['scope.userInfo']) {
          //用户已经授权
          that.setData({
            'isShow': false
          })
        } else {
          //没有授权
          that.setData({
            'isShow': true
          })
        }
      }
    })



    wx.request({
      url: 'https://www.xinhuo.fun/forum/getRecommend',
      data: {
        "lastSuibiId": null
      },
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data)
        if(res.data.code === 999){
          wx.showToast({
            title: '系统错误',
          })
          return false
        }
        wx.showLoading({
          title: '努力加载中',
        })
        that.setData({
          'tuijian': res.data.data,
          'lastSuibiId': res.data.data[res.data.data.length - 1].suibiId
        })
        wx.hideLoading();
      }
    })
  },
  getUserInfo: function(e) {

    app.globalData.userInfo = e.detail.userInfo
    console.log(app.globalData.userInfo)
    this.setData({
      userInfo: e.detail.userInfo
    })
    let that = this;
    wx.getSetting({
      success(data) {
        if (data.authSetting['scope.userInfo']) {
          //用户已经授权
          that.setData({
            'isShow': false
          })
          //假如授权成功 将用户信息传给古诗词服务器
          //获取本地存储的sessionKey
          console.log(e.detail.encryptedData)
          let sessionKey = wx.getStorageSync('sessionKey');
          console.log(wx.getStorageSync('sessionKey'))
          wx.request({
            url: 'https://www.xinhuo.fun/user/getUserInfo',
            data: {
              'encryptedData': e.detail.encryptedData,
              'sessionKey': sessionKey,
              'iv': e.detail.iv
            },
            method: 'post',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success(res) {
              console.log(res.data)
            }
          })
        } else {
          //没有授权
          that.setData({
            'isShow': true
          })
          wx.showModal({
            title: '警告',
            content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。'

          })
        }
      }
    })

  },
  // 下拉刷新
  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'https://www.xinhuo.fun/forum/getRecommend',
      data: {
        "lastSuibiId": null
      },
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        that.setData({
          'tuijian': res.data.data,
          'lastSuibiId': res.data.data[res.data.data.length - 1].suibiId
        })
        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    })
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var that = this;
    console.log(that.data.lastSuibiId)
    // 显示加载图标
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: 'https://www.xinhuo.fun/forum/getRecommend',
      data: {
        "lastSuibiId": that.data.lastSuibiId
      },
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log(res.data.data.length)
        if (res.data.data != 0) {
          // 回调函数
          const oldData = that.data.tuijian;
          that.setData({
            'tuijian': oldData.concat(res.data.data),
            'lastSuibiId': res.data.data[res.data.data.length - 1].suibiId
          })
          console.log(that.data.tuijian)
          wx.hideLoading();
        } else {
          console.log(1111111111)
          // 隐藏加载框
          wx.hideLoading();
          wx.showToast({
            title: '我也是有底线的'
          })
        }


      }
    })

  },

  imgYu: function (event) {
    var src = event.currentTarget.dataset.src;//获取data-src
    var imgListId = event.currentTarget.dataset.id;//获取data-list
    var imgList = [];
    //图片预览
    this.data.tuijian.forEach((v,k)=>{
      if (v.suibiId == imgListId){
          imgList = v.imgList
      }
    })
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
  }
})