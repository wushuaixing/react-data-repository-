import React from 'react'
import { WRONG_LEVEL } from '@/static/status'
import '../index.scss'
function WrongTypeAndLevel() {
    this.auctionExtractWrongTypes = [];
    this.date = '';
    this.name = '';
    this.remark = [];
    this.wrongLevel = 0
}
const wrongDetailCom = (props) => {
    let wrongData = (props.wrongData && props.wrongData.length > 0) ? props.wrongData : [new WrongTypeAndLevel()];
    const role = (localStorage.getItem('userState') === '管理员' || props.role === 'admin') ? 'admin' : 'no';
    return (
        <div className="yc-components-assetStructureDetail">
            <div className="yc-components-assetStructureDetail_header">错误原因</div>
            {
                wrongData.map((item, index) => {
                    return (
                        <div key={index}>
                            {
                                role === 'admin' &&
                                <div className="yc-components-assetStructureDetail_body-row wrongDetail_row">
                                    <span className='yc-components-assetStructureDetail_body-row_title'
                                          style={{marginRight:15}}>{`${item.date} ${item.name}检查`}</span>
                                    <WrongReasonRow text={'有误'} inline={true}/>
                                </div>
                            }
                            <div className="yc-components-assetStructureDetail_body-row">
                                <span className='yc-components-assetStructureDetail_body-row_title basicDetail_row'>错误等级：</span>
                                <WrongReasonRow text={WRONG_LEVEL[item.wrongLevel]} inline={true}/>
                            </div>
                            <div className="yc-components-assetStructureDetail_body-row">
                                {
                                    item.remark && item.remark.length > 0 ?
                                        item.remark.map((item, index) =>
                                          <WrongReasonTitleRow title={'错误详情：'} text={item} index={index} key={index}/>)
                                      :<WrongReasonTitleRow title={'错误详情：'} index={0} text={'-'}/>
                                }
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
};
const WrongReasonTitleRow = (props) => {
    return (
        <div>
            <span className='yc-components-assetStructureDetail_body-row_title basicDetail_row' style={props.index === 0 ? null : { visibility: 'hidden' }}>{props.title}</span>
            <WrongReasonRow text={props.text} inline={true}/><br/>
        </div>
    )
};

const WrongReasonRow = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-row danger-info" style={props.inline ? { display: 'inline-block' } : null}>{props.text}</div>
    )
};
export default wrongDetailCom
