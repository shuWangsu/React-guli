import React, { useEffect, useState } from 'react'
import { Card, List, Space } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import LinkButton from '../../components/link-button'
import { BASE_IMG_URL } from '../../utils/contant'
import './product.less'
import { reqCategory } from '../../api/index'
const Item = List.Item
/**
 * product 的详情子路由组件
 */

const ProductDetail = (props) => {
  const [title] = useState(
    <Space>
      <LinkButton>
        <ArrowLeftOutlined style={{ fontSize: 20 }} onClick={() => props.history.goBack()} />
      </LinkButton>
      <span>商品详情</span>
    </Space>
  )
  const { name, desc, price, detail, imgs, pCategoryId, categoryId } = props.location.state.product
  const [cName1, setCName1] = useState('')
  const [cName2, setCName2] = useState('')
  const getCategory = async () => {
    if (pCategoryId === '0') { //一级分类下的商品
      const result = await reqCategory(categoryId)
      const cName1 = result.data.name
      setCName1(cName1)
    } else { // 二级分类下的商品
      // 通过多个 await 方式发多个请求：
      //后面一个请求需要在前一个请求成功返回之后才发送,效率不行
      /*
      const result1 = await reqCategory(pCategoryId)  //获取一级分类列表
      const result2 = await reqCategory(categoryId)  //获取二级分类列表
      const cName1 = result1.data.name
      setCName1(cName1)
      const cName2 = result2.data.name
      setCName2(cName2)
      */

      // 使用 Promise.all 来一次性发送多个请求，只有都成功了，才正常处理
      const results = await Promise.all([reqCategory(pCategoryId), reqCategory(categoryId)])
      const cName1 = results[0].data.name
      const cName2 = results[1].data.name
      setCName1(cName1)
      setCName2(cName2)
    }
  }
  useEffect(() => {
    getCategory()
  }, [])
  return (
    <Card title={title} className="product-detail">
      <List>
        <Item>
          <div>
            <span className="left">商品名称：</span>
            <span>{name}</span>
          </div>
        </Item>
        <Item>
          <div>
            <span className="left">商品描述：</span>
            <span>{desc}</span>
          </div>
        </Item>
        <Item>
          <div>
            <span className="left">商品价格：</span>
            <span>{price}</span>
          </div>
        </Item>
        <Item>
          <div>
            <span className="left">所属分类：</span>
            <span>{cName1} {cName2 ? '--->' + cName2 : ''}</span>
          </div>
        </Item>
        <Item>
          <div>
            <span className="left">商品图片：</span>
            <span>
              {imgs.map(item =>
                <img
                  key={item}
                  className="product-img"
                  src={BASE_IMG_URL + item}
                  alt="img" />)}
            </span>
          </div>
        </Item>
        <Item>
          <div>
            <span className="left">商品详情：</span>
            <span dangerouslySetInnerHTML={{ __html: detail }}></span>
          </div>
        </Item>
      </List>
    </Card>
  )
}
export default ProductDetail