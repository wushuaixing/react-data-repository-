import React from 'react'
import { AUCTION_STATUS } from '@/static/status'
import './index.scss'
import { Link, withRouter } from "react-router-dom";

//功能还剩链接跳转  在父组件补上Prop和回调逻辑即可  另外要根据传入prop选择需要显示的row
const StructureBasicDetail = (props) => {
    const { associatedAnnotationId, associatedStatus } = props
    let associatedAnnotationRoute,autoMarkRoute = '';
    if (associatedAnnotationId) {
        switch (localStorage.getItem('userState')) {
            case '管理员':
                associatedAnnotationRoute = `/notFirstMark/admin/${associatedAnnotationId}`; 
                autoMarkRoute = `/autoMark/admin/${props.associatedAnnotationId}`
                break;
            case '检查人员':
                associatedAnnotationRoute = `/notFirstMark/check/${associatedAnnotationId}`;
                autoMarkRoute = `/autoMark/check/${props.associatedAnnotationId}`
                break;
            case '结构化人员':
                associatedAnnotationRoute = `/notFirstMark/structure/${associatedAnnotationId}/${associatedStatus}`; 
                break;
            default:
                break;
        }
    }
    return (
        <div className="yc-components-assetStructureDetail" id="yc-components-basicDetail">
            <div className="yc-components-assetStructureDetail_header">基本信息</div>
            <div className="yc-components-basicDetail_body">
                <BasicDetailRow title={'标题'} content={props.title} to={`/auctionDetail/${props.auctionID}`}></BasicDetailRow>
                <BasicDetailRow title={'拍卖状态'} content={AUCTION_STATUS[props.auctionStatus]}></BasicDetailRow>
                {
                    (props.auctionStatus === 9 || props.auctionStatus === 11) ?
                        <BasicDetailRow title={'撤回原因'} content={props.reasonForWithdrawal}></BasicDetailRow> :
                        null
                }
                {
                    props.type === 2 ?
                        <BasicDetailRow title={'关联标注'} content={'链接'} to={associatedAnnotationRoute}></BasicDetailRow> :
                        null
                }
                {
                    props.records && props.records.length > 0 ?
                        <BasicDetailRow title={'结构化/检查记录'} content={props.records} autoMarkRoute={autoMarkRoute}></BasicDetailRow> : null
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
                props.to ?
                    <span>
                        <Link className='yc-components-assetStructureDetail_body-row_link' to={props.to} target="_blank">{props.content}</Link>
                    </span> :
                    (
                        (props.content instanceof Array) ?
                            <span>
                                {
                                    props.content.map((record, index) => {
                                        return (
                                            <span className={'yc-components-assetStructureDetail_body-row_content'} key={index} style={index !== 0 ? { marginLeft: 103.4, display: 'inline-block', marginTop: 5 } : null}>
                                                <StructureRecord record={record} key={index} index={index} autoMarkRoute={props.autoMarkRoute}></StructureRecord>
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
    let userType = 0;
    if (record.desc === '结构化') {
        temp = index === 0 ? '初次结构化':'修改';
    } 
    else if (record.desc === '自动标注'){
        temp = '自动标注';
    }
    else {
        temp = record.error?'有误':'无误';
        userType = 1;
        classType = record.error?'structure-record-error':'structure-record-noErr';
    }
    return (
        <span>
            {`${record.time} ${record.user}${userType===1?'检查':''}`} <span className={classType}>{temp}</span>
            {
                record.desc==='自动标注'?
                <span style={{marginLeft:20}}>
                    <Link className='yc-components-assetStructureDetail_body-row_link'  target="_blank" to={props.autoMarkRoute}>{'查看详情'}</Link>
                </span>:null
            }
        </span>
    )
}
export default withRouter(StructureBasicDetail);