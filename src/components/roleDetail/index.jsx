/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import Input from "antd/es/input";
import { Select } from 'antd';


const { Option } = Select;
let storage = window.localStorage;
const role = storage.userState;

class  RoleDetail extends React.Component {
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

  roleInfo = e =>{

    console.log(e.target,'target');

    // this.props.fn(e.target.value);//这个地方把值传递给了props的事件当中

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

  changeLableType=(value)=>{
    if(value === "1"){
      return "资产所有人"
    }else if(value === "2"){
      return "债权人"
    }else if(value === "3"){
      return "资产线索"
    }else if(value === "5"){
      return "竞买人"
    }
  };

  changeGender=(value)=>{
    console.log(value);
    if(value=== "0"){
      return "未知"
    }else if(value=== "1") {
      return "男性"
    }else if(value=== "2") {
      return "女性"
    }
  };

  render() {
      let disabled=false;
      let style='';
      if(role !== "结构化人员"){
        disabled=true;
        style='none';
      }
      const {tableList,obligorList,genderList}=this.state;
      // let _obligorList=[];
      // for (let key in obligorList) {
      //   _obligorList.push({
      //     value: obligorList[key] + "",
      //     label: key
      //   });
      // }
      console.log(obligorList);

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
                    <p style={{display:style}}>操作</p>
                  </li>
                  <div className="add-btn" onClick={this.addToTable} style={{display:style}}>+ 添加</div>
                  {
                    tableList && tableList.map((row, index)=>{
                      return (<li key={index} className="t-body">
                        <div className="item">
                        {disabled
                          ? <p>{row.name ? row.name : '--'}</p>
                          :
                          <form>
                            <Input
                              value={row.name}
                              placeholder="请输入名称"
                              style={{width: '100%'}}
                            />
                          </form>
                        }
                        </div>
                        <div className="item">
                          {disabled
                            ? <p>{row.labelType ? this.changeLableType(row.labelType) : '--'}</p>
                            :
                            <Select defaultValue={row.labelType} style={{width: '100%'}} transfer>
                              {
                                obligorList && obligorList.map((item) => {
                                return (
                                  <Option
                                    value={item.value}
                                    key={item.value}
                                  >
                                    {item.label}
                                  </Option>
                                );
                                })
                              }
                            </Select>
                          }
                        </div>
                        <div className="item">
                          {disabled
                            ? <p>{row.number ? row.number : '--'}</p>
                            :
                            <form>
                              <Input
                                value={row.number}
                                placeholder="请输入证件号"
                                style={{width: '100%'}}
                              />
                            </form>
                          }
                        </div>
                        <div className="item">
                          {disabled
                            ? <p>{row.birthday ? row.birthday : '--'}</p>
                            :
                            <form>
                              <Input
                                value={row.birthday}
                                placeholder="请输入年月日"
                                style={{width: '100%'}}
                                onBlur={() => this.checkData(row.birthday, index)}
                                onChange={this.roleInfo}
                              />
                            </form>
                          }
                        </div>
                        <div className="item">
                          {disabled
                            ? <p>{row.gender ? this.changeGender(row.gender) : '--'}</p>
                            :
                            <Select style={{width: '100%'}} defaultValue={row.gender} transfer>
                              {
                                genderList && genderList.map((item) => {
                                  return (
                                    <Option
                                      value={item.value}
                                      key={item.value}
                                    >
                                      {item.label}
                                    </Option>
                                  );
                                })
                              }
                            </Select>
                          }
                        </div>
                        <div className="item">
                          {disabled
                            ? <p>{row.notes ? row.notes : '--'}</p>
                            :
                            <form>
                              <Input
                                value={row.notes}
                                placeholder="请输入备注信息"
                                style={{width: '100%'}}
                              />
                            </form>
                          }
                        </div>
                        <div className="item" style={{display:style}}>
                          <Button onClick={()=>this.deleteLine(index)}>删除</Button>
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

export default RoleDetail

