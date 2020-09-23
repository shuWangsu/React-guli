import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqCategorys } from '../../api/index'
// 商品分类路由
const Category = (props) => {
  const [title, setTitle] = useState('一级分类列表') //card左侧
  const [extra, setExtra] = useState(<Button type="primary" icon={<PlusOutlined />}>添加</Button>)
  const [categorys, setCategorys] = useState([]) //一级分类列表
  const [loading, setLoading] = useState(false) //是否正在获取数据,显示loading
  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name', //显示数据对应的属性名
    },
    {
      title: '操作',
      width: 350,
      render: (text, record) => ( // 
        <Space size="middle">
          <a>修改分类</a>
          <a>查看子分类</a>
        </Space>
      )

    }
  ];
  //初始化table所有列的数组
  const initColumns = async () => {
    //在发请求前,显示loading
    setLoading(true)
    //异步获取一级分类列表
    console.log('aass11111')
    const result = await reqCategorys('0')
    //在请求完成后,获取数据
    setLoading(false)
    if (result.status === 0) {
      const categorys = result.data
      setCategorys(categorys)
    } else {
      message.error('获取分类列表失败')
    }
  }
  useEffect(() => {
    initColumns()
  }, [])
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={categorys}
        columns={columns}
        bordered
        rowKey='_id'
        pagination={{ defaultPageSize: 8, showQuickJumper: true }}
        loading={loading} />
    </Card>
  )
}
export default Category