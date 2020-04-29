import React from 'react'
import { AUCTION_STATUS } from '@/static/status'
import './index.scss'


//功能还剩链接跳转  在父组件补上Prop和回调逻辑即可  另外要根据传入prop选择需要显示的row
const StructureBasicDetail = (props) => {
    return (
        <div className="yc-components-assetStructureDetail" id="yc-components-basicDetail">
            <div className="yc-components-assetStructureDetail_header">基本信息</div>
            <div className="yc-components-basicDetail_body">
                <BasicDetailRow title={'标题'} content={props.title} url={props.url}></BasicDetailRow>
                <BasicDetailRow title={'拍卖状态'} content={AUCTION_STATUS[props.auctionStatus]}></BasicDetailRow>
                {
                    (props.auctionStatus===9||props.auctionStatus===11)?
                    <BasicDetailRow title={'撤回原因'} content={props.reasonForWithdrawal}></BasicDetailRow>:
                    null
                }
                {
                    props.type===2?
                    <BasicDetailRow title={'关联标注'} content={'链接'} url={props.wsUrl}></BasicDetailRow>:
                    null
                }
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
                    <span>
                        <a className='yc-components-assetStructureDetail_body-row_link' rel="noopener noreferrer" href={props.url} target="_blank">{props.content}</a>
                    </span> :
                    <span
                        className={'yc-components-assetStructureDetail_body-row_content'}>
                        {props.content}
                    </span>
            }
        </div>
    )
}
export default StructureBasicDetail