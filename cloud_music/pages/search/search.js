// pages/search/search.js
import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    placeholderContent: '', //place的默认值
    hotList: [], //热搜榜的数据
    searchContent: '', //用户输入的数据
    searchList: [], //模糊匹配的数据
    isSend: false, //判断是否以及发送过请求了
    historyList: [] //历史搜索记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取搜索框内place的值
    this.getInitData();
    //获取历史记录
    this.getSearchHistory()
  },
  // 获取本地历史记录的函数
  getSearchHistory(){
    let historyList = wx.getStorageSync('searchhistory');
    if(historyList){
      this.setData({
        historyList
      })
    }
  },

  //获取placeholder的值
  async getInitData(){
    let placeholderData = await request('/search/default');
    let hotListData = await request('/search/hot/detail');
    this.setData({
      placeholderContent: placeholderData.data.showKeyword,
      hotList: hotListData.data
    })
  },
  // 表单项内容发生改变的回调,同vue不一样的是vue使用v-model双向数据绑定，这里使用DOM的event对象来收集input的value
  handleInput(event){
    // 更改数据
    this.setData({
      searchContent: event.detail.value.trim()
    })
    // 判断是否发送了请求,第一次请求会通过
    if(this.data.isSend){
      return
    }
    this.setData({
      isSend: true
    })
    // 函数节流 控制用户发送请求的次数，不能因为用户的多次输入或者点击发送过多请求
    setTimeout(()=>{
      this.getSearchList();
    },500)
  },

  // 获取搜索数据的功能函数
  async getSearchList(){
    // 判断如果用户输入为空则不发送请求
    if(!this.data.searchContent){
      this.setData({
        isSend: false
      })
      return
    }
    let {searchContent, historyList} = this.data;
    // 发送请求获取关键字模糊匹配数据
    let searchListData = await request('/search', {keywords: this.data.   searchContent,limit: 10})
    this.setData({
      searchList: searchListData.result.songs,
      isSend: false
    })
    //将搜索的关键字存放在历史记录中
    if(historyList.indexOf(searchContent) !== -1){
      historyList.splice(historyList.indexOf(searchContent),1);
    }
    historyList.unshift(searchContent);
    this.setData({
      historyList
    })
    // 将搜索历史存在本地
    wx.setStorageSync('searchhistory', historyList);
  },

  // 清空搜索内容
  clearSearchContent(){
    this.setData({
      searchContent: '',
      searchList: []
    })
  },

  // 删除历史记录
  deleteSearchHistory(){
    // 提示用户是否删除
    wx.showModal({
      cancelColor: 'cancelColor',
      content: '确认删除吗？',
      success: (res)=>{
        if(res.confirm){
          // 清空data中的数据
          this.setData({
            historyList: []
          })
          //清空本地的历史记录
          wx.removeStorageSync('searchhistory')
              }
      }
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