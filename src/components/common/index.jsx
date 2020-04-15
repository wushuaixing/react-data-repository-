import React from 'react'
import { Button,Icon } from 'antd'
import './style.scss'
//表单项前面的红色星 表示必填项 通过绝对定位
function HotDotBeforeFormItem(props = { top: 0, left: 0 }) {
    return (
        <span style={{ color: 'red', position: 'absolute', left: props.left, fontSize: 18, top: props.top }}>
            *
        </span>
    )
}
//面包屑 四个参数 第一个是数组 面包屑层次文字  第二个如果不为空则存在button 第三个图标按钮 第四个是在按钮前显示进度的文字
function BreadCrumb(props = { texts: [], buttonText: null, icon: null, note: null }) {
    //数据格式是数组['账号管理','结构化账号']表示层级显示账号管理 > 结构化账号
    let text = props.texts.length > 1 ? props.texts.join(' > ') : props.texts[0]
    return (
        <div className="publicCompnents-breadCrumb" >
            <div className="publicCompnents-breadCrumb-body">{text}</div>
            {props.buttonText ?
                <div className="publicCompnents-breadCrumb-buttonArea">
                    {props.note?<span class="publicCompnents-breadCrumb-buttonArea-note">{props.note}</span>:null}
                    <Button type="default" >
                        {props.icon?<Icon type={props.icon} />:null}
                        {props.buttonText}
                    </Button>
                </div> : null}
        </div>
    )
}

export {
    HotDotBeforeFormItem,
    BreadCrumb
}