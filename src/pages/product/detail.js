import React, { useState } from 'react'
import { Card, List, Space} from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
const Item = List.Item
/**
 * product 的详情子路由组件
 */

const ProductDetail = (props) => {
  const [title, setTitle] = useState(
    <Space>
      <ArrowLeftOutlined />
      <span>商品详情</span>
    </Space>
  )
  return (
    <Card title={title} className="product-detail">
      <List>
        <Item>
          <span className="left">商品名称：</span>
          <span>联想ThinkPad嘻嘻嘻</span>
        </Item>
        <Item>
          <span className="left">商品名称：</span>
          <span>联想ThinkPad嘻嘻嘻</span>
        </Item>
      </List>
    </Card>
  )
}
export default ProductDetail