// pages/recommendsong/recommendsong.js
import PubSub from 'pubsub-js'
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    day: '',
    month: '',
    recommendList: [], //获取推荐歌曲数据
    index: 0, //点击音乐在音乐列表中的下标

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options ：用于接收路由跳转的query参数
    // 判断是否登录
    let userInfo  = wx.getStorageSync('userInfo');
    if(!userInfo){
      wx.showToast({
        title: '请登录',
        icon: 'none',
        success: ()=>{
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }
    // 获取动态日期
    this.setData({
      day: new Date().getDate(),
      month: new Date().getMonth()+1
    })
    // 获取每日推荐的数据
    this.getRecommendList();
    // 订阅来自playDetail页面发布的消息
    PubSub.subscribe('switchType',(msg,data)=>{
      //  获取每日推荐个单列表以及歌曲下标
      let {recommendList, index} = this.data;
      // msg是消息名称，data是传递的数据
      if(data ==='pre'){ //上一首
        if(index ===0){
          index = recommendList.length-1;
        }else{
          index -= 1;
        }
      }else{ //下一首
        if(index === recommendList.length-1){
          index =0;
        }else{
          index +=1;
        }
      }
      // 更新下标
      this.setData({
        index
      })
      // 根据最新的index获取要切换歌曲的id
      let musicId = recommendList[index].id;
      // 将要切换歌曲的musicId回传给playDetail,这时定义在订阅消息中的等于说在play中发布消息之后，rec.js也会发布消息带着musicId回到play.js
      PubSub.publish('musicId', musicId);
    })

  },
  // 获取每日推荐歌单数据
  async getRecommendList(){
    let recommendListData = await request('/recommend/songs');
    this.setData({
      recommendList: recommendListData.recommend
    })
  },

  // 路由传递参数给playDetail
  toSongDetail(event){
    // 事件对象event被传递的参数提取出来
    let {song, index} = event.currentTarget.dataset;
    this.setData({
      index
    })
    // 路由跳转传递参数： query参数以?开头,传递的变量要以字符串的形式。
    wx.navigateTo({
      // 不能直接传递对象因为有可能对象长度过长，小程序会自动截断。
      url: '/songPackage/pages/playDetail/playDetail?musicId=' + song.id
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