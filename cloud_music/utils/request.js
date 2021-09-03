// 发送ajax请求
/*
  1.封装功能函数
    1.功能点明确
    2. 函数内部应该保留静态代码，实现复用。
    3. 将动态的数据抽象成形参，由不同的调用情况传入参数。
  2. 封装功能组件
    1. 功能点明确
    2. 组件内部保留静态的代码
    3. 将动态数据抽象成props参数
    4. 一个良好的组件应该设置组件的必要性及数据。
*/
import config from './config'
export default (url,data={},method='GET')=>{
  return new Promise((resolve,reject)=>{
    wx.request({
      url: config.host + url,
      data: data,
      method,
      header: {
        cookie:wx.getStorageSync('cookies')? wx.getStorageSync('cookies').find(item=> item.indexOf('MUSIC_U')!== -1): ''
      },
      // 当成功发送请求时调用succes函数，并且调用resolve改变这个Promise函数的状态。
      success: (res)=>{
        // 如果是登录请求
        if(data.isLogin){
          // 将用户的cookie存入本地
          wx.setStorage({
            key: 'cookies',
            data: res.cookies
          })
        }
        //console.log('请求成功：',res);
        resolve(res.data);
      },
      fail: (err)=>{
        // console.log('请求失败：',err);
        reject(err);
      }
    })
  })
}