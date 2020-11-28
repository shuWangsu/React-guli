import React, { useEffect, useState } from 'react'
import { Card, Select, Input, Button, Table, message, } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button/index'
import { reqProducts, reqSearchProducts, reqUpdateStatus } from '../../api/index'
import { PAGE_SIZE } from '../../utils/contant'
const { Option } = Select
/**
 * product 的默认子路由组件
 */

const ProductHome = (props) => {
  const [products, setProducts] = useState([]) //页面数据
  const [total, setTotal] = useState(0)   //总页数
  const [loading, setLoading] = useState(false)
  const [searchName, setSearchName] = useState('')  //搜索关键字
  const [searchType, setSearchType] = useState('productName')  //搜索类型
  const [pageNum, setPageNum] = useState(1)
  const title = (
    <span>
      <Select style={{ width: 130 }} onChange={(value) => { setSearchType(value) }} value={searchType}>
        <Option value='productName'>按名称搜索</Option>
        <Option value='productDesc'>按描述搜索</Option>
      </Select>
      <Input
        placeholder='关键字'
        style={{ width: 150, margin: '0 15px' }}
        value={searchName}
        onChange={(e) => { setSearchName(e.target.value) }}
      />
      <Button type='primary' onClick={() => { getProducts(1) }}>搜索</Button>
    </span>
  )
  const extra = (
    <Button 
      type='primary' 
      icon={<PlusOutlined />}
      onClick={() => props.history.push('/product/addupdate')} >添加商品</Button>
  )
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
      // dataIndex: 'status',
      render: (product) => {
        const {status, _id} = product
        return (
          <span>
            <Button 
              type='primary' 
              style={{ marginRight: 15 }} 
              onClick={() => updateStatus(_id,status === 1 ? 2 : 1)}
              >
                {status === 1 ? '下架' : '上架'}
              </Button>
            <span>{status === 1 ? '在售' : '已下架'}</span>
          </span>
        )
      },
      width: 120
    },
    {
      title: '操作',
      render: (product) => {
        return (
          <span>
            <LinkButton onClick={ () => props.history.push('/product/detail', { product })}>详情</LinkButton>
            <LinkButton onClick={ () => props.history.push('/product/addupdate', product) }>修改</LinkButton>
          </span>
        )
      },
      width: 80
    }
  ]
  const getProducts = async (pageNum) => {
    let result
    setPageNum(pageNum)
    setLoading(true)
    if (searchName !== '') { //如果搜索关键字有值，说明我们要做搜索分页
      result = await reqSearchProducts({ pageNum, pageSize: PAGE_SIZE, searchName, searchType })
    } else { //一般分页
      result = await reqProducts(pageNum, PAGE_SIZE)
    }
    setLoading(false)
    if (result.status === 0) {
      const { total, list } = result.data
      console.log('list',list)
      setTotal(total)
      setProducts(list)
    }
  }
  // 更新指定商品装态
  const updateStatus = async (productId, status) => {
    const result = await reqUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('更新商品成功')
      getProducts(pageNum)
    }
  }
  useEffect(() => {
    getProducts(1)
  }, [])
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={products}
        columns={columns}
        rowKey='_id'
        bordered
        pagination={{
          current: pageNum,
          total: total,
          defaultPageSize: PAGE_SIZE,
          showQuickJumper: true,
          onChange: (pageNum) => {
            getProducts(pageNum)
          }
        }}
        loading={loading} />
    </Card>
  )
}
export default ProductHome