import React from 'react'
import { Checkbox, Input, Radio } from 'antd'
import { HOUSE_TYPE } from '@/static/status'
import './index.scss'
import '../index.scss'

class StructurePropertyDetail extends React.Component{
    handleChange = (e) =>{
        e.target.type==='checkbox'?this.props.handleChange(e.target.name,e.target.checked*1):this.props.handleChange(e.target.name,e.target.value)
    }
    render(){
        const enable = this.props.enable
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">房产/土地信息</div>
                <div className="yc-components-assetStructureDetail_body">
                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'>抵押情况：</span>
                        <Checkbox name="collateral" onChange={this.handleChange} disabled={enable}>无抵押</Checkbox>
                    </div>
                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'>房产/土地类型：</span>
                        <Radio.Group  value={this.props.houseType} onChange={this.handleChange} name="houseType" disabled={enable}>
                            {
                                Object.keys(HOUSE_TYPE).map((key)=>{
                                    return <Radio value={parseInt(key)} key={parseInt(key)}>{HOUSE_TYPE[key]}</Radio>
                                })
                            }
                        </Radio.Group>
                    </div>
                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'>建筑面积：</span>
                        <span>
                            {   
                                enable?
                                <span>{`${this.props.buildingArea} `}m<sup>2</sup></span>:
                                <span><Input placeholder="请输入建筑面积" name="buildingArea" onChange={this.handleChange} />&nbsp;&nbsp;m<sup>2</sup></span>
                            }
                        </span>
                    </div>
                </div>
            </div>
        )
    }
}
export default StructurePropertyDetail