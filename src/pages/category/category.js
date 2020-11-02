import React, { useEffect, useState, useRef } from 'react'
import { Card, Button, Table, Space, message, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqCategorys, reqUpdateCategory, reqAddCategory } from '../../api/index'
import LinkButton from '../../components/link-button'
import { ArrowRightOutlined } from '@ant-design/icons'
import AddForm from './add-form'
import UpdateForm from './update-form'
// 商品分类路由
const Category = (props) => {
  const [title, setTitle] = useState('一级分类列表') //card左侧
  const extra = (<Button type="primary" icon={<PlusOutlined />} onClick={() => showAdd()}>添加</Button>)
  const [categorys, setCategorys] = useState([]) //一级分类列表
  const [parentId, setParentId] = useState('0')  //当前需要显示的分类列表的父分类的ID
  const [parentName, setParentName] = useState('')
  const [subCategorys, setSubCategorys] = useState([]) //二级分类列表
  const [loading, setLoading] = useState(false) //是否正在获取数据,显示loading
  //标识添加/更新的确认框 0:都不显示,1:显示添加,2:显示更新
  const [showStatus, setShowStatus] = useState(0)
  const [categoryName, setCategoryName] = useState({})  //修改分类对象-》传到子组件
  const childRef = useRef()
  const saveNameRef = useRef()
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
          <LinkButton onClick={() => showUpdate(record)}>修改分类</LinkButton>
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
        <LinkButton onClick={() => { showFirstCategorys() }}>一级分类列表</LinkButton>
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
  const showUpdate = (record) => {
    // 保存分类对象
    setCategoryName(record)
    setShowStatus(2)
  }
  // 响应点击取消:隐藏确认框
  const handleCancel = (status) => {
    if (status === 1) {
      saveNameRef.current.initCategoryName()
    } else if (status === 2) {
      childRef.current.setCategoryName()
    }
    setShowStatus(0)
  }
  // 添加分类
  const addCategory = () => {
    saveNameRef.current.onFinish()
  }
  const trans = async (name) => {
    console.log('name1', name)
    if (name.trim() !== '') {
      // 1.发请求更新分类
      const categoryId = categoryName._id
      const result = await reqUpdateCategory({ categoryId, categoryName: name })
      // 2.重新显示列表
      if (result.status === 0) {
        getCategorys()
      } else {
        message.error('更新分类失败')
      }
      //隐藏确认框
      setShowStatus(0)
    } else {
      message.error('修改分类不能为空!')
    }
  }
  const addCategoryName = async (name = '', ID) => {
    if (name.trim() !== '') {
      const result = await reqAddCategory(name, ID)
      if (result.status === 0) {
        // 添加的分类是当前选中的分类
        if (parentId === ID) {
          // 重新获取当前分类列表显示
          getCategorys()
        }
      } else {
        message.error('添加分类失败')
      }
      setShowStatus(0)
    } else {
      message.error('添加分类不能为空!')
    }
  }
  //修改分类
  const updateCategory = () => {
    childRef.current.onFinish()
  }
  return (
    <Card title={title} extra={extra}>
      <Table
        dataSource={parentId === '0' ? categorys : subCategorys}
        columns={columns}
        bordered
        rowKey='_id'
        pagination={{ defaultPageSize: 8, showQuickJumper: true }}
        loading={loading} />
      <Modal
        title="添加分类"
        visible={showStatus === 1}
        onOk={addCategory}
        onCancel={() => { handleCancel(showStatus) }} >
        <AddForm
          categorys={categorys}
          parentId={parentId}
          saveForm={(addName, ID) => { addCategoryName(addName, ID) }}
          ref={saveNameRef} />
      </Modal>
      <Modal
        title="修改分类"
        visible={showStatus === 2}
        onOk={updateCategory}
        onCancel={() => { handleCancel(showStatus) }} >
        <UpdateForm
          categoryName={categoryName}
          setForm={(name) => { trans(name) }}
          ref={childRef} />
      </Modal>
    </Card>
  )
}
export default Category