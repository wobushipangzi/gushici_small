// pages/library/library-search/library-search.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "souzuozhe": true,
    "inputValue": null,
    "showzuozhelist": true,
    "zuozhedetail": null,
    "zuopindetail": null
  },
  //输入框
  bindKeyInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //点击搜索作者按钮
  souzuozhe: function() {
    let inputValue = this.data.inputValue;
    wx.request({
      url: 'http://123.57.60.103:8081/author/searchAuthor',
      method: 'post',
      data: {
        "authorName": inputValue
      },
      success: res => {
        console.log(res.data)
        wx.showLoading({
          title: '加载中',
          mask:true
        })
        this.setData({
          "zuozhedetail": res.data.data,
          "showzuozhelist": true
        })
        if (!res.data.data.length) {
          wx.showToast({
            title: '咦？没搜到，换个关键字试试',
            icon: 'none'
          })
        }else{
          wx.hideLoading()
        }
      }
    })
  },
  //点击搜索作品按钮
  souzuopin: function() {
    let inputValue = this.data.inputValue;
    wx.request({
      url: 'http://123.57.60.103:8081/product/searchProduct',
      method: 'post',
      data: {
        "productName": inputValue
      },
      success: res => {
        console.log(res.data.data.length)
        wx.showLoading({
          title: '加载中',
          mask: true
        })
        this.setData({
          "zuopindetail": res.data.data,
          "showzuozhelist": false
        })
        if (!res.data.data.length){
          wx.showToast({
            title: '咦？没搜到，换个关键字试试',
            icon: 'none'
          })
        } else {
          console.log(1111111111)
          wx.hideLoading()
        }
      }
    })
  },
  //跳转到作者详情页面
  goauthordetail: function(e) {
    console.log(e)
    let authorName = e.currentTarget.dataset.text.authorName;
    let authorId = e.currentTarget.dataset.text.authorId;
    wx.navigateTo({
      url: '/pages/library/author-detail/author-detail?authorName=' + authorName + '&authorId=' + authorId,
    })
  },
  //跳转到诗详情页面
  golibrarydetail: function(e) {
    console.log(e.currentTarget.dataset.text)
    let productId = e.currentTarget.dataset.text.productId;
    let productName = e.currentTarget.dataset.text.productName;
    wx.navigateTo({
      url: '/pages/library/library-list/library-detail/library-detail?productId=' + productId + '&productName=' + productName,
    })
  }
})