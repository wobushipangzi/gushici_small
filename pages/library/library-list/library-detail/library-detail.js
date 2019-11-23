// pages/library/library-list/library-detail/library-detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    poetryData: null,
    productId: null,
    authorId: null,
    authorName: null,
    isCollect: false,
    showyiwen: true,
    showzhushi: false,
    showjiexi: false,
    productName: null,
    commentCount:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let productId = options.productId;
    let openId = wx.getStorageSync('openId');
    let productName = options.productName;
    this.setData({
      productId: productId,
      productName: productName
    })
    wx.setNavigationBarTitle({
      title: options.productName
    });
    let that = this;
    wx.request({
      url: 'http://123.57.60.103:8081/product/getproduct/details',
      data: {
        "productId": productId,
        "openId": openId
      },
      method: 'post',
      success: res => {
        console.log(res.data.data)
        that.setData({
          poetryData: res.data.data,
          authorId: res.data.data.authorId,
          authorName: res.data.data.authorName,
          commentCount: res.data.data.commentCount
        })
      
        let isCollect = res.data.data.isCollect;
        this.setData({
          isCollect: isCollect
        })
      }
    })
  },
  //收藏和取消收藏
  collectpoetry: function() {
    let productId = this.data.productId;
    let authorId = this.data.authorId;
    let openId = wx.getStorageSync('openId');
    //判断当前收藏状态
    // 如果当前未收藏
    console.log(this.data.isCollect)
    if (this.data.isCollect) {
      wx.request({
        url: 'http://123.57.60.103:8081/product/delCollect',
        data: {
          openId: openId,
          productId: productId
        },
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data)
          if (res.data.data.isSuccess) {
            this.setData({
              isCollect: false
            })
            wx.showToast({
              title: '取消收藏',
              icon: 'success'
            })
          }
        }
      })
    } else { //如果未收藏 点击收藏
      wx.request({
        url: 'http://123.57.60.103:8081/product/addCollect',
        data: {
          openId: openId,
          productId: productId
        },
        method: 'post',
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data)
          if (res.data.data.isSuccess) {
            this.setData({
              isCollect: true
            })
            wx.showToast({
              title: '已收藏',
              icon: 'success'
            })
          }
        }
      })
    }

  },
  //译文
  handleyiwen() {
    this.setData({
      showyiwen: true,
      showzhushi: false,
      showjiexi: false
    })
  },
  //注释
  handlezhushi() {
    this.setData({
      showzhushi: true,
      showyiwen: false,
      showjiexi: false
    })
  },
  //赏析
  handlejiexi() {
    this.setData({
      showjiexi: true,
      showzhushi: false,
      showyiwen: false
    })
  },
  //跳转到作者详情页面
  gopoetrylistbyauthor: function() {
    let authorName = this.data.authorName;
    let authorId = this.data.authorId;
    console.log(authorName, authorId)
    wx.navigateTo({
      url: '/pages/library/author-detail/author-detail?authorName=' + authorName + '&authorId=' + authorId,
    })
  },
  //跳转到二级分类 诗列表页面
  gopoetrylist: function(e) {
    let catlogTwoName = e.target.dataset.text.catlogTwoName;
    let catlogTwoId = e.target.dataset.text.catlogTwoId;
    wx.navigateTo({
      url: '/pages/library/library-list/library-list?catlogTwoName=' + catlogTwoName + '&catlogTwoId=' + catlogTwoId,
    })
  },
  commentpoetry() {
    let productId = this.data.productId;
    let productName = this.data.productName;
    wx.navigateTo({
      url: "/pages/library/library-list/library-comment/library-comment?productId=" + productId + "&productName=" + productName,
    })
  }
})