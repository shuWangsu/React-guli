import React, { useEffect, useRef, useState } from 'react'
import { Card, Button, Table } from 'antd'
import { reqRoles } from '../../api'
import Modal from 'antd/lib/modal/Modal'
import AddForm from './add-form'
// 路由
const Role = (props) => {
    const [roles, setRoles] = useState([]) //所有角色列表
    const [role, setRole] = useState({}) //选中的角色
    const [columns, setColumns] = useState([])
    const [showStatus, setShowStatus] = useState(0)
    const addRoleName = useRef()
    const initColumn = () => {
        setColumns([
            {
                title: '角色名称',
                dataIndex: 'name'
            },
            {
                title: '创建时间',
                dataIndex: 'create_time'
            },
            {
                title: '授权时间',
                dataIndex: 'auth_time'
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
        setShowStatus(0)
    }
    const handleCancel = () => [
        setShowStatus(0)
    ]
    const showModal = () => {
        setShowStatus(1)
    }
    useEffect(() => {
        initColumn()
        getRoles()
    }, [])
    const title = (
        <span>
            <Button type='primary' onClick={showModal}>创建角色</Button>&nbsp;&nbsp;
            <Button type='primary' disabled={!role._id}>设置角色权限</Button>
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
                    saveForm={console.log(1) }
                    ref={addRoleName} />
            </Modal>
        </Card>
    )
}
export default Role