import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const { Option } = Select
/**
 * 添加分类的form组件
 */
const AddForm = (props, ref) => {
  const [form] = Form.useForm()
  const categorys = props.categorys
  const parentId = props.parentId
  useEffect(() => {
    form.setFieldsValue({ 'parentId': parentId })
  }, [parentId])
  useImperativeHandle(ref, () => ({
    // onFinish 就是暴露给父组件的方法
    onFinish: () => {
      const name = form.getFieldValue('categoryName');
      const ID = form.getFieldValue('parentId')
      props.saveForm(name,ID)
      form.setFieldsValue({ 'categoryName': '' })
    },
    initCategoryName: () => {
      form.setFieldsValue({ 'categoryName': '' })
    }
  }))
  return (
    <Form form={form}>
      <Item
        name='parentId'
        // initialValue={parentId}
        rules={[
          {
            required: true,
            message: '请选择分类!',
          },
        ]}>
        <Select style={{ width: '100%' }} >
          <Option value='0'>一级分类</Option>
          {categorys.map(item => <Option value={item._id} key={item._id}>{item.name}</Option>)}
        </Select>
      </Item>
      <Item
        name='categoryName'
        // initialValue=''
        rules={[
          {
            required: true,
            message: '分类名称不能为空!',
          },
        ]}>
        <Input placeholder='请输入分类名称'></Input>
      </Item>
    </Form>
  )
}

export default forwardRef(AddForm)
