import React from 'react'
import { Checkbox, InputNumber, Radio } from 'antd'
import { HOUSE_TYPE } from '@/static/status'
import { filters } from '@/utils/common'
import './index.scss'
import '../index.scss'

class StructurePropertyDetail extends React.Component {
    handleChange = (e) => {
        if (e && e.target) {
            e.target.type === 'checkbox' ? this.props.handleChange(e.target.name, e.target.checked * 1) : this.props.handleChange(e.target.name, e.target.value)
        } else {
            //数值输入框onChange返回val
            this.props.handleChange('buildingArea', e)
        }
    }
    render() {
        const { collateral,enable,buildingArea } = this.props
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">房产/土地信息</div>
                <div className="yc-components-assetStructureDetail_body">
                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title propertyDetail_row'>抵押情况：</span>
                        {
                            enable?
                            <span>{parseInt(collateral)===1?'无抵押':'-'}</span>:
                            <Checkbox name="collateral" onChange={this.handleChange} disabled={enable} checked={this.props.collateral}>无抵押</Checkbox>
                        }
                    </div>
                    <div className="yc-components-assetStructureDetail_body-row" style={{paddingTop:10}}>
                        <span className='yc-components-assetStructureDetail_body-row_title propertyDetail_row'>房产/土地类型：</span>
                        {
                            enable ?
                                <span>{this.props.houseType?HOUSE_TYPE[this.props.houseType]:'-'}</span> :
                                <Radio.Group value={this.props.houseType} onChange={this.handleChange} name="houseType" disabled={enable}>
                                    {
                                        Object.keys(HOUSE_TYPE).map((key) => {
                                            return <Radio value={parseInt(key)} key={parseInt(key)}>{HOUSE_TYPE[key]}</Radio>
                                        })
                                    }
                                </Radio.Group>
                        }
                    </div>
                    <div className="yc-components-assetStructureDetail_body-row" style={{paddingTop:6}}>
                        <span className='yc-components-assetStructureDetail_body-row_title propertyDetail_row'>建筑面积：</span>
                        <span>
                            {
                                enable ?
                                    <span>{buildingArea&&parseInt(buildingArea)!==-1?<span>{this.props.buildingArea.toFixed(2)} m<sup>2</sup></span>:'-'}</span> :
                                    <span>
                                        <InputNumber
                                            precision={2} style={{ width: 200 }} max={999999999.99}
                                            placeholder="请输入建筑面积" name="buildingArea"
                                            onChange={this.handleChange} value={this.props.buildingArea} />&nbsp;&nbsp;m<sup>2</sup>
                                    </span>
                            }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default StructurePropertyDetail