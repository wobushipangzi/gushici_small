// pages/library/library-more/library-more.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    "wenkuputong": null,
    "chaodai": false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(options)
    let currentIndex = options.currentIndex;
    let catlogOneName = options.catlogOneName; //一级分类名字
    let catlogOneId = options.catlogOneId; //一级分类ID
    let reignId = options.reignId;
    let chaodai = options.chaodai; //是否为朝代分类
    
    if (!chaodai) {// 获取普通分类接口
      wx.setNavigationBarTitle({
        title: options.catlogOneName
      }); // options.name表示上个页面传过来的文字  
      wx.request({
        url: 'http://123.57.60.103:8081/product/getMore',
        method: 'post',
        data:{
          catlogOneId: catlogOneId,
          reignId	:''
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data)
          this.setData({
            'wenkuputong': res.data.data
          })
        }
      })
    }else{// 获取朝代分类接口
      wx.setNavigationBarTitle({
        title: options.reignName
      }); // options.name表示上个页面传过来的文字 
      this.setData({
        "chaodai":true
      });
      wx.request({
        url: 'http://123.57.60.103:8081/product/getMore',
        method: 'post',
        data: {
          catlogOneId: '',
          reignId: reignId
        },
        header: {
          'content-type': 'application/json'
        },
        success: res => {
          console.log(res.data.data[currentIndex].authors)
          this.setData({
            'wenkuputong': res.data.data
          })
        }
      })
    }
  },
  //根据普通分类跳转诗列表页面
  gopoetrylistbyputong: function(e) {
    console.log(e)
    let catlogTwoName = e.target.dataset.text.catlogTwoName;
    let catlogTwoId = e.target.dataset.text.catlogTwoId;
    wx.navigateTo({
      url: '/pages/library/library-list/library-list?catlogTwoName=' + catlogTwoName + '&catlogTwoId=' + catlogTwoId,
    })
  },
  //根据朝代分类跳转作者详情页面
  gopoetrylistbyauthor: function (e) {
    let authorName = e.target.dataset.text.authorName;
    let authorId = e.target.dataset.text.authorId;
    wx.navigateTo({
      url: '/pages/library/author-detail/author-detail?authorName=' + authorName + '&authorId=' + authorId,
    })
  },
})