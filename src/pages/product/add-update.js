import React, { useEffect, useRef, useState } from 'react'
import { Card, Space, Form, Input, Cascader, Upload, Button, message } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { reqAddOrUpdateProduct, reqCategorys } from '../../api'
import './product.less'
import { useForm } from 'antd/lib/form/Form'
import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
const { Item } = Form
const { TextArea } = Input
/**
 * product 的添加和更新的子路由组件
 */
const ProductAddUpdate = (props) => {
  const pictureWall = useRef()
  const richTextEditor = useRef()
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

  // 根据categorys数组生成options数组
  const initOptions = async (categorys) => {
    const options = categorys.map(c => ({
      value: c._id,
      label: c.name,
      isLeaf: false,    //不是叶子
    }))
    // 如果是一个二级分类商品的更新
    const { pCategoryId } = props.location.state || {}
    if (props.location.state && pCategoryId !== '0') {
      // 获取对应的二级分类列表
      const subCategorys = await getCategorys(pCategoryId)
      // 生成二级下拉列表的options
      const childOptions = subCategorys.map(c => ({
        value: c._id,
        label: c.name,
        isLeaf: true
      }))
      // 找到当前商品对应的一级option对象
      const targetOption = options.find(option => option.value === pCategoryId)
      // 关联对应的一级的option上
      targetOption.children = childOptions
    }
    setOptions(options)
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

  const [form] = useForm()
  // 获取从修改跳转过来的信息
  const getChangeValue = () => {
    const value = props.location.state || {}
    const { pCategoryId, categoryId } = value
    if (Object.keys(value).length !==0) {
      if (pCategoryId === '0') {
        arrIds.push(categoryId)
      } else {
        arrIds.push(pCategoryId)
        arrIds.push(categoryId)
      }
      form.setFieldsValue({ 'productName': value.name })
      form.setFieldsValue({ 'productDesc': value.desc })
      form.setFieldsValue({ 'productPrice': value.price })
      form.setFieldsValue({ 'productFenlei': arrIds })
    }
  }

  // 点击提交触发onfinish
  const onFinish = async (values) => {
    console.log('values', values)
    const imgs = pictureWall.current.getImgs()
    const details = richTextEditor.current.getDetail()
    const { productName, productDesc, productPrice, productFenlei } = values
    let pCategoryId, categoryId
    if (productFenlei.length === 1) {
      pCategoryId = '0'
      categoryId = productFenlei[0]
    } else {
      pCategoryId = productFenlei[0]
      categoryId = productFenlei[1]
    }
    const product = {
      name: productName,
      desc: productDesc,
      price: productPrice,
      imgs,
      detail: details,
      pCategoryId,
      categoryId
    }

    // 如果是更新，需要添加_id
    if (props.location.state) {
      product._id = props.location.state._id
    }
    // 调用接口请求函数去添加/更新
    const result = await reqAddOrUpdateProduct(product)
    // 根据结果提示
    if (result.status === 0) {
      message.success(`${props.location.state ? '更新' : '添加'}商品成功`)
      props.history.goBack()
    } else {
      message.error(`${props.location.state ? '更新' : '添加'}商品失败`)
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
          />
        </Item>
        <Item label="商品图片: ">
          <PicturesWall ref={pictureWall} imgs={props.location.state ? props.location.state.imgs : null} />
        </Item>
        <Item label="商品详情: " labelCol={{ span: 2 }} wrapperCol={{ span: 20 }}>
          <RichTextEditor ref={richTextEditor} details={props.location.state ? props.location.state.detail : null} />
        </Item>
        <Item>
          <Button type="primary" htmlType='submit'>提交</Button>
        </Item>
      </Form>
    </Card>
  )
}
export default ProductAddUpdate



/**
 * 1.子组件调用父组件的方法：将父组件的方法以函数属性的形式传递给子组件，子组件就可以调用
 * 2.父组件调用子组件的方法：在父组件中通过 ref 得到子组件标签对象（也就是组件对象），调用其方法
 */

/**
 * 使用ref （class组件）
 * 1.创建ref容器：this.pw = React.createRef()
 * 2.将ref容器交给需要获取的标签元素： <Picture ref={this.pw} />
 * 3.通过ref容器读取标签元素 ：this.pw.current.xxxx
 *
 * 函数组件
 * 1.父组件 在函数组件类定义   const pictureWall = useRef()
 * 2.传给子组件：<PicturesWall ref={pictureWall}/>
 * 3.子组件使用forwardRef包裹  export default forwardRef(PicturesWall)
 * 4.使用useImperativeHandle暴露要传给父组件的内容
 *  useImperativeHandle(ref, () => ({
       // 获取所有已上传图片文件名的数组
       getImgs: () => {
           return fileList.map(file => file.name)
       }
   }))
 */