/**
 * 包含应用中所有接口请求函数的模块
 * 每个函数的返回值都是promise
 */
import ajax from './ajax'
import jsonp from 'jsonp'
import { message } from 'antd'
const baseURL = ''

//登录
export const reqLogin = (username, password) => ajax(baseURL + '/login', { username, password }, 'POST')

// 添加用户
export const reqAddUser = (user) => ajax(baseURL + '/manage/user/add', user, 'POST')

// jsonp 请求的接口请求函数

export const reqWeather = (city) => {
  return new Promise((resolve, reject) => {
    const url = `http://api.map.baidu.com/telematics/v3/weather?location=${city}&output=json&ak=3p49MVra6urFRGOT9s8UBWr2`
    jsonp(url, {}, (err, data) => {
      // 如果成功了
      if (!err && data.status === 'success') {
        // 取出需要的数据
        const { dayPictureUrl, weather } = data.results[0].weather_data[0]
        resolve({ dayPictureUrl, weather })
      } else {
        // 如果失败了
        message.error('获取天气信息失败')
      }
    })
  })
}