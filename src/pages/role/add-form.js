import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item
/**
 * 添加分类的form组件
 */
const AddForm = (props, ref) => {
  const [form] = Form.useForm()
  // useEffect(() => {
  //   form.setFieldsValue({ 'roleName': parentId })
  // }, [parentId])
  useImperativeHandle(ref, () => ({
    // onFinish 就是暴露给父组件的方法
    onFinish: () => {
      const name = form.getFieldValue('categoryName');
      const ID = form.getFieldValue('parentId')
      props.saveForm(name, ID)
      form.setFieldsValue({ 'categoryName': '' })
    },
    initCategoryName: () => {
      form.setFieldsValue({ 'categoryName': '' })
    }
  }))
  return (
    <Form form={form}>
      <Item
        label='角色名称'
        name='roleName'
        rules={[
          {
            required: true,
            message: '角色名称不能为空!'
          },
        ]}>
        <Input placeholder='请输入角色名称' />
      </Item>
    </Form>
  )
}

export default forwardRef(AddForm)
