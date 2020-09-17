import React, { Component } from 'react'
import {Item} from '../common';
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
                        <Item title={backRemark}/>
                    </ul>
                </div>
            </div>
        )
    }
}
export default ReturnMark;