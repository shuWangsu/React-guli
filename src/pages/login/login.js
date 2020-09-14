import React from 'react'
import { Form, Input, Button } from 'antd';

import { UserOutlined, LockOutlined } from '@ant-design/icons';

import './login.less'
import logo from './images/logo.png'

/**
 * 登录的路由组件
 */
const Login = () => {

  //点击登录提交数据
  const onFinish = (values) => {
    console.log('Received values of form: ', values);
  };
  return (
    <div className="login">
      <header className="login-header">
        <img src={logo} alt="logo" />
        <h1>学习React-后台管理项目</h1>
      </header>
      <section className="login-content">
        <h2>用户登录</h2>
        <Form
          name="normal_login"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          className="login-form">
          <Form.Item
            name="username"
            initialValue="wang"
            rules={[
              {
                required: true,
                message: '输入用户名',
              },
              {
                min: 4,
                message: '用户名至少4位'
              },
              {
                max: 10,
                message: '用户名最多10位'
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '用户名必须为数字，字母或下划线'
              }
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="用户名"
            />
          </Form.Item>
          <Form.Item
            name="password"
            initialValue="wang"
            rules={[
              {
                required: true,
                message: '密码不能为空',
              },
              {
                min: 4,
                message: '密码至少4位'
              },
              {
                pattern: /^[a-zA-Z0-9_]+$/,
                message: '密码必须为数字，字母或下划线'
              }
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="密码"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              点击登录
              </Button>
          </Form.Item>
        </Form>
      </section>
    </div>
  )

}
export default Login;