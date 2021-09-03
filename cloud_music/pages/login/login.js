// pages/login/login.js

import request from '../../utils/request'

/*登录流程
1. 收集表单数据
2. 前端验证
  1）验证用户信息是否合法
  2）前端验证不通过就提示用户，不需要发送请求
  3）前端验证通过发送请求，并包含用户信息
3. 后端验证
  1）验证用户是否存在
  2）用户不存在直接返回
  3）验证密码是否正确
  4）不正确返回提示前端 密码不正确，正确返回给前端需要的数据，提示登录成功。
*/ 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    password: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  hanleInput(event){
    //获取事件绑定的元素id 也可以使用data-key = value 给event传递参数
    //event 中target和currenttarget保存的是event事件绑定的元素的相关属性内容，event.detail中保存的是数据。
    let type = event.currentTarget.id;
    this.setData({
      [type]: event.detail.value
    })
  },

  
  async login(){
    // 前端验证，手机号密码不能为空，手机号格式
    let {phone, password} =this.data;
    if(!phone){
      //提示用户,在页面上提示用户代替alert
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none'
      })
      return;
    }
    //定义正则表达式，验证手机号格式
    let phoneReg = /^1(3|4|5|6|7|8|9)\d{9}$/;
    if(!phoneReg.test(phone)){
      wx.showToast({
        title: '手机号格式错误',
        icon: 'none'
      })
      return;
    }
    if(!password){
      wx.showToast({
        title: '密码不能为空',
        icon: 'none'
      })
      return;
    }

    //后端验证
    let result = await request('/login/cellphone',{phone,password,isLogin:true});
    if(result.code === 200){
      wx.showToast({ 
        title: '登录成功',
      })
      //跳转之前将用户信息存储在本地,并转换成JSON数据格式
      wx.setStorageSync('userInfo', JSON.stringify(result.profile))
      //跳转至个人主页 navigateTo不能跳转至tabbar页面所以这里使用switchTab跳转，但是本地存储的信息需要在个人主页获取，且是在onload中，但是onload只执行一次所以这里需要关闭personal页面让它重新加载，所以最好使用wx.reLaunch跳转页面。
      wx.reLaunch({
        url: '/pages/personal/personal',
      })
    }else if(result.code === 400){
      wx.showToast({
        title: '手机号错误',
        icon: 'none'
      })
    }else if(result.code === 502){
      wx.showToast({
        title: '密码错误',
        icon: 'none'
      })
    }else if(result.code === 501){
      wx.showToast({
        title: '账号不存在',
        icon: 'none'
      })
    }
    else{
      wx.showToast({
        title: '登录失败，请重新登录',
        icon: 'none'
      })
    }
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