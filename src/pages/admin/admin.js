import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import memoryUtils from '../../utils/memoryUtils'
import { Layout } from 'antd'
import LeftNav from '../../components/left-nav/left-nav'
import Header from '../../components/header/header'

import Home from '../home/home'
import Category from '../category/category'
import Product from '../product/product'
import Role from '../role/role'
import User from '../user/user'
import Bar from '../charts/bar'
import Line from '../charts/line'
import Pie from '../charts/pie'

const { Footer, Sider, Content } = Layout
/**
 * 后台管理的路由组件
 */
const Admin = (props) => {
  const user = memoryUtils.user
  // 如果内存没有存储user===》当前没有登录
  if (!user || !user._id) {
    // 自动跳转到登录（在render中）
    return <Redirect to="/login"></Redirect>
  }
  return (
    <Layout style={{ minHeight: '100%' }}>
      <Sider>
        <LeftNav />
      </Sider>
      <Layout>
        <Header/>
        <Content style={{ backgroundColor: 'white',margin: 15 }}>
          <Switch>
            <Route path='/home' component={Home}/>
            <Route path='/category' component={Category}/>
            <Route path='/product' component={Product}/>
            <Route path='/role' component={Role}/>
            <Route path='/user' component={User}/>
            <Route path='/charts/bar' component={Bar}/>
            <Route path='/charts/line' component={Line}/>
            <Route path='/charts/pie' component={Pie}/>
            <Redirect to="/home" />
          </Switch>
        </Content>
        <Footer style={{ textAlign: 'center', color: '#aaa' }}>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
      </Layout>
    </Layout>
  )
}
export default Admin