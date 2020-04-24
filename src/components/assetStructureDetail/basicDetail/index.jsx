import React from 'react'
import './index.scss'


//功能还剩链接跳转  在父组件补上Prop和回调逻辑即可  另外要根据传入prop选择需要显示的row
const StructureBasicDetail = () => {
    return (
        <div className="yc-components-assetStructureDetail" id="yc-components-basicDetail">
            <div className="yc-components-assetStructureDetail_header">基本信息</div>
            <div className="yc-components-basicDetail_body">
                <BasicDetailRow title={'标题'} content={'【第一次拍卖】重庆市九龙坡区马王四村11号2-2#房屋'} url={'www.baidu.com'} handleClick={click}></BasicDetailRow>
                <BasicDetailRow title={'拍卖状态'} content={'已成交'}></BasicDetailRow>
                <BasicDetailRow title={'撤回原因'} content={'录入信息有误，撤回重新发布'}></BasicDetailRow>
                <BasicDetailRow title={'关联标注'} content={'链接'} url={'www.baidu.com'} handleClick={()=>{console.log(123)}}></BasicDetailRow>
            </div>
        </div>
    )
}

const BasicDetailRow = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-row">
            <span className='yc-components-assetStructureDetail_body-row_title'>{`${props.title}：`}</span>
            {
                props.url ?
                    <span
                        onClick={props.handleClick}
                        className='yc-components-assetStructureDetail_body-row_link'>
                        {props.content}
                    </span> :
                    <span
                        className={'yc-components-assetStructureDetail_body-row_content'}>
                        {props.content}
                    </span>
            }
        </div>
    )
}
function click() {
    console.log(123)
}
export default StructureBasicDetail