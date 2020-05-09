import React from 'react'
import { WRONG_LEVEL } from '@/static/status'
import '../index.scss'

const wrongDetail = (props) => {
    /* console.log(props) */
    const { wrongReasons } = props
    return (
        <div className="yc-components-assetStructureDetail">
            <div className="yc-components-assetStructureDetail_header">错误原因</div>
            {
                props.role === 'structure' ?
                    <div className="yc-components-assetStructureDetail_body">
                        {
                            props.wrongReasons.map((reason, index) => (
                                <WrongReasonRow text={reason} key={index}></WrongReasonRow>
                            ))
                        }
                    </div> :
                    <div>
                        <div className="yc-components-assetStructureDetail_body-row">
                            <span className='yc-components-assetStructureDetail_body-row_title'>错误等级：</span>
                            <WrongReasonRow text={WRONG_LEVEL[wrongReasons.wrongLevel]} inline={true}></WrongReasonRow>
                        </div>
                        <div className="yc-components-assetStructureDetail_body-row">
                            {
                                wrongReasons.remark&&wrongReasons.remark.length>0?
                                wrongReasons.remark.map((item,index)=>{
                                    return (
                                        <WrongReasonTitleRow title={'错误原因：'} text={item} index={index} key={index}></WrongReasonTitleRow>
                                    )
                                }):null
                            }
                        </div>
                    </div>
            }
        </div>
    )
}
const WrongReasonTitleRow = (props) => {
    return (
        <div>
            <span className='yc-components-assetStructureDetail_body-row_title' style={props.index===0?null:{visibility:'hidden'}}>{props.title}</span>
            <WrongReasonRow text={props.text} inline={true}></WrongReasonRow><br></br>
        </div>
    )
}

const WrongReasonRow = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-row danger-info" style={props.inline ? { display: 'inline-block' } : null}>{props.text}</div>
    )
}
export default wrongDetail