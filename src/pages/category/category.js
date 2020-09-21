import React, { useState } from 'react'
import { Card, Button, Table } from 'antd'
import {PlusOutlined} from '@ant-design/icons'
// 商品分类路由
const Category = (props) => {
    const [title, setTitle] = useState('一级分类列表') //card右侧
    const [extra, setExtra] = useState(<Button type="primary" icon={<PlusOutlined />}>添加</Button>)
    const dataSource = [
        {
          key: '1',
          name: '胡彦斌',
          age: 32,
          address: '西湖区湖底公园1号',
        },
        {
          key: '2',
          name: '胡彦祖',
          age: 42,
          address: '西湖区湖底公园1号',
        },
      ];
      
      const columns = [
        {
          title: '姓名',
          dataIndex: 'name',
          key: 'name',
        },
        {
          title: '年龄',
          dataIndex: 'age',
          key: 'age',
        },
        {
          title: '住址',
          dataIndex: 'address',
          key: 'address',
        },
      ];
    return (
        <Card title={title} extra={extra}>
            <Table 
                dataSource={dataSource} 
                columns={columns} />
        </Card>
    )
}
export default Category