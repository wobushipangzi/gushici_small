// pages/library/library-list/library-comment/library-comment.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentData: null,
    replyData:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let topicType = "gushici";
    let topicId = options.topicId;
    let productName = options.productName;
    let productId = options.productId;
    let openId = wx.getStorageSync("openId");
    wx.setNavigationBarTitle({
      title: productName,
    })
    wx.request({
      url: 'http://123.57.60.103:8081/comment/show/comment',
      data: {
        "topicType": topicType,
        "topicId": productId,
        "openId": openId
      },
      method: 'post',
      success: res => {
        console.log(res.data.data)
        this.setData({
          commentData: res.data.data,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  praise(e) {
    console.log(e)
    var isPraised = e.currentTarget.dataset.text.isPraised;
    var index = e.currentTarget.dataset.index;
    var commentData = this.data.commentData;
    let commentId = e.currentTarget.dataset.text.commentId;
    let fromOpenId = wx.getStorageSync("openId");
    let toOpenId = e.currentTarget.dataset.text.commentOpenId;
    if (isPraised){
      commentData[index].isPraised = false;
      commentData[index].praiseCount = Number(commentData[index].praiseCount) - 1;
      this.setData({
        commentData
      })
      wx.request({
        url: 'http://123.57.60.103:8081/comment/remove/praise',
        data: {
          "commentId": commentId,
          "praiseOpenId": fromOpenId,
        },
        method: 'post',
        success: res => {
          console.log(res.data.data)
        }
      })
    }else{
      commentData[index].isPraised = true;
      commentData[index].praiseCount = Number(commentData[index].praiseCount) + 1;
      this.setData({
        commentData
      })
      wx.request({
        url: 'http://123.57.60.103:8081/comment/praise',
        data: {
          "commentId": commentId,
          "fromOpenId": fromOpenId,
          "toOpenId": toOpenId,
        },
        method: 'post',
        success: res => {
          console.log(res.data.data)
        }
      })
    }
  },
  expandResponse(e){
    console.log(e)
    let commentId = e.currentTarget.dataset.text.commentId;
    wx.request({
      url: 'http://123.57.60.103:8081/comment/show/reply',
      data: {
        "commentId": commentId,
        "page": 0
      },
      method: 'post',
      success: res => {
        wx.showLoading({
          title: '努力加载中',
        })
        console.log(res.data.data)
        this.setData({
          replyData: res.data.data,
        })
        wx.hideLoading();
      }
    })
  }
})