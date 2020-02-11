/** 错误原因展示* */
import React from 'react';
import Checkbox from "antd/es/checkbox";
import Input from "antd/es/input";
import Radio from "antd/es/radio";

// ==================
// 所需的所有组件
// ==================


class  HouseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedCollateral:true,
      houseType:0,
      area:'',
		};
  }

  componentWillMount() {
    const {collateral,house,area}=this.props;
    this.setState({
      checkedCollateral:collateral,
      houseType:house,
      area:area,
    });

  }
  //抵押情况
  onChangeCheckBox = e =>{
    // console.log(e.target.checked);
    // this.props.collateral=e.target.checked;

  };

  //房产／土地类型
  onChangeRadioHouse = e =>{
    // console.log('radio checked', e.target.value);
    // this.props.houseType=e.target.value;
  };

  //建筑面积
  getArea = e =>{
    // console.log(e.target.value);
    // this.props.area=e.target.value;
  };

  render() {
    const { checkedCollateral,houseType,area }=this.state;
        return(
          <div>
            <div className="yc-part-title">
              <p>房产／土地信息</p>
            </div>
            <div className="yc-wrong-detail">
              <div>
                <p className="yc-sec-title">抵押情况:</p>
                <Checkbox
                  defaultChecked={checkedCollateral}
                  onChange={this.onChangeCheckBox}
                  style={{marginLeft:5}}
                >未抵押</Checkbox>
              </div>
              <div>
                <p className="yc-sec-title">房产／土地类型:</p>
                <Radio.Group
                  onChange={this.onChangeRadioHouse}
                  value={houseType}
                  className="yc-link-title"
                  style={{marginLeft:5}}
                >
                  <Radio value={0}>未知</Radio>
                  <Radio value={1}>商用</Radio>
                  <Radio value={2}>住宅</Radio>
                  <Radio value={4}>工业</Radio>
                </Radio.Group>
              </div>
              <div>
                <p className="yc-sec-title">建筑面积:</p>
                <Input className="yc-sec-title"
                       placeholder="请输入建筑面积"
                       style={{width:225,margin:5}}
                       value={area}
                       onChange={this.getArea}
                />
                <p className="yc-sec-title">m²</p>
              </div>
              <div>
              </div>
            </div>
          </div>
        );
    }
}
export default HouseDetail;
