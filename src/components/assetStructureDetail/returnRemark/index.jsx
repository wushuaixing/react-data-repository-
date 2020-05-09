import React from 'react'

export default class ReturnRemark extends React.Component {

    render() {
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">退回备注</div>
                <div className="yc-components-assetStructureDetail_body">
                    <div className="yc-components-assetStructureDetail_body-row danger-info">{this.props.notes}</div>
                </div>
            </div>
        )
    }
}