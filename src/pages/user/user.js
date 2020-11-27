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
import { reqUsers, reqDeleteUser } from '../../api'
import UserForm from './user-form'
// 用户路由
const User = (props) => {
    const [showStatus, setShowStatus] = useState(0)
    const [title] = useState(<Button type='primary' onClick={() =>createUser()}>创建用户</Button>)
    const [modalTitle, setModalTitle] = useState('添加用户')
    const [users, setUsers] = useState([])
    const [roles, setRoles] = useState([])
    const [roleNames, setRoleNames] = useState({})
    const [userInfo,setUserInfo] = useState({})
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
                    <LinkButton onClick={() => modifyUser(user)}>修改</LinkButton>
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
    // 修改用户信息
    const modifyUser = (user) => {
        setModalTitle('修改用户')
        setShowStatus(1)
        setUserInfo(user)

    }
    // 点击创建用户按钮
    const createUser = () => {
        setShowStatus(1)
        setUserInfo({})
    }
    const initRoleNames = (roles) => {
        const roleNames = roles.reduce((pre, role) => {
            pre[role._id] = role.name
            return pre
        }, {})
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
    const showModal = (val) => {
        setShowStatus(val)
    }
    const handleCancel = e => {
        setShowStatus(0)
    };
    useEffect(() => {
        getUsers()
    }, [])
    return (
        <Card title={title}>
            <Table
                dataSource={users}
                columns={columns}
                bordered
                rowKey='_id'
                pagination={{ defaultPageSize: 8, showQuickJumper: true }} />
            <Modal
                title={modalTitle}
                visible={showStatus === 1}
                onCancel={handleCancel}
                footer={null}
                destroyOnClose={true} >
                <UserForm
                    roles={roles}
                    ref={addUser}
                    userInfo={userInfo}
                    showModal={showModal}
                    getUsers={getUsers} />
            </Modal>
        </Card>
    )
}
export default User