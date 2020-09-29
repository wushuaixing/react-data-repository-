import React, {Component} from 'react';
import {Item} from '../common';
import {Checkbox, InputNumber, Radio} from 'antd';
import {HOUSE_TYPE} from '@/static/status';
import {filters} from '@/utils/common';

class PropertyInfo extends Component {
    static defaultProps = {
        collateral: '',
        houseType: '',
        buildingArea: '',
        enable: true,
        handleChange: () => {
        }
    };
    handleChange = (e) => {
        if (e && e.target) {
            e.target.type === 'checkbox' ? this.props.handleChange(e.target.name, e.target.checked * 1) : this.props.handleChange(e.target.name, e.target.value)
        } else {
            //数值输入框onChange返回val
            this.props.handleChange('buildingArea', e)
        }
    }

    render() {
        const {collateral, houseType, buildingArea, enable} = this.props;
        return (
            <div className='yc-component-assetStructureDetail property_info'>
                <div className="yc-component-assetStructureDetail_header">
                    房产/土地信息
                </div>
                <div className="yc-component-assetStructureDetail_body">
                    <ul>
                        <Item title='抵押情况：'>
                            <div>
                                {
                                    enable ?
                                        <span>{parseInt(collateral) === 1 ? '无抵押' : '-'}</span> :
                                        <Checkbox name="collateral"
                                                  onChange={this.handleChange}
                                                  disabled={enable}
                                                  checked={collateral}>无抵押</Checkbox>
                                }
                            </div>
                        </Item>
                        <Item title='房产/土地类型：'>
                            <div>
                                {
                                    enable ?
                                        <span>{houseType ? HOUSE_TYPE[houseType] : '-'}</span> :
                                        <Radio.Group value={houseType}
                                                     onChange={this.handleChange}
                                                     name="houseType"
                                                     disabled={enable}>
                                            {
                                                Object.keys(HOUSE_TYPE).map((key) => {
                                                    return <Radio value={parseInt(key)}
                                                                  key={parseInt(key)}>{HOUSE_TYPE[key]}</Radio>
                                                })
                                            }
                                        </Radio.Group>

                                }
                            </div>
                        </Item>
                        <Item title='建筑面积：'>
                            <div>
                                {
                                    enable ?
                                        <span>{filters.filterNullKey(buildingArea) && parseInt(buildingArea) !== -1 ?
                                            <span>{buildingArea.toFixed(2)} m<sup>2</sup></span> : '-'}</span> :
                                        <span>
                                        <InputNumber
                                            precision={2}
                                            style={{width: 200}}
                                            max={999999999.99}
                                            min={0}
                                            placeholder="请输入建筑面积"
                                            name="buildingArea"
                                            onChange={this.handleChange}
                                            value={buildingArea}/>&nbsp;&nbsp;m<sup>2</sup>
                                    </span>
                                }
                            </div>
                        </Item>
                    </ul>
                </div>
            </div>
        )
    }
}

export default PropertyInfo;