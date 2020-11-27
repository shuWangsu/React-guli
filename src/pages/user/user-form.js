import React, { useImperativeHandle, forwardRef } from 'react'
import { Form, Input, Select, Button, message } from 'antd'
import { reqAddOrUpdateUser } from '../../api'
const { Option } = Select
const Item = Form.Item
/**
 * 添加修改用户的form组件
 */
const UserForm = (props, ref) => {
  const [form] = Form.useForm()
  const { roles } = props
  const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 16 },
  }
  const tailLayout = {
    wrapperCol: { offset: 15, span: 20 },
  }
  // 点击确认按钮
  const onFinish = async (values) => {
    if (Object.keys(props.userInfo).length !== 0) {
      values._id = props.userInfo._id
    }
    const result = await reqAddOrUpdateUser(values)
    if (result.status === 0) {
      let msg
      if (values._id) {
        msg = '修改用户成功'
      } else {
        msg = '添加用户成功'
      }
      message.success(msg)
      props.showModal(0)
      props.getUsers()
    } else {
      message.error(result.msg)
    }
  };
  //提交失败的情况 
  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };
  return (
    <Form form={form}
      {...layout}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      preserve={false}
      initialValues={props.userInfo}>
      <Item
        label='用户名'
        name='username'
        rules={[
          {
            required: true,
            message: '用户名不能为空!'
          },
        ]}>
        <Input placeholder='请输入用户名' />
      </Item>
      {
        props.userInfo._id ? null : (
          <Item
            label='密码'
            name='password'
            rules={[
              {
                required: true,
                message: '密码不能为空!'
              },
            ]}>
            <Input type='password' placeholder='请输入密码' />
          </Item>
        )
      }
      <Item
        label='手机号'
        name='phone'
        rules={[
          {
            required: true,
            message: '手机号不能为空!'
          },
        ]}>
        <Input placeholder='请输入手机号' />
      </Item>
      <Item
        label='邮箱'
        name='email'
        rules={[
          {
            required: true,
            message: '邮箱不能为空!'
          },
        ]}>
        <Input type='email' placeholder='请输入邮箱' />
      </Item>
      <Item
        label='角色'
        name='role_id'
        rules={[
          {
            required: true,
            message: '角色不能为空!'
          },
        ]}>
        <Select placeholder="请选择角色">
          {roles.map(role => <Option key={role._id} value={role._id} >{role.name}</Option>)}
        </Select>
      </Item>
      <Item {...tailLayout} style={{ marginTop: 10 }}>
        <Button style={{ marginRight: 10 }} onClick={() => props.showModal(0)}>
          取消
        </Button>
        <Button type="primary" htmlType="submit">
          确定
        </Button>
      </Item>
    </Form>
  )
}

export default forwardRef(UserForm)
// export default UserForm
