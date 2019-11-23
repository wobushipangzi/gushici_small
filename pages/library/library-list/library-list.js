// pages/library/library-list/library-list.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetrylist:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let catlogTwoId = options.catlogTwoId;//普通分类Id
    let authorId = options.authorId;//作者分类ID
    let that = this;
    wx.setNavigationBarTitle({ title: options.catlogTwoName }); // options.name表示上个页面传过来的文字  
    //根据普通分类获取诗列表
    wx.request({
      url: 'http://123.57.60.103:8081/product/getproduct',
      data:{
        catlogTwoId: catlogTwoId
      },
      method: 'post',
      success(res){
        wx.showLoading({
          title: '努力加载中',
        })
        that.setData({
          poetrylist: res.data.data
        })
        wx.hideLoading();
        console.log(res.data.data)
      }
    })
    //根据作者分类获取诗列表
    //从本地缓存中获取openId参数
    let openId = wx.getStorageSync("openId");
    wx.request({
      url: 'http://123.57.60.103:8081/getAuthor/product',
      data: {
        authorId: authorId,
        openId: openId
      },
      method: 'post',
      success(res) {
        wx.showLoading({
          title: '努力加载中',
        })
        that.setData({
          poetrylist: res.data.data
        })
        wx.hideLoading();
        console.log(res.data.data)
      }
    })
  },
  //跳转到诗详情页面
  golibrarydetail:function(e){
    console.log(e.currentTarget.dataset.text)
    let productId = e.currentTarget.dataset.text.productId;
    let productName = e.currentTarget.dataset.text.productName;
     wx.navigateTo({
       url: './library-detail/library-detail?productId=' + productId + '&productName=' + productName,
     })
  }
})