import React, { useEffect, useState } from 'react'
import { Card, Button, Table, Space, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqCategorys } from '../../api/index'
import LinkButton from '../../components/link-button'
import { ArrowRightOutlined } from '@ant-design/icons'
import AddForm from './add-form'
// 商品分类路由
const Category = (props) => {
  const [title, setTitle] = useState('一级分类列表') //card左侧
  const [extra, setExtra] = useState(<Button type="primary" icon={<PlusOutlined />} onClick={() => showAdd()}>添加</Button>)
  const [categorys, setCategorys] = useState([]) //一级分类列表
  const [parentId, setParentId] = useState('0')  //当前需要显示的分类列表的父分类的ID
  const [parentName, setParentName] = useState('')
  const [subCategorys, setSubCategorys] = useState([]) //二级分类列表
  const [loading, setLoading] = useState(false) //是否正在获取数据,显示loading
  //标识添加/更新的确认框 0:都不显示,1:显示添加,2:显示更新
  const [showStatus, setShowStatus] = useState(0)

  const columns = [
    {
      title: '分类名称',
      dataIndex: 'name', //显示数据对应的属性名
    },
    {
      title: '操作',
      width: 350,
      render: (record) => ( // 
        <Space size="middle">
          <LinkButton onClick={() => showUpdate()}>修改分类</LinkButton>
          {parentId === '0' ? <LinkButton onClick={() => { showSubCategorys(record) }}>查看子分类</LinkButton> : null}
        </Space>
      )
    }
  ];
  //初始化table所有列的数组
  const getCategorys = async () => {
    //在发请求前,显示loading
    setLoading(true)
    //异步获取一级分类列表
    const result = await reqCategorys(parentId)
    //在请求完成后,获取数据
    setLoading(false)
    if (result.status === 0) {
      // 取出分类数组（可能是一级也可能是二级）
      const categorys = result.data
      if (parentId === '0') {
        // 更新一级分类状态
        setCategorys(categorys)
      } else {
        // 更新二级分类状态
        setSubCategorys(categorys)
      }
    } else {
      message.error('获取分类列表失败')
    }
  }
  useEffect(() => {
    getCategorys()
  }, [])
  // 显示一级分类列表
  const showFirstCategorys = () => {
    setParentId('0')
    setParentName('')
    setSubCategorys([])
  }
  // 显示二级分类
  const showSubCategorys = async (record) => {
    // 更新状态
    setParentId(record._id)
    setParentName(record.name)
  }
  useEffect(() => {
    const changeTitle = parentId === '0' ? '一级分类列表' : (
      <Space>
        <LinkButton onClick={showFirstCategorys}>一级分类列表</LinkButton>
        <ArrowRightOutlined />
        <span>{parentName}</span>
      </Space>
    )
    setTitle(changeTitle)
    getCategorys()
  }, [parentId])
  // 点击添加按钮
  const showAdd = () => {
    setShowStatus(1)
  }
  // 点击修改分类
  const showUpdate = () => {
    setShowStatus(2)
  }
  // 响应点击取消:隐藏确认框
  const handleCancel = () => {
    setShowStatus(0)
  }
  // 添加分类
  const addCategory = () => {
    setShowStatus(0)
  }
  //修改分类
  const updateCategory = () => {
    setShowStatus(0)
  }
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={parentId === '0' ? categorys : subCategorys}
        columns={columns}
        bordered
        rowKey='_id'
        pagination={{ defaultPageSize: 8, showQuickJumper: true }}
        loading={loading}
      />
      <Modal
        title="添加分类"
        visible={showStatus === 1}
        onOk={addCategory}
        onCancel={handleCancel}
      >
        <AddForm />
      </Modal>
      <Modal
        title="修改分类"
        visible={showStatus === 2}
        onOk={updateCategory}
        onCancel={handleCancel}
      >
      </Modal>
    </Card>
  )
}
export default Category