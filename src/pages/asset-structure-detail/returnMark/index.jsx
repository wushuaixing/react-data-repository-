import React, { Component } from 'react'
class ReturnMark extends Component {
    static defaultProps = {
        backRemark: '',
    };
    render() {
        const {backRemark}=this.props;
        return (
            <div className='yc-component-assetStructureDetail return_mark'>
                <div className="yc-component-assetStructureDetail_header">
                    退回备注
                </div>
                <div className="yc-component-assetStructureDetail_body">
                    <ul>
                        <li>
                            <div className='danger-error'>{backRemark}</div>
                        </li>
                    </ul>
                </div>
            </div>
        )
    }
}
export default ReturnMark;