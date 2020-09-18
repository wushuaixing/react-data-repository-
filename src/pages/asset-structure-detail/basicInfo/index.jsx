import React, { Component,Fragment } from 'react';
import { Item } from '../common';
import { AUCTION_STATUS } from '@/static/status';
import { Link, withRouter } from "react-router-dom";
import { dateUtils} from "@utils/common";
class ReturnMark extends Component {
    
    static defaultProps = {
        title: '',
        auctionStatus: 1,          //拍卖状态1:即将开始 3进行中 5已成交 7已流拍 9中止 11撤回
        reasonForWithdrawal: '',   //撤回原因
        associatedAnnotationId: '',//关联标注
        records: [],               //结构化/检查记录 
        url: '',
        id:''
    };
    render() {
        const { title, auctionStatus, reasonForWithdrawal, associatedAnnotationId, records ,id} = this.props;
        const hasAuto = (records||[]).some(i=>i.msg==='自动标注');
        return (
            <div className='yc-component-assetStructureDetail basic_info'>
                <div className="yc-component-assetStructureDetail_header">
                    基本信息
                </div>
                <div className="yc-component-assetStructureDetail_body">
                    <ul>
                        <Item title='标题：'>
                            <div> <Link to={`/auctionDetail/${id}`} target="_blank">{title}</Link></div>
                        </Item>
                        <Item title='拍卖状态：'>
                            <div>{AUCTION_STATUS[auctionStatus]}</div>
                        </Item>
                        {
                            reasonForWithdrawal &&
                            <Item title='撤回原因：'>
                                <div>{reasonForWithdrawal}</div>
                            </Item>
                        }
                       {    !hasAuto&&associatedAnnotationId&&
                            <Item title='关联标注：'>
                                <Link to={`/index/structureDetail/${associatedAnnotationId}`} target="_blank">链接</Link>
                            </Item>
                       } 
                        {
                            records && records.length > 0 &&
                            <Item title='结构化/检查记录：'>
                                <div className="records">
                                    {
                                        records.map((item,index)=>{
                                          return (<p key={`record${index}`}>
                                                <RecordsItem record={item} index={index} id={associatedAnnotationId}/>
                                            </p> )
                                        })
                                    }
                                </div>
                            </Item>
                        }
                    </ul>
                </div>
            </div>
        )
    }
}


const RecordsItem=(props)=>{
    const {record,index,id}=props;
    let temp=null;
    let userType = 0;
    let classType='record-noEr';
    if (record.msg === '结构化') {
        temp = index === 0 ? '初次结构化':'修改';
    }else if(record.msg === '自动标注'){
        temp = '自动标注';
    }else{
        userType=1;
        temp = record.error?'有误':'无误';
        classType = record.error?'danger-error':'record-noEr';
    }
    return (
        <Fragment>
            {`${dateUtils.formatStandardNumberDate(record.time)} ${record.name}${userType===1?'检查':''}`} <span className={classType}>{temp}</span>
            {
                record.msg==='自动标注'?
                <span style={{marginLeft:20}}>
                    <Link  target="_blank" to={`/index/structureDetail/${id}`}>{'查看详情'}</Link>
                </span>:null
            }
        </Fragment>
    )
}
export default withRouter(ReturnMark);