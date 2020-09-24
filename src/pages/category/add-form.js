import React from 'react'
import { Form, Select, Input } from 'antd'

const Item = Form.Item
const { Option } = Select
/**
 * 添加分类的form组件
 */
const AddForm = () => {
  return (
    <Form>
      <Item>
        <Select style={{ width: '100%' }}>
          <Option value='0'>一级分类</Option>
          <Option value='1'>电脑</Option>
          <Option value='2'>图书</Option>
        </Select>
      </Item>
      <Item>
        <Input placeholder='请输入分类名称'></Input>
      </Item>
    </Form>
  )
}

export default Form.create(AddForm)