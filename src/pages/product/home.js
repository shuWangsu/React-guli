import React, { useState } from 'react'
import { Card, Select, Input, Button, Table, } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button/index'
const { Option } = Select
/**
 * product 的默认子路由组件
 */

const ProductHome = (props) => {
  const [title, setTitle] = useState(
    <span>
      <Select value='1' style={{ width: 130 }}>
        <Option value='1'>按名称搜索</Option>
        <Option value='2'>按描述搜索</Option>
      </Select>
      <Input placeholder='关键字' style={{ width: 150, margin: '0 15px' }} />
      <Button type='primary'>搜索</Button>
    </span>
  )

  const [extra, setExtra] = useState(
    <Button type='primary' icon={<PlusOutlined />}>添加商品</Button>
  )

  const [products, setProducts] = useState([])

  const columns = [
    {
      title: '商品名称',
      dataIndex: 'name',
      width: 160
    },
    {
      title: '商品描述',
      dataIndex: 'desc',
      width: 380
    },
    {
      title: '价格',
      dataIndex: 'price',
      render: (price) => '￥' + price,   //当前指定了对应的属性,传入的是对应的属性值
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (status) => {
        return (
          <span>
            <Button type='primary'>下架</Button>
            <span>在售</span>
          </span>
        )
      },
      width: 120
    },
    {
      title: '操作',
      dataIndex: 'product',
      render: (product) => {
        return (
          <span>
            <LinkButton>详情</LinkButton>
            <LinkButton>修改</LinkButton>
          </span>
        )
      },
      width: 80
    }
  ]

  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={products}
        columns={columns}
        rowKey='_id'
        bordered />
    </Card>
  )
}
export default ProductHome