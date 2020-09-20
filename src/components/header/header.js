import React from 'react'
import { formateDate} from '../../utils/dataUtils'
import memoryUtils from '../../utils/memoryUtils'
import './index.less'
const Header = () => {
    const state = {
        currentTime: formateDate(Date.now()),//当前时间字符串
        dayPictureUrl: '', //天气图片url
        weather: '', //天气文本 
    }
    // 每隔一秒获取当前时间,并更新状态数据currenttime
    const getTime = () => {
        setInterval(() => {
            const currentTime = formateDate(Date.now())
            state.currentTime = currentTime
        },1000)
    }
    getTime()
    const { currentTime, dayPictureUrl, weather } = state
    const username = memoryUtils.user.username
    return (
        <div className="header">
            <div className="header-top">
                <span>欢迎,{username}</span>
                <a href="javascript:;">退出</a>
            </div>
            <div className="header-bottom">
                <div className="header-bottom-left">首页</div>
                <div className="header-bottom-right">
                    <span>{currentTime}</span>
                    <img src={dayPictureUrl} alt="weater"/>
                    <span>{weather}</span>
                </div>
            </div>
        </div>
    )
}

export default Header