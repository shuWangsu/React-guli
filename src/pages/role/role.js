import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Table, message } from 'antd'
import { reqRoles, reqAddRole, reqUpdateRole } from '../../api'
import Modal from 'antd/lib/modal/Modal'
import AddForm from './add-form'
import AuthForm from './auth-form'
import memoryUtils from '../../utils/memoryUtils'
import { formateDate } from '../../utils/dataUtils'
// 路由
const Role = (props) => {
    const [roles, setRoles] = useState([]) //所有角色列表
    const [role, setRole] = useState({}) //选中的角色
    const [columns, setColumns] = useState([])
    const [showStatus, setShowStatus] = useState(0)
    const addRoleName = useRef()
    const getRoleList = useRef()
    const initColumn = () => {
        setColumns([
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time',
                render: (create_time) => formateDate(create_time)
                
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time',
                render: formateDate
            },
            {
                title: '授权人',
                dataIndex: 'auth_name'
            }
        ])
    }
    // 获取所有角色列表
    const getRoles = async () => {
        const result = await reqRoles()
        if (result.status === 0) {
            const roles = result.data
            setRoles(roles)
        }
    }
    const onRow = (role) => {
        return {
            onClick: event => {
                setRole(role)
            }
        }
    }
    // 添加角色
    const addRole = () => {
        // 调用子组件的函数
        addRoleName.current.onFinish()
    }
    // 设置角色权限
    const updateRole = async () => {
        setShowStatus(0)
        // 得到最新的权限信息
        const list = getRoleList.current.onFinish()
        role.menus = list
        role.auth_time = Date.now()
        role.auth_name = memoryUtils.user.username
        // 请求更新
        const result = await reqUpdateRole(role)
        if (result.status === 0) {
            message.success('更新角色权限成功')
            getRoles()
        } else {
            message.error('更新角色权限失败')
        }
    }
    const handleCancel = () => {
        setShowStatus(0)
        getRoleList.current.resetKeys()
    }


    // 获得从子组件传过来的角色名称
    const getRoleName = async (name = '') => {
        if (name.trim() !== '') {
            //隐藏确认框
            setShowStatus(0)
            const result = await reqAddRole(name)
            if (result.status === 0) {
                message.success('添加角色成功')
                // getRoles()
                setRoles([...roles, result.data])
            } else {
                message.error('添加角色失败')
            }

        } else {
            message.error('角色内容不能为空!')
        }
    }
    useEffect(() => {
        initColumn()
        getRoles()
    }, [])
    const title = (
        <span>
            <Button type='primary' onClick={() => { setShowStatus(1) }}>创建角色</Button>&nbsp;&nbsp;
            <Button type='primary' disabled={!role._id} onClick={() => { setShowStatus(2) }}>设置角色权限</Button>
        </span>
    )
    return (
        <Card title={title}>
            <Table
                bordered
                rowKey='_id'
                dataSource={roles}
                columns={columns}
                pagination={{ defaultPageSize: 5 }}
                rowSelection={{ type: 'radio', selectedRowKeys: [role._id] }}
                onRow={onRow}
            />
            <Modal
                title="添加角色"
                visible={showStatus === 1}
                onOk={addRole}
                onCancel={handleCancel} >
                <AddForm
                    saveForm={getRoleName}
                    ref={addRoleName} />
            </Modal>

            <Modal
                title="设置角色权限"
                visible={showStatus === 2}
                onOk={updateRole}
                onCancel={handleCancel} >
                <AuthForm
                    role={role}
                    ref={getRoleList} />
            </Modal>
        </Card>
    )
}
export default Role