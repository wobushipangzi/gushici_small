// pages/library/library.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    'wenkuputong': null,
    'wenkuchaodai': null,
    'showfenlei': true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    // 获取普通分类接口
    wx.request({
      url: 'http://123.57.60.103:8081/product/getClassify',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data.data)
        wx.showLoading({
          title: '努力加载中',
        })
        that.setData({
          'wenkuputong': res.data.data
        })
        wx.hideLoading();
      }
    })
    // 获取朝代分类接口
    wx.request({
      url: 'http://123.57.60.103:8081/author/getClassify',
      method: 'post',
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        console.log(res.data.data)
        wx.showLoading({
          title: '努力加载中',
        })
        that.setData({
          'wenkuchaodai': res.data.data
        })
        wx.hideLoading();
      }
    })
  },
  //普通分类 朝代分类切换
  show_fenlei: function() {
    this.setData({
      'showfenlei': true
    })
  },
  show_chaodai: function() {
    this.setData({
      'showfenlei': false
    })
  },
  //跳转诗列表页面
  gopoetrylist: function(e) {
    let catlogTwoName = e.target.dataset.text.catlogTwoName;
    let catlogTwoId = e.target.dataset.text.catlogTwoId;
    wx.navigateTo({
      url: '/pages/library/library-list/library-list?catlogTwoName=' + catlogTwoName + '&catlogTwoId=' + catlogTwoId,
    })
  },
  //跳转到作者详情页面
  gopoetrylistbyauthor: function(e) {
    let authorName = e.target.dataset.text.authorName;
    let authorId = e.target.dataset.text.authorId;
    wx.navigateTo({
      url: '/pages/library/author-detail/author-detail?authorName=' + authorName + '&authorId=' + authorId,
    })
  },
  //二级分类更多
  librarymore: function(e) {
    console.log(e)
    let catlogOneId = e.target.dataset.text.catlogOneId; //获取一级分类Id
    let currentIndex = e.target.dataset.index; //获取一级分类在数组中的下标
    if (catlogOneId) {//普通分类
      let catlogOneName = e.target.dataset.text.catlogOneName; //获取一级分类名字
      console.log(e)
      wx.navigateTo({
        url: '/pages/library/library-more/library-more?catlogOneName=' + catlogOneName + '&catlogOneId=' + catlogOneId + '&currentIndex=' + currentIndex,
      })
    }else{//朝代分类
      let reignId = e.target.dataset.text.reignId; //获取一级分类Id
      let reignName = e.target.dataset.text.reignName; //获取一级分类名字
      console.log(e.target.dataset.text.reignName)
      wx.navigateTo({
        url: '/pages/library/library-more/library-more?reignName=' + reignName + '&reignId=' + reignId + '&currentIndex=' + currentIndex +'&chaodai=true',
      })
    }
  },
  //跳转到搜索页面
  tosearchpage:function(){
    wx.navigateTo({
      url: '/pages/library/library-search/library-search',
    })

  }
})