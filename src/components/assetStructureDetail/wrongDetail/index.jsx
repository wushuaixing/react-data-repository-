import React from 'react'
import '../index.scss'

const wrongDetail = (props) => {
    return (
        <div className="yc-components-assetStructureDetail">
            <div className="yc-components-assetStructureDetail_header">错误原因</div>
            <div className="yc-components-assetStructureDetail_body">
                {
                    props.wrongReasons.map((reason,index) => (
                        <WrongReasonRow reason={reason} key={index}></WrongReasonRow>
                    ))
                }
            </div>
        </div>
    )
}

const WrongReasonRow = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-row danger-info">{props.reason}</div>
    )
}
export default wrongDetail