import React from 'react'
import { AUCTION_STATUS } from '@/static/status'
import './index.scss'
import { Link, withRouter } from "react-router-dom";

//功能还剩链接跳转  在父组件补上Prop和回调逻辑即可  另外要根据传入prop选择需要显示的row
const StructureBasicDetail = (props) => {
    //console.log(props.records)
    return (
        <div className="yc-components-assetStructureDetail" id="yc-components-basicDetail">
            <div className="yc-components-assetStructureDetail_header">基本信息</div>
            <div className="yc-components-basicDetail_body">
                <BasicDetailRow title={'标题'} content={props.title} url={props.url} auctionID={props.auctionID}></BasicDetailRow>
                <BasicDetailRow title={'拍卖状态'} content={AUCTION_STATUS[props.auctionStatus]}></BasicDetailRow>
                {
                    (props.auctionStatus === 9 || props.auctionStatus === 11) ?
                        <BasicDetailRow title={'撤回原因'} content={props.reasonForWithdrawal}></BasicDetailRow> :
                        null
                }
                {
                    props.type === 2 ?
                        <BasicDetailRow title={'关联标注'} content={'链接'} url={props.wsUrl}></BasicDetailRow> :
                        null
                }
                {
                    props.records && props.records.length > 0 ?
                        <BasicDetailRow title={'结构化/检查记录'} content={props.records}></BasicDetailRow> : null
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
                        <Link className='yc-components-assetStructureDetail_body-row_link' to={`/auctionDetail/${props.auctionID}`} target="_blank">{props.content}</Link>
                    </span> :
                    (
                        (props.content instanceof Array) ?
                            <span>
                                {
                                    props.content.map((record, index) => {
                                        return (
                                            <span className={'yc-components-assetStructureDetail_body-row_content'} key={index} style={index !== 0 ? { marginLeft: 76, display: 'inline-block', marginTop: 5 } : null}>
                                                <StructureRecord record={record} key={index} index={index}></StructureRecord>
                                            </span>
                                        )

                                    })
                                }
                            </span>
                            : <span className={'yc-components-assetStructureDetail_body-row_content'}>
                                {props.content}
                            </span>
                    )
            }
        </div>
    )
}

function StructureRecord(props) {
    const { index, record } = props
    let classType = 'structure-record'
    let temp = null;
    if(record.desc==='结构化'){
        if(index===0){
            temp = '初次结构化'
        }else{
            temp = '修改'
        }
    }else{
        if(record.error){
            temp = '有误'
            classType = 'structure-record-error'
        }else{
            temp = '无误'
            classType = 'structure-record-noErr'
        }
    }
    return (
        <span>
            {`${record.time} ${record.user}`} <span className={classType}>{temp}</span>
        </span>
    )
}
export default withRouter(StructureBasicDetail);