/**
 * 左侧导航的组件
 */
import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import './index.less'
import { Menu } from 'antd';
import {
    ShoppingOutlined,
    HomeOutlined,
    BoldOutlined,
    TagOutlined,
    UserOutlined,
    RedditOutlined
} from '@ant-design/icons';
import logo from '../../assets/images/logo.png'
const { SubMenu } = Menu;
const LeftNav = (props) => {
    // const [state, setState] = useState({ collapsed: false })
    return (
        <div className="left-nav">
            <Link to="/" className="left-nav-header">
                <img src={logo} alt="logo" />
                <h1>硅谷后台</h1>
            </Link>
            <Menu
                defaultSelectedKeys={['1']}
                defaultOpenKeys={['sub1']}
                mode="inline"
                theme="dark"
            >
                <Menu.Item key="1" icon={<HomeOutlined />}>
                    <Link to="/home">首页</Link>
                </Menu.Item>
                <SubMenu key="sub1" icon={<ShoppingOutlined />} title="商品">
                    <Menu.Item key="2" icon={<BoldOutlined />}>
                        <Link to="/category">品类管理</Link>
                    </Menu.Item>
                    <Menu.Item key="3" icon={<TagOutlined />}>
                        <Link to="/product">商品管理</Link>
                    </Menu.Item>
                </SubMenu>
                <Menu.Item key="4" icon={<UserOutlined />}>
                    <Link to="/user">用户管理</Link>
                </Menu.Item>
                <Menu.Item key="5" icon={<RedditOutlined />}>
                    <Link to="/role">角色管理</Link>
                </Menu.Item>
            </Menu>
        </div>
    )
}
export default LeftNav