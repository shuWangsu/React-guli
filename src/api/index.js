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
export const reqAddOrUpdateUser = (user) => ajax(baseURL + '/manage/user/' + (user._id ? 'update' : 'add'), user, 'POST')

//获取所在城市
// export const reqCity = () => ajax(baseURL + '/getcity',{},'GET')
// export const reqCity = () => {
//   return new Promise((resolve, reject) => {
//     const url = 'http://pv.sohu.com/cityjson?ie=utf-8'
//     jsonp(url, (err, data) => {
//       // 如果成功了
//       console.log('data',data)
//       let value
//       if (!err) {
//         // 取出需要的数据
//         if (data.indexOf('CHINA') > -1) {
//           const city = data.substring(19,76)
//           value = JSON.parse(city)
//           value.cname = '北京'
//         } else {
//           const city = data.substring(19,79)
//           value = JSON.parse(city)
//         }
//         resolve(value)
//       } else {
//         // 如果失败了
//         message.error('获取城市信息失败')
//       }
//       console.log(11111)
//     })
//     console.log(22222)
//   })
// }

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

//获取一级/二级分类的列表
export const reqCategorys = (parentId) => ajax(baseURL + '/manage/category/list', { parentId })

//添加分类
export const reqAddCategory = (categoryName, parentId) => ajax(baseURL + '/manage/category/add', { categoryName, parentId }, 'POST')

//更新分类
export const reqUpdateCategory = ({ categoryId, categoryName }) => ajax(baseURL + '/manage/category/update', { categoryId, categoryName }, 'POST')

// 获取商品分页列表
export const reqProducts = (pageNum, pageSize) => ajax(baseURL + '/manage/product/list', { pageNum, pageSize })

/*
  搜索商品分页列表(根据商品名称/商品描述)
  serachType:搜索类型， productName/productDesc
*/
export const reqSearchProducts = ({ pageNum, pageSize, searchName, searchType }) => ajax(baseURL + '/manage/product/search', {
  pageNum,
  pageSize,
  [searchType]: searchName
})

//获取一个分类
export const reqCategory = (categoryId) => ajax(baseURL + '/manage/category/info', { categoryId })

// 更新商品的装态（上架/下架）

export const reqUpdateStatus = (productId, status) => ajax(baseURL + '/manage/product/updateStatus', { productId, status }, 'POST')

//删除上传的图片
export const reqDeleteImg = (name) => ajax(baseURL + '/manage/img/delete', { name }, 'POST')

// 添加商品

export const reqAddOrUpdateProduct = (product) => ajax(baseURL + '/manage/product/' + (product._id ? 'update' : 'add'), product, 'POST')

// 修改商品

// export const reqUpdateProduct = (product) => ajax(baseURL + '/manage/product/update', product, 'POST')

// 获取所有角色的列表

export const reqRoles = () => ajax(baseURL + 'manage/role/list')

// 添加角色
export const reqAddRole = (name) => ajax(baseURL + '/manage/role/add', { roleName: name }, 'POST')

// 
export const reqUpdateRole = (role) => ajax(baseURL + '/manage/role/update', role, 'POST')

// 获取所有用户的列表
export const reqUsers = () => ajax(baseURL + '/manage/user/list')

// 删除用户
export const reqDeleteUser = (userId) => ajax(baseURL + '/manage/user/delete', { userId }, 'POST')
