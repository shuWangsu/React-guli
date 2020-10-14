import React, { useState } from 'react'
import { Card, Space, Form, Input, Cascader, Upload, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import './product.less'
const { Item } = Form
const { TextArea } = Input
/**
 * product 的添加和更新的子路由组件
 */

const ProductAddUpdate = (props) => {
  const [title] = useState(
    <Space>
      <LinkButton>
        <ArrowLeftOutlined style={{ fontSize: 20 }} onClick={() => props.history.goBack()} />
      </LinkButton>
      <span>添加商品</span>
    </Space>
  )
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
  };
  return (
    <Card title={title}>
      <Form {...layout}>
        <Item label="商品名称: ">
          <Input placeholder='请输入商品名称' />
        </Item>
        <Item label="商品描述: ">
          <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 5 }} />
        </Item>
        <Item label="商品价格: ">
          <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
      </Form>
    </Card>
  )
}
export default ProductAddUpdate