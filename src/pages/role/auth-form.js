import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import { Form, Input, Tree } from 'antd'

const Item = Form.Item
/**
 * 添加分类的form组件
 */
const AuthForm = (props, ref) => {
  const [form] = Form.useForm()
  const [role, setRole] = useState()
  useImperativeHandle(ref, () => ({
    // onFinish 就是暴露给父组件的方法
    onFinish: () => {
    }
  }))
  return (
    <Form form={form}>
      <Item
        label='角色名称'>
        <Input value={role} disabled />
      </Item>
    </Form>
  )
}

export default forwardRef(AuthForm)
