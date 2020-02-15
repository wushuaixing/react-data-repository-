/** right content for Account manage* */
import React from 'react';
import {Tabs, Table, Modal} from "antd";
import { userCreate, userView} from "../../../server/api";
import Pagination from "antd/es/pagination";
import Button from "antd/es/button";
import { Select, message } from 'antd';
import Checkbox from "antd/es/checkbox";
import Radio from "antd/es/radio";
import Input from "antd/es/input";
import './style.scss';

// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;

const columns = [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "账号",
      dataIndex: "username"
    },
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "结构化对象",
      dataIndex: "structuredObject"
    },
    {
      title: "数据类型",
      dataIndex: "dataType"
    },
    {
      title: "角色",
      dataIndex: "role"
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      width: 180,
      render: () => (
        <span>
        <a>编辑</a>
        <a>删除</a>
      </span>
      ),
    }
  ];

const dataTemp={
  "code":200,"data":[{"dataType":"非初标数据","id":959,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"tgb","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"66554411223"},{"dataType":"普通数据","id":957,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"hygn2","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"52052555455"},{"dataType":"普通数据","id":955,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"apl","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"85545242541"},{"dataType":"非初标数据","id":954,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"123458777a","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"12345877733"},{"dataType":"非初标数据","id":953,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"18390955868","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"18390955868"},{"dataType":"普通数据","id":949,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"y1ccc","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"95418528584"},{"dataType":"普通数据","id":922,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"张三12","role":"正式","structuredObject":"资产结构化","totalWrongNum":0,"username":"12345678919"},{"dataType":"非初标数据","id":920,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"y144","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"88889999999"},{"dataType":"普通数据","id":919,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"hj2","role":"试用","structuredObject":"资产结构化","totalWrongNum":0,"username":"66666666266"},{"dataType":"普通数据","id":917,"lastWeekErrorRate":"0.0%","lastWeekMarkNum":0,"name":"yeu3","role":"正式","structuredObject":"资产结构化","totalWrongNum":0,"username":"66555555555"}],"hasNext":true,"message":"成功","page":1,"pages":8,"size":10,"total":73};

class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledUser: true,
      taleList: [],
      total: 1,
      page: 1,
      searchRole:'',
      searchUser:'',
      visible:false,
      characterList: [
        {
          value: 1,
          label: "正式"
        },
        {
          value: 0,
          label: "试用"
        }
      ],
      structureList: ["资产结构化", "破产重组结构化"],
      auctionDataTypeList: ["非初标数据", "普通数据", "相似数据"],
      auctionDataTypeData: {
        '非初标数据': 3,
        '普通数据': 1,
        '相似数据': 2
      }
		};
  }

  componentDidMount() {
    //默认初始传入正常账号
    this.getTableList();


  }

  callback = key =>{
    // console.log(key);
  };

  showModal=()=>{
    this.setState({
      visible: true,
    });
  };

  //get table dataSource
  getTableList=()=>{
    const {isEnabledUser,page,searchRole,searchUser}=this.state;
    let params = {
      isEnabledUser: isEnabledUser,
      num: 10,
      page: page,
      role: searchRole,
      username: searchUser
    };
    userView(params).then(res => {
      if (res.data.code === 200) {
        // this.loading = false;
        this.setState({
          tableList:res.data.data,
          total:res.data.total,
        });
      } else {
        // this.$Message.error(res.data.message);
      }
    });
  };

//切换Tab
  changeTab=(key)=>{
      if (key === 1) {
        this.setState({
                   page: 1,
          isEnabledUser: true,
             searchRole: '',
             searchUser: '',
        });
      } else if (key === 2) {
        this.setState({
                   page: 1,
          isEnabledUser: true,
             searchRole: '',
             searchUser: '',
        });
      }
      this.getTableList();
  };

  //换页
  onChangePage=(page)=>{
    this.setState({
      page: page,
    });
  };

  handleOk = () => {
    let user={
        roleId: "",
        name: "",
        username: "",
        password: "",
        structuredObject: [8],
        auctionDataType: ""
    };
    user.roleId = this.refs.role.state.value;
    user.name = this.refs.username.state.value;
    user.username = this.refs.mobile.state.value;
    user.password = this.refs.psw.state.value;
    user.auctionDataType = this.refs.dataType.state.value;
    console.log(this.refs.psw.state.value);

    userCreate(user).then(res => {
      if (res.data.code === 200) {
      } else {
        // this.$Message.error(res.data.message);
      }
    });
    this.setState({
      visible: false,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
      const {tableList,total,visible,characterList}=this.state;
        return(
          <div>

              <div style={{ margin:10, fontSize:16, color:'#293038' }}>账号管理 > 结构化账号</div>
              <Button onClick={this.showModal}>+ 添加账号</Button>
              <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                <TabPane tab="正常账号" key="1">
                  <Table className="table-list" columns={columns} dataSource={dataTemp.data} style={{margin:10,width:1040}}
                         rowKey={record => record.id} />
                </TabPane>
                <TabPane tab="已删除账号" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
              <Pagination showQuickJumper={true} defaultCurrent={1} pageSize={10} total={total} onChange={this.onChangePage} />
              <Modal
                style={{width:387}}
                title="添加结构化账号"
                visible={visible}
                destroyOnClose={true}
                closable={true}
                footer={null}
								onCancel={this.handleCancel}
              >
                <div className="add-user-modal">
                  <div className="part">

                    <span style={{color: 'red',position: 'absolute',left: -7,top: 8}}
                    >*</span>
                    <p>角色:</p>
                    <label>
                      <Select style={{width:70}} transfer ref="role">
                        {
                          characterList && characterList.map((item) => {
                            return (
                              <Option
                                value={item.label}
                                key={item.value}
                              >
                                {item.label}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    </label>
                </div>
                <div className="part">
                  <span style={{color: 'red',position: 'absolute',left: -7,top: 8}}
                  >*</span
                  >
                  <p>姓名:</p>
                  <Input
                    style={{width: 260,height: 32}}
                    placeholder="请输入姓名"
                    ref="username"
                  />
                  {/*<span className="error" v-show="error.name">{{ error.name }}</span>*/}
                </div>

                <div className="part">
                  <span style={{color: 'red',position: 'absolute',left: -7,top: 8}}
                  >*</span
                  >
                  <p>账号:</p>
                  <Input
                    style={{width: 260,height: 32}}
                    placeholder="请输入手机号"
                    ref="mobile"
                  />
{/*                  <p style="line-height: 32px" v-else>{{ user.username }}</p>
                  <span className="error" v-show="error.username">{{ error.username }}</span>*/}
                </div>
                <div className="part">
                  <span style={{color: 'red',position: 'absolute',left: -7,top: 8}}
                  >*</span
                  >
                  <p>密码:</p>
                  <Input
                    type="password"
                    style={{width: 260,height: 32}}
                    placeholder="密码默认为账号后六位"
                    ref="psw"
                />
                {/*<span className="error" v-show="error.password">{{ error.password }}</span>*/}
                </div>
                <div>
                  <div className="part">
                      <span style={{color: 'red',position: 'absolute',left: -7,top: 3}}
                      >*</span
                      >
                  </div>
                  <p>结构化对象:</p>
                  <div className="structured">
                    <div>
                      <CheckboxGroup
                        options={this.state.structureList}
                        value={this.state.structureList[0]}
                        ref="structureObject"
                        disabled
                      />
                  </div>
                  <span style={{color: 'red',position: 'absolute',left: 9,top: 60}}
                  >*</span
                  >
                  <p className="structured-dataType">数据类型:</p>
                  {/*<span*/}
                    {/*style="position: absolute;left: 74px;top: 57px;color: red"*/}
                    {/*v-show="error.auctionDataType"*/}
                  {/*>{{ error.auctionDataType }}</span>*/}

                  <div>
                    <div>
                      <Radio.Group
                        ref="dataType"
                        style={{marginLeft:5,display:'inline-block' }}
                      >
                        <Radio value={0}>非初标数据</Radio>
                        <Radio value={1}>普通数据</Radio>
                        <Radio value={1}>相似数据</Radio>
                      </Radio.Group>
                    </div>
                  </div>
                </div>
                </div>
                <div className="footer">
                  <Button type="primary" onClick={this.handleOk}>确定</Button>
                  <Button onClick={this.handleCancel}>取消</Button>
                </div>
             </div>
              </Modal>
          </div>
        );
    }
}
export default AccountManage;
