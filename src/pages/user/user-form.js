import React, { useImperativeHandle, forwardRef } from 'react'
import { Form, Input, Select } from 'antd'
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
  // useEffect(() => {
  //   form.setFieldsValue({ 'roleName': parentId })
  // }, [parentId])
  useImperativeHandle(ref, () => ({
    // onFinish 就是暴露给父组件的方法
    onFinish: () => {
      // const name = form.getFieldValue('roleName')
      // props.saveForm(name)
      // form.setFieldsValue({ 'roleName': '' })
    }
  }))
  return (
    <Form form={form} {...layout}>
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
          { roles.map(role => <Option key={role._id} value={role._id} >{role.name}</Option>) }
        </Select>
      </Item>
    </Form>
  )
}

export default forwardRef(UserForm)
// export default UserForm
