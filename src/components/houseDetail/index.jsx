/** 房产土地信息展示* */
import React from 'react';
import {message} from 'antd';
import Checkbox from "antd/es/checkbox";
import Input from "antd/es/input";
import Radio from "antd/es/radio";

let storage = window.localStorage;
const role = storage.userState;

class  HouseDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checkedCollateral:true,
      houseType:0,
      area:'',
		};
  }

  componentWillReceiveProps(nextProps){
    const {collateral,house,area}=nextProps;

    this.setState({
      checkedCollateral:collateral,
      houseType:house,
      area:area,
    });

  }
  //抵押情况
  onChangeCheckBox = e =>{
    // console.log(e.target.checked);
    this.props.collateral=e.target.checked;

  };

  //房产／土地类型
  onChangeRadioHouse = e =>{
    // console.log('radio checked', e.target.value);
    this.props.houseType=e.target.value;
  };


  //建筑面积
  getArea = e =>{
    this.props.fn(e.target.value);//这个地方把值传递给了props的事件当中
  };
  //建筑面积
  checkArea(e){
    let num=e.target.value;
    let _num=/(^[0-9]{1,6}$)|(^[0-9]{1,6}[.]{1}[0-9]+$)/.test(num);
    if(!_num){
      message.error("建筑面积格式错误");
      return
    }
  };

  render() {
      let disabled=false;
      if(role !== "结构化人员"){
        disabled=true;
      }
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
                  disabled={disabled}
                >未抵押</Checkbox>
              </div>
              <div>
                <p className="yc-sec-title">房产／土地类型:</p>
                <Radio.Group
                  onChange={this.onChangeRadioHouse}
                  value={houseType}
                  className="yc-link-title"
                  style={{marginLeft:5}}
                  disabled={disabled}

                >
                  <Radio value={0}>未知</Radio>
                  <Radio value={1}>商用</Radio>
                  <Radio value={2}>住宅</Radio>
                  <Radio value={4}>工业</Radio>
                </Radio.Group>
              </div>
              <div>
                <p className="yc-sec-title">建筑面积:</p>
                {
                  disabled ? <p style={{fontSize:12,margin:4,display:'inline-block'}}>{area}</p>
                    : <Input className="yc-sec-title"
                             placeholder="请输入建筑面积"
                             style={{width:225,margin:5}}
                             value={area}
                             onChange={this.getArea}
                             onBlur={this.checkArea}
                    />
                }
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
