/**
 * 能发送异步ajax请求的函数模块
 * 封装axios库
 * 函数的返回值是promise对象
 * 
 * 1.优化：统一处理请求异常
 * 在外层包一个自己创建的promise对象
 * 在请求出错时，不reject，而是显示错误提示
 */
import axios from 'axios'
import { message } from 'antd'
export default function ajax (url, data = {}, type = 'GET') {
  return new Promise((resolve, reject) => {
    let promise
    // 1.执行异步ajax请求
    if (type === 'GET') { //发get请求
      promise = axios.get(url, { params: data })
    } else { //post请求
      promise = axios.post(url, data)
    }
    // 2.成功：调用resolve
    promise.then(response => {
      resolve(response)
    }).catch(error => {// 3.失败：不调用reject，而是提示异常信息
      message.error('请求出错了:' + error.message)
    })

  })

}