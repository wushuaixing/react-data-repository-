import React from 'react'
import { Checkbox, Input, Radio } from 'antd'
import './index.scss'
import '../index.scss'

const StructurePropertyDetail = (props) => {
    return (
        <div className="yc-components-assetStructureDetail">
            <div className="yc-components-assetStructureDetail_header">房产/土地信息</div>
            <div className="yc-components-assetStructureDetail_body">
                <div className="yc-components-assetStructureDetail_body-row">
                    <span className='yc-components-assetStructureDetail_body-row_title'>抵押情况：</span>
                    <Checkbox>无抵押</Checkbox>
                </div>
                <div className="yc-components-assetStructureDetail_body-row">
                    <span className='yc-components-assetStructureDetail_body-row_title'>房产/土地类型：</span>
                    <Radio.Group  value={1}>
                        <Radio value={1}>未知</Radio>
                        <Radio value={2}>商用</Radio>
                        <Radio value={3}>住宅</Radio>
                        <Radio value={4}>工业</Radio>
                    </Radio.Group>
                </div>
                <div className="yc-components-assetStructureDetail_body-row">
                    <span className='yc-components-assetStructureDetail_body-row_title'>建筑面积：</span>
                    <span ><Input placeholder="请输入建筑面积"/></span>
                </div>
            </div>
        </div>
    )
}
export default StructurePropertyDetail