/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Input from "antd/es/input";
import { Select } from 'antd';


const { Option } = Select;


class  CheckRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableList:[],
      obligorList:[],
      genderList: [
        {
          value: "0",
          label: "未知"
        },
        {
          value: "1",
          label: "男性"
        },
        {
          value: "2",
          label: "女性"
        }
      ],
		};
  }

  componentWillReceiveProps(nextProps){
    const {info,list}=nextProps;

    this.setState({
      tableList:info,
      obligorList:list,
    });
  }

  addToTable=()=>{
    //添加角色信息
    let temp=this.state.tableList;
    temp.unshift({
        name: "",
        labelType: "",
        number: "",
        birthday: "",
        gender: "",
        notes: "",
        type:"",
    });
      console.log(temp);
    this.setState({
      tableList:temp,
    });
  };


  deleteLine=(index)=>{
    let temp=this.state.tableList;
    temp.splice(index, 1);
    this.setState({
      tableList:temp,
    });

  };


  checkData=(data,index)=>{
    if (!data) {
      return;
    }
    let info=this.state.tableList[index];
    let year, month, day;
    let changeTime;
    let dateNum=`${data}`.match(/^\d{8}$/);
    let ifWord=`${data}`.match(/[\u4e00-\u9fa5]/g);
    // let checkTime = `${data}`.match(/(\d{4}).(\d{1,2}).(\d{1,2}).*/);
    // let checkTime = `${data}`.match(/(\d{1,}).(\d{1,}).(\d{1,}).(.*).*/);
    let checkTime = `${data}`.match(/^(\d{4})年(\d{1,2})月(\d{1,2})(日|号|)$/);
    if(dateNum){
			info.birthday =data;
    }
    else if(!checkTime){
      // this.$Message.error("输入格式错误");
      // this.error.birthday = "输入格式错误";
			info.birthday =data;
    }
    else if(checkTime){
      if(Number(checkTime[2])>12 || Number(checkTime[2]) <0 || Number(checkTime[3])>31 || Number(checkTime[3])<0){
				info.birthday = checkTime[1] + checkTime[2] + checkTime[3];
      }
      else{
        changeTime = new Date(checkTime[1], checkTime[2]-1, checkTime[3]);
        if (changeTime !== "Invalid Date") {
          year = changeTime.getFullYear() + "";
          if(changeTime.getMonth()<10){
            let temp=changeTime.getMonth()+1;
            month = "0" + temp;
          }
          else{
            month = changeTime.getMonth()+1;
          }
          if (changeTime.getDate() < 10) {
            day = "0" + changeTime.getDate();
          }
          else{
            day = changeTime.getDate();
          }
					info.birthday = year + month + day;
        } else {
          // this.$Message.error("输入格式错误");
          // this.error.birthday = "输入格式错误";
					info.birthday = "";
        }
      }
    }
    else {
      // this.$Message.error("输入格式错误");
      // this.error.birthday = "输入格式错误";
      // return;
    }
  };

  render() {
      const { }=this.props;
      const {tableList,obligorList,genderList}=this.state;
      let _obligorList=[];
      for (let key in obligorList) {
        _obligorList.push({
          value: obligorList[key] + "",
          label: key
        });
      }

        return(
          <div className="yc-wrong-part">
            <div className="yc-part-title">
              <p>角色信息</p>
            </div>

            <div className="yc-wrong-detail table-detail">
              <div className="table" style={{marginLeft:-40}}>
                <ul>
                  <li className="header">
                    <p>名称</p>
                    <p>角色</p>
                    <p>证件号</p>
                    <p>生日</p>
                    <p>性别</p>
                    <p>备注</p>
                  </li>
                  {
                    tableList && tableList.map((row, index)=>{
                      return (<li key={index} className="t-body">
                        <div className="item">
                          <p>{row.name}</p>
                        </div>
                        <div className="item">
                          <label>
                            {_obligorList && _obligorList.map((item, index) => {
                                return (
                                <Option value={item.value}
                                        key={item.value}>{item.label}</Option>)})}
                          </label>
                        </div>
                        <div className="item">
                          <p>{row.number}</p>
                        </div>
                        <div className="item">
                          <p>{row.birthday}</p>
                        </div>
                        <div className="item">

                            {
                              genderList && genderList.map((item, index) => {
                                return(
                                  <Option
                                    value={item.value}
                                    key={item.value}
                                  >
                                    {item.label}
                                  </Option>
                                );
                              })
                            }
                        </div>
                        <div className="item">
                          <p>{row.notes}</p>
                        </div>
                      </li>);

                  })
                  }
                </ul>
              </div>
             </div>
          </div>
        )
  }
}

export default CheckRole

