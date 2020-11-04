import React, { useEffect, useImperativeHandle, forwardRef, useState } from 'react'
import { Form, Input, Tree } from 'antd'

import menuList from '../../config/menuConfig'
const Item = Form.Item
/**
 * 添加分类的form组件
 */
const AuthForm = (props, ref) => {
  const [form] = Form.useForm()
  const [role, setRole] = useState()
  const [treeList, setTreeList] = useState([{
    title:'平台权限',
    key: '0-1',
    children: menuList
  }])
  const [checkedKeys, setCheckedKeys] = useState(props.role.menus)
  useImperativeHandle(ref, () => ({
    // onFinish 就是暴露给父组件的方法
    onFinish: () => {
    }
  }))
  const getTreeNodes = () => {
    let list = [{
      title:'平台权限',
      key: '0-1',
      children: menuList
    }]
    setTreeList(list)
    
  }

  const onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };

  const onCheck = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info);
  };
  useEffect(() => {
    setRole(props.role.name)
    // getTreeNodes()
  }, [props.role])
  return (
    <Form form={form}>
      <Item
        label='角色名称'>
        <Input value={role} disabled />
      </Item>
      <Tree
        checkable
        defaultExpandAll={true}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={treeList}
        checkedKeys={checkedKeys}
      />
    </Form>
  )
}

export default forwardRef(AuthForm)
