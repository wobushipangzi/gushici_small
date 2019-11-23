// pages/library/author-detail/author-detail.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    authordetail: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let authorName = options.authorName; //作者名字
    let authorId = options.authorId; //作者分类ID
    let that = this;
    wx.setNavigationBarTitle({
      title: options.authorName
    }); // options.name表示上个页面传过来的文字  
    //根据作者分类获取作者详情
    //从本地缓存中获取openId参数
    let openId = wx.getStorageSync("openId");
    wx.request({
      url: 'http://123.57.60.103:8081/author/getAuthor/product',
      data: {
        authorId: authorId,
        openId: openId
      },
      method: 'post',
      success(res) {
        that.setData({
          authordetail: res.data.data
        })
        console.log(res.data.data)
      }
    })
  },
  golibrarydetail: function(e) {
    console.log(e.currentTarget.dataset.text)
    let productId = e.currentTarget.dataset.text.productId;
    let productName = e.currentTarget.dataset.text.productName;
    wx.navigateTo({
      url: '/pages/library/library-list/library-detail/library-detail?productId=' + productId + '&productName=' + productName,
    })
  }

})