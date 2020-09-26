import React, { useEffect, useImperativeHandle, forwardRef } from 'react'
import { Form, Input } from 'antd'

const Item = Form.Item
/**
 * 更新分类的form组件
 */
const UpdateForm = (props, ref) => {
    const [form] = Form.useForm()
    useEffect(() => {
        // form.setFieldsValue({ ...currentItem });
        form.setFieldsValue({ 'categoryName': props.categoryName.name })
      }, [props.categoryName.name])
    useImperativeHandle(ref, () => ({
        // onFinish 就是暴露给父组件的方法
        onFinish: () => {
            const name = form.getFieldValue('categoryName');
            props.setForm(name)
        },
        setCategoryName: () => {
            form.setFieldsValue({ 'categoryName': props.categoryName.name })
        }
    }))
    return (
        <Form form={form}>
            <Item
                name={'categoryName'}
                // initialValue={props.categoryName.name}
                rules={[
                    {
                        required: true,
                        message: '分类名称不能为空!',
                    },
                ]}>
                <Input placeholder='请输入分类名称'></Input>
            </Item>
        </Form>
    )
}

export default forwardRef(UpdateForm)
