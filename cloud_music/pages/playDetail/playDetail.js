// pages/playDetail/playDetail.js
import PubSub from 'pubsub-js'
import moment from 'moment'
import request from '../../utils/request'
// 获取全局实例
const appInstance = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlay: false,//判定是否播放
    musicMessage: {}, //视频详细信息
    musicId: '', //音乐id
    currentTime: '00:00', //音乐播放实时事件
    durationTime: '00:00', //音乐总时间
    currentWidth: 0 //实时的进度宽度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let musicId = options.musicId;
    this.setData({
      musicId
    })
    this.getMusicMessage(musicId);
    //因为用户可能在播放一个音乐的时候，退出去点开了另一个音乐或者退出去又切回来，因为音乐播放页的数据会消失所以会造成音乐停止播放，所以我们需要在app.js中记录全局属性。在用户点击暂停播放或者音乐停止时，修改全局的isMusicPlay属性，并且在用户点击播放时记录音乐的id，如果切出去又切回来的是同一首歌就会继续播放。
    if(appInstance.globalData.isMusicPlay && appInstance.globalData.musicId === musicId){
      this.setData({
        isPlay: true
      })
    }
    // 创建控制音乐播放的实例
    this.backgroundAudioManager = wx.getBackgroundAudioManager();
    // 在这里解决点击系统播放暂停键导致的问题 监视音乐的播放/暂停/停止
    this.backgroundAudioManager.onPlay(()=>{
      //修改音乐播放的状态isPlay
      this.setData({
        isPlay: true
      })
      //修改全局音乐播放的状态
      appInstance.globalData.isMusicPlay= true;
      appInstance.globalData.musicId = musicId;
    });
    this.backgroundAudioManager.onPause(()=>{
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay= false;
    });
    this.backgroundAudioManager.onStop(()=>{
      this.setData({
        isPlay: false
      })
      appInstance.globalData.isMusicPlay= false;
    });
    //监听音乐实时播放的进度
    this.backgroundAudioManager.onTimeUpdate(()=>{
      let currentTime = moment(this.backgroundAudioManager.currentTime *1000).format('mm:ss');
      // 计算音乐的实时进度
      let currentWidth = this.backgroundAudioManager.currentTime/this.backgroundAudioManager.duration *450;
      this.setData({
        currentTime,
        currentWidth
      })
    })
    //监听音乐播放自然结束
    this.backgroundAudioManager.onEnded(()=>{
      //自动切换自下一首音乐并自动播放,再次给rec.js发送消息
      PubSub.publish('switchType', 'next');
      //将实时进度条长度还原为0
      this.setData({
        currentWidth: 0,
        currentTime: '00:00'
      })
    })
  },

  // 点击播放或者暂停的回调函数
  musicPlay(){
    // 控制磁盘转动和指针动画的isPlay逻辑
    let isPlay = !this.data.isPlay;
    this.musicControl(isPlay, this.data.musicId);
  },

  // 控制音乐播放暂停的功能函数
  async musicControl(isPlay, musicId){
    // 会存在一个问题，系统的播放暂停不能跟isPlay绑定，导致点击系统的暂停时，音乐停止了isPlay还是播放状态。
    if(isPlay){
      // 播放
      // 根据id获取音乐播放连接
      let musicLinkData = await request('/song/url',{id: musicId})
      let musicLink = musicLinkData.data[0].url;
      // 设置音频数据源,必须设置了tilte才能播放
      this.backgroundAudioManager.src= musicLink;
      this.backgroundAudioManager.title = this.data.musicMessage.name;
    }else{
      // 暂停
      this. backgroundAudioManager.pause();
    }
  },

  // 获取歌曲的详细信息
  async getMusicMessage(musicId){
    let musicMessageData = await request('/song/detail',{
      ids: musicId
    });
    this.setData({
      //根据请求返回的数据，歌曲详情是songs这个数组
      musicMessage: musicMessageData.songs[0]
    })
    // 从获取的歌曲详情musicMessage中获取歌曲时长,并且格式化事件
    let durationTime = moment(this.data.musicMessage.dt).format('mm:ss');
    this.setData({
      durationTime
    })
    wx.setNavigationBarTitle({
      title: this.data.musicMessage.name,
    })
  },

  //点击切歌的回调函数
  handleSwitch(event){
    // 获取切歌的类型，是上一首还是下一首
    let type = event.currentTarget.id;
    // 在播放下一首之前应该先关闭正在播放的音乐
    this.backgroundAudioManager.pause();
    // 订阅来自recommendjs页面发布的musicId消息，以切歌
    PubSub.subscribe('musicId',(msg, musicId)=>{
      // 获取切换歌曲的音乐信息
      this.getMusicMessage(musicId);
      // 自动播放当前的音乐
      this.musicControl(true, musicId);
      // 取消订阅，以免订阅叠加
      PubSub.unsubscribe('musicId');
    })
    // 发布消息
    PubSub.publish('switchType', type);
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