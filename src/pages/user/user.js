import React, { useEffect, useRef, useState } from 'react'
import {
    Card,
    Button,
    Table,
    Modal,
    message
} from 'antd'
import { formateDate } from '../../utils/dataUtils'
import LinkButton from '../../components/link-button'
import { reqUsers, reqDeleteUser, reqAddUser } from '../../api'
import UserForm from './user-form'
// 用户路由
const User = (props) => {
    const [showStatus, setShowStatus] = useState(0)
    const [title, setTitle] = useState(<Button type='primary' onClick={() => setShowStatus(1)}>创建用户</Button>)
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [roleNames, setRoleNames] = useState({})
    const addUser = useRef()
    const columns = [
        {
            title: '用户名',
            dataIndex: 'username'
        },
        {
            title: '邮箱',
            dataIndex: 'email'
        },
        {
            title: '电话',
            dataIndex: 'phone'
        },
        {
            title: '注册时间',
            dataIndex: 'create_time',
            render: formateDate
        },
        {
            title: '所属角色',
            dataIndex: 'role_id',
            render: role_id => roleNames[role_id]
        },
        {
            title: '操作',
            render: (user) => (
                <span>
                    <LinkButton>修改</LinkButton>
                    <LinkButton onClick={() => deleteUser(user)}>删除</LinkButton>
                </span>
            )
        },
    ]
    // 添加或修改用户
    const addOrUpdateUser = () => {
        // 1、收集输入数据
        addUser.current.onFinish()
    }
    // 删除指定用户
    const deleteUser = (user) => {
        Modal.confirm({
            title: `确认删除${user.username}吗?`,
            onOk: async () => {
                const result = await reqDeleteUser(user._id)
                if (result.status === 0) {
                    message.success('删除用户成功')
                    getUsers()
                }
            },
        })
    }
    const initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        },{})
        setRoleNames(roleNames)
    }
    const getUsers = async () => {
        const result = await reqUsers()
        if (result.status === 0) {
            message.success('加载数据成功')
            const { users, roles } = result.data
            setUsers(users)
            setRoles(roles)
            initRoleNames(roles)
        }
    }
    useEffect(() => {
        getUsers()
    },[])
    return (
        <Card title={title}>
            <Table
                dataSource={users}
                columns={columns}
                bordered
                rowKey='_id'
                pagination={{ defaultPageSize: 8, showQuickJumper: true }} />
            <Modal
                title="添加用户"
                visible={showStatus === 1}
                onOk={addOrUpdateUser}
                onCancel={() => setShowStatus(0)} >
                <UserForm 
                    roles={roles}
                    ref={addUser} />
            </Modal>
        </Card>
    )
}
export default User