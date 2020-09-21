import React, { useState, useEffect } from 'react'
import { formateDate } from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import storageUtils from '../../utils/storageUtils'
import { reqWeather, reqCity } from '../../api'
import { withRouter } from 'react-router-dom'
import menuList from '../../config/menuConfig'
import { Modal } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons';
import LinkButton from '../link-button'
import './index.less'
const { confirm } = Modal;
const Header = (props) => {
    const [currentTime, setCurrentTime] = useState(formateDate(Date.now()))
    const [dayPictureUrl, setDayPictureUrl] = useState('')
    const [weather, setWeather] = useState('')
    const [title, setTitle] = useState('')
    let timeId
    // 每隔一秒获取当前时间,并更新状态数据currenttime
    const getTime = () => {
        timeId = setInterval(() => {
            const currentTime = formateDate(Date.now())
            setCurrentTime(currentTime)
        }, 1000)
    }

    //获取当前天气，并更新状态数据 dayPictureUrl weather
    const getWeather = async () => {
        const city = await reqCity()
        const { dayPictureUrl, weather } = await reqWeather(city.cname)
        setDayPictureUrl(dayPictureUrl)
        setWeather(weather)
    }

    //动态得到当前的标题
    const getTitle = () => {
        const path = props.location.pathname
        let title
        menuList.forEach(item => {
            //如果当前item对象的key与path一样，item 的 title就是需要显示的title
            if (item.key === path) {
                title = item.title
            } else if (item.children) {
                const cItem = item.children.find(cItem => cItem.key === path)
                if (cItem) {
                    title = cItem.title
                }
            }
        })
        setTitle(title)
    }
    const logOut = () => {
        confirm({
            title: '是否退出登录',
            icon: <ExclamationCircleOutlined />,
            onOk: () => {
                // 删除保存的user数据
                storageUtils.removeUser()
                memoryUtils.user = {}
                clearInterval(timeId)
                // 跳转到login
                props.history.replace('/login')
            },
            onCancel() {
            },
        });
    }
    useEffect(() => {
        getTime()
        getWeather()
    },[])
    useEffect(() => {
        getTitle()
    })
    const username = memoryUtils.user.username
    return (
        <div className="header">
            <div className="header-top">
                <span>欢迎,{username}</span>
                <LinkButton onClick={logOut}>退出</LinkButton>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">{title}</div>
                <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weater" />
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )
}

export default withRouter(Header)