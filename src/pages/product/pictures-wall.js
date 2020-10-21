import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { Upload, Modal, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { reqDeleteImg } from '../../api'
import { BASE_IMG_URL } from '../../utils/contant'

const PicturesWall = (props, ref) => {
    const [fileList, setFileList] = useState([])
    const [previewVisible, setPreviewVisible] = useState(false)
    const [previewImage, setPreviewImage] = useState('')
    const [previewTitle, setPreviewTitle] = useState('')
    const getBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    const handleCancel = () => {
        setPreviewVisible(false)
    }

    const handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview)
        setPreviewVisible(true)
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
    };
    /**
     * @param {fileList} 所有已上传图片文件对象的数组
     * file:当前操作的图片文件（上传/删除）
     */
    const handleChange = async ({ file, fileList }) => {
        // 上传成功，将当前上传的file信息修正（name,url）
        if (file.status === 'done') {
            const result = file.response
            if (result.status === 0) {
                message.success('上传图片成功')
                const { name, url } = result.data
                file = fileList[fileList.length - 1]
                file.name = name
                file.url = url
            } else {
                message.error('上传图片失败')
            }
        } else if (file.status === 'removed') { //删除图片
            const result = await reqDeleteImg(file.name)
            if (result.status === 0) {
                message.success('删除图片成功')
            } else {
                message.error('删除图片失败')
            }
        }
        setFileList(fileList)
    }

    //将子组件的值传给父组件 
    useImperativeHandle(ref, () => ({
        // 获取所有已上传图片文件名的数组
        getImgs: () => {
            return fileList.map(file => file.name)
        }
    }))
    useEffect(() => {
        //将传过来的数组转换成filelist需要的数据
        const { imgs } = props
        let fileArr = []
        if (imgs && imgs.length > 0) {
            fileArr = imgs.map((img, index) => ({
                uid: -index, //每个file都有自己的唯一的id
                name: img, //图片文件名
                status: 'done', //图片状态：done已上传，uploading：正在上传中， removed：已删除
                url: BASE_IMG_URL + img
            }))
        }
        setFileList(fileArr)
    },[])
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    )
    return (
        <>
            <Upload
                action="/manage/img/upload"   //图片上传接口地址
                listType="picture-card"
                accept='image/*'
                name='image'  //请求参数名
                fileList={fileList}   //所有已上传的图片文件对象的数值
                onPreview={handlePreview}
                onChange={handleChange}
            >
                {fileList.length >= 3 ? null : uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </>
    );
}
export default forwardRef(PicturesWall)