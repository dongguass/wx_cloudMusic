import request from '../../utils/request'

// 定义变量计算移动距离
let startY = 0;//手指点击的初始位置 Y轴方向 因为只计算向下滑动
let moveY = 0;// 手指滑动了多少
let moveDistance = 0; // moveY - startY = moveDistance
Page({

  /**
   * 页面的初始数据
   */
  data: {
    coverTransform: "translateY(0)",
    coverTransition: "",
    userInfo: {}, //用户信息
    recentPalyList: []//用户最近播放的歌曲列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = wx.getStorageSync('userInfo');
    if(userInfo){
      this.setData({
        userInfo: JSON.parse(userInfo)
      })

      //获取用户包房记录
      this.getUserPlayList(this.data.userInfo.userId)
    }
  },

  //获取用户播放记录的函数
  async getUserPlayList(userId){
    let recentPlaiListData = await request('/user/record',{uid:userId, type: 0})
    let index = 0;
    this.setData({
      //获取了播放的数据之后，通过splice赛选出前十个然后使用map修改数组
      recentPalyList: recentPlaiListData.allData.splice(0,10).map(item =>{
        item.id = index++;
        return item;
      })
    })
  },

  // 手指触摸个人页的事件，分三个阶段
  handleTouchStart(event){
    //因为第一完成滑动松开手指后，data中的transition数据已经改变所以需要重置
    this.setData({
      coverTransition : ''
    })
    // 获取手指起始坐标，因为可能会有多个手指触摸，以第一个为准所以使用touches[0]，clientY获取距离页面的视口距离
    startY = event.touches[0].clientY;
  },

  handleTouchMove(event){
    moveY = event.touches[0].clientY;
    moveDistance = moveY - startY;
    // 动态更新coverTransform的值也就是移动的距离,注意这里没带单位
    if(moveDistance <= 0){
      return
    }
    if(moveDistance >= 80){
      moveDistance = 80;
    }
    this.setData({
      coverTransform: `translateY(${moveDistance}rpx)`
    })
  },
  
  handleTouchEnd(){
    this.setData({
      coverTransform :'translateY(0rpx)',
      coverTransition : 'transform 100ms linear'
    })
  },

  // 跳转至登录界面的url
  toLogin(){
    wx.navigateTo({
      url: '/pages/login/login',
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})