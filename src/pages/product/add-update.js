import React, { useEffect, useState } from 'react'
import { Card, Space, Form, Input, Cascader, Upload, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqCategorys } from '../../api'
import './product.less'
import { useForm } from 'antd/lib/form/Form'
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
      <span>{props.location.state ? '修改商品' : '添加商品'}</span>
    </Space>
  )
  // const [changeValue, setChangeValue] = useState({})
  const [options, setOptions] = useState([])
  let arrIds = []
  const layout = {
    labelCol: { span: 2 },
    wrapperCol: { span: 10 },
  }
  // 点击提交触发onfinish
  const onFinish = (values) => {
    console.log('Success:', values)
  }

  // 根据categorys数组生成options数组
  const initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,    //不是叶子
    }))
    console.log('kkk',options)
    // 如果是一个二级分类商品的更新
    const {pCategoryId} = props.location.state
    if (props.location.state && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value:c._id,
        label:c.name,
        isLeaf:true
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联对应的一级的option上
      targetOption.children = childOptions
      console.log('xxx',options)
    }
    setOptions(options)
  }
  /**
   * 获取一级/二级分类列表，并显示
   * @param {*} selectedOptions 
   */
  const getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
      const categorys = result.data
      // 判断 如果还是一级分类列表
      if (parentId === '0') {
        initOptions(categorys)
      } else {   //二级列表
        // 返回二级列表 ==》 当前async函数返回的promise就会成功且value为categorys
        return categorys
      }

    }
  }
  const loadData = async selectedOptions => {
    // 得到选择的option对象
    const targetOption = selectedOptions[selectedOptions.length - 1]
    // 显示 loading
    targetOption.loading = true
    // 根据选中的分类，请求获取二级分类列表
    const subCategorys = await getCategorys(targetOption.value)
    if (subCategorys && subCategorys.length > 0) {
      // 生成一个二级列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 关联到当前option上
      targetOption.children = childOptions
    } else { //当前选中的分类没有二级分类
      targetOption.isLeaf = true
    }
    targetOption.loading = false
    setOptions([...options])
  }
  const onChange = (value, selectedOptions) => {
    console.log(value, selectedOptions)
  }
  const [form] = useForm()
  // 获取从修改跳转过来的信息
  const getChangeValue = () => {
    const value = props.location.state || {}
    const { pCategoryId, categoryId} = value
    if (value !== {}){
      if (pCategoryId === '0') {
        arrIds.push(categoryId)
      } else {
        arrIds.push(pCategoryId)
        arrIds.push(categoryId)
      }
      form.setFieldsValue({ 'productName': value.name })
      form.setFieldsValue({ 'productDesc': value.desc })
      form.setFieldsValue({ 'productPrice': value.price })
      form.setFieldsValue({'productFenlei': arrIds})
    }
    
  }
  useEffect(() => {
    getCategorys('0')
    getChangeValue()
  }, [])
  return (
    <Card title={title}>
      <Form
        {...layout}
        onFinish={onFinish}
        form={form}
        name="kkk" >
        <Item
          label="商品名称: "
          name="productName"
          rules={[
            {
              required: true,
              message: '商品名称不能为空!',
            },
          ]} >
          <Input placeholder='请输入商品名称' value='1' />
        </Item>
        <Item
          label="商品描述: "
          name="productDesc"
          // initialValue={changeValue.desc}
          rules={[
            {
              required: true,
              message: '商品描述不能为空!',
            },
          ]}>
          <TextArea placeholder='请输入商品描述' autoSize={{ minRows: 2, maxRows: 5 }} />
        </Item>
        <Item
          label="商品价格: "
          name="productPrice"
          // initialValue={changeValue.price}
          rules={[
            {
              required: true,
              message: '商品价格不能为空!',
            },
            ({ getFieldValue }) => ({
              validator (rule, value) {
                if (value && value * 1 > 0) {
                  return Promise.resolve()
                }
                if (value && value * 1 <= 0) {
                  return Promise.reject('商品价格必须大于0')
                }
                return Promise.resolve()
              },
            }),
          ]}>
          <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
        <Item
          label="商品分类: "
          name="productFenlei"
          rules={[
            {
              required: true,
              message: '必须选择商品分类',
            }
          ]}>
          <Cascader
            options={options}
            loadData={loadData}
            onChange={onChange}
            changeOnSelect
          />
        </Item>
        <Item label="商品图片: ">
          <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
        <Item label="商品详情: ">
          <Input type='number' placeholder='请输入商品价格' addonAfter='元' />
        </Item>
        <Item label="商品详情: ">
          <Button type="primary" htmlType='submit'>提交</Button>
        </Item>
      </Form>
    </Card>
  )
}
export default ProductAddUpdate