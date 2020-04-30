import React from 'react'
import { Button, Icon } from 'antd'
import './style.scss'
//表单项前面的红色星 表示必填项 通过绝对定位
function HotDotBeforeFormItem(props = { top: 0, left: 0 }) {
    return (
        <span style={{ left: props.left, top: props.top }} className="yc-components-hotDot">
            *
        </span>
    )
}
//面包屑 四个参数 第一个是数组 面包屑层次文字  第二个如果不为空则存在button 第三个图标按钮 第四个是在按钮前显示进度的文字
function BreadCrumb(props = { texts: [], breadButtonText: null, icon: null, note: null, handleClick: null, disabled: false }) {
    //数据格式是数组['账号管理','结构化账号']表示层级显示账号管理 > 结构化账号
    let text = props.texts.length > 1 ? props.texts.join(' > ') : props.texts[0]
    //console.log(props.note)
    return (
        <div className="yc-components-breadCrumb" >
            <div className="yc-components-breadCrumb-body">{text}</div>
            {props.breadButtonText ?
                <div className="yc-components-breadCrumb_button">
                    {props.note ? <span className="yc-components-breadCrumb_button-note">{props.note}</span> : null}
                    <Button type="default" onClick={props.handleClick} disabled={props.disabled}>
                        {props.icon ? <Icon type={props.icon} /> : null}
                        {props.breadButtonText}
                    </Button>
                </div> : null}
            
        </div>
    )
}
//搜索和清空搜索条件按钮组
function SearchAndClearButtonGroup(props) {
    return (
        <div className="yc-components-searchAndClearButtonGroup">
            <Button type="primary" htmlType="submit" className="yc-components-searchAndClearButtonGroup_search" >
                搜索
            </Button>
            <Button type="default" onClick={props.handleClearSearch} className="yc-components-searchAndClearButtonGroup_clear">
                清空搜索条件
            </Button>
        </div>
    )
}

//Tab上面的文字说明  主要有两种 一种是常规文字 另外一种是带红色数字提示
function AssetTabTextWithNumber(props = { num: null, text: '' }) {
    if (props.num!=null) {
        return (
            <span>{props.text}<span className="yc-components-assetTabTextWithNumber">({props.num})</span></span>
        )
    } else {
        return (
            <span>{props.text}</span>
        )
    }
}


export {
    HotDotBeforeFormItem,
    BreadCrumb,
    SearchAndClearButtonGroup,
    AssetTabTextWithNumber
}