/**
 * 左侧导航的组件
 */
import React, { useState } from 'react'
import { Link, withRouter } from 'react-router-dom'
import './index.less'
import { Menu } from 'antd';

import logo from '../../assets/images/logo.png'
import menuList from '../../config/menuConfig'
const { SubMenu } = Menu;
const LeftNav = (props) => {
    // 得到当前请求的路由路径
    const path = props.location.pathname
    const [openKey] = useState([])
    //根据menu的数据数组生成对应的标签数组
    const getMenuNodes = (menuList) => {
        return menuList.map(item => {
            if (!item.children) {
                return (
                    <Menu.Item key={item.key} icon={item.icon}>
                        <Link to={item.key}>{item.title}</Link>
                    </Menu.Item>
                )
            } else {
                // 查找一个与当前请求路径匹配的子item
                const cItem = item.children.find(cItem => cItem.key === path)
                // 如果存在,说明当前item的子列表需要打开
                if (cItem) {
                    openKey.push(item.key)
                }
                return (
                    <SubMenu key={item.key} icon={item.icon} title={item.title}>                 
                        {getMenuNodes(item.children)}
                    </SubMenu>
                )
            }
        })
    }
    // useEffect(() => {
    //     getMenuNodes(menuList)
    // }, [menuList])
    return (
        <div className="left-nav">
            <Link to="/" className="left-nav-header">
                <img src={logo} alt="logo" />
                <h1>硅谷后台</h1>
            </Link>
            <Menu
                selectedKeys={path}
                defaultOpenKeys={openKey}
                mode="inline"
                theme="dark"
            >
                { getMenuNodes(menuList) }
            </Menu>
        </div>
    )
}

/**
 * withRouter高阶组件:
 * 包装非路由组件,返回一个新的组件
 * 新的组件向非路由组件传递三个属性:history/location/match
 */
export default withRouter(LeftNav)