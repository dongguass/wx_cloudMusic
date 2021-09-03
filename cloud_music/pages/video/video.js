// pages/video/video.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    videoGroupList: [],//导航数据
    navId :'', //导航标识
    videoList: [], // 导航表示
    videoTurnImageId: '', //视频id标识
    isTriggered: false //标记视频是否被下拉刷新
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoGroupListData();
    
  },

  // 获取导航数据
  async getVideoGroupListData(){
    let videoGroupListData = await request('/video/group/list')
    this.setData({
      videoGroupList: videoGroupListData.data.slice(0,14),
      navId: videoGroupListData.data[0].id
    })
    //获取视频列表
    this.getVideoList(this.data.navId);
  },

  //点击切换导航的回调，并且随着切换导航通过每个导航的navId请求不同的视频列表的功能。
  changeNav(event){
    let navId = event.currentTarget.id;
    this.setData({
      //通过event.currentTarget.id传入的number类型会被转换成string类型
      navId: navId*1 ,
      // 清空之前存的视频数据
      videoList: []
    })
    // 显示正在加载
    wx.showLoading({
      title: '正在加载',
    })
    // 根据导航的navId获取对应的视频列表
    this.getVideoList(this.data.navId);
  },

  // 获取视频列表的方法
  async getVideoList(navId){
    let videoListData = await request('/video/group',{id: navId})
    // 此处已经获取到了最新的列表数据,关闭加载
    wx.hideLoading();
    // 给视频列表添加id属性
    let index = 0;
    let videoList = videoListData.datas.map(item =>{
      item.id = index++;
      return item;
    })
    // 当下拉请求数据完毕时，自动关闭刷新样式。
    this.setData({
      videoList,
      isTriggered: false
    })
  },

  // 处理多个视频同时播放的问题
  handlePlay(event){
    // 获取当前点击的视频的id
    let vid = event.currentTarget.id;
    // 关闭上一个video实例对象
    // this.vid !== vid &&this.videoContext && this.videoContext.stop();
    // 将vid也存入全局变量中,方便判断新的点击事件中event.id是不是同一个视频的vid。
    // this.vid = vid;
    //更新videoTurnImageId数据
    this.setData({
      videoTurnImageId: vid
    })
    // 创建控制video标签的实例对象,存放在全局属性中
    this.videoContext = wx.createVideoContext(vid);
    this.videoContext.play();
    // this.videoContext.stop();
  },

  // 自定义下拉刷新的回调
  handleRefresher(){
    // 再次发请求获取视频数据
    this.getVideoList(this.data.navId);
  },

  // 跳转至搜索
  turnToSearch(){
    wx.navigateTo({
      url: '/pages/search/search',
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