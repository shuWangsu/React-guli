/**
 * 用来指定商品详情的富文本编辑器
 */
import React, { useState, useImperativeHandle, forwardRef, useEffect } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


const RichTextEditor = (props, ref) => {
    const [editorState, setEditorState] = useState()
    const details = props.details
    // 输入过程中实时的回调
    const onEditorStateChange = (editorState) => {
        setEditorState(editorState)
    }
    useImperativeHandle(ref, () => ({
        getDetail: () => {
            // 返回输入数据对应的HTML格式的文本
            return draftToHtml(convertToRaw(editorState.getCurrentContent()))
        }
    }))
    const uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                xhr.setRequestHeader('Authorization', 'Client-ID xx')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url.slice(29) //得到图片的URL
                    resolve({ data: { link: 'http://39.100.225.255:5000/upload/' + url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }
    useEffect(() => {
        if (details) {
            const contentBlock = htmlToDraft(details)
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
            const editorState = EditorState.createWithContent(contentState)
            setEditorState(editorState)
        } else {
            setEditorState(EditorState.createEmpty())  //创建一个没有内容的编辑对象
        }
    }, [])
    return (

        <Editor
            editorState={editorState}
            onEditorStateChange={onEditorStateChange}
            editorStyle={{ border: '1px solid black', height: 200, paddingLeft: 10 }}
            toolbar={{
                image: { uploadCallback: uploadImageCallBack, alt: { present: true, mandatory: true } }
            }}
        />
        // {/* <textarea
        //     disabled
        //     value={draftToHtml(convertToRaw(editorState.getCurrentContent()))}
        // /> */}

    )
}
export default forwardRef(RichTextEditor)