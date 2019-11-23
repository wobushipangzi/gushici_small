//app.js
App({
  onLaunch: function () {
    var loginToken = wx.getStorageSync('loginToken');
    //检测用户是否登录 如果未登录 则执行登录操作
    wx.request({
      url: 'http://123.57.60.103:8081/user/checkLogin',
      data:{
        loginToken: loginToken
      },
      method:'post',
      header: {
        'content-type': 'application/json' 
      },
      success: res =>  {
        console.log(res.data)
        // 从微信服务器获取code
        if(res.data.data.isLogin != "yes"){
          //登录
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 loginToken,openId
              console.log(res.code)
              wx.request({
                url: 'http://123.57.60.103:8081/user/login',
                data: {
                  code: res.code
                },
                method: 'post',
                header: {
                  'content-type': 'application/json'
                },
                success: res =>{
                  //返回的 loginToken，openId保存到用户本地storage
                  console.log(res.data.data)
                  wx.setStorage({
                    key: 'loginToken',
                    data: res.data.data.loginToken,
                  })
                  wx.setStorage({
                    key: 'openId',
                    data: res.data.data.openId,
                  })
                  wx.setStorage({
                    key: 'sessionKey',
                    data: res.data.data.sessionKey,
                  })
                }
              })
            }
          })


          // 判断用户是否授权过 如果已经授权 则执行获取用户信息操作 并把用户信息传给古诗词服务器
          wx.getSetting({
            success: res => {
              if (res.authSetting['scope.userInfo']) {
                // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                wx.getUserInfo({
                  withCredentials: true,
                  success: res => {
                    // 可以将 res 发送给后台解码出 unionId
                    this.globalData.userInfo = res.userInfo

                    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                    // 所以此处加入 callback 以防止这种情况
                    if (this.userInfoReadyCallback) {
                      this.userInfoReadyCallback(res)
                    }
                    //将用户信息传给古诗词服务器
                    //获取本地存储的sessionKey
                    let sessionKey = wx.getStorageSync('sessionKey');
                    wx.request({
                      url: 'http://123.57.60.103:8081/user/getUserInfo',
                      data: {
                        'encryptedData': res.encryptedData,
                        'sessionKey': sessionKey,
                        'iv': res.iv
                      },
                      method: 'post',
                      header: {
                        'content-type': 'application/json' // 默认值
                      },
                      success(res) {
                        console.log(res.data)
                      }
                    })
                  }
                })
              }else{
                console.log('暂未授权 不能获取到用户信息')
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    userInfo: null
  }
})