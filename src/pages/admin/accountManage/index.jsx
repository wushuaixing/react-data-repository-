/** right content for Account manage* */
import React from 'react';
import {Tabs, Table, Modal, Form, } from "antd";
import { userCreate, userView} from "../../../server/api";
import Button from "antd/es/button";
import { Select, message } from 'antd';
import Checkbox from "antd/es/checkbox";
import Radio from "antd/es/radio";
import Input from "antd/es/input";
import 'antd/dist/antd.css';
import './style.scss';

// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;
const { Option } = Select;
const CheckboxGroup = Checkbox.Group;
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 3 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 20 },
  },
};
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
      visible:true,
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
    // {"roleId":0,"name":"sss","username":"18967830267","password":"830267","structuredObject":[8],"auctionDataType":1}
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
          isEnabledUser: false,
             searchRole: '',
             searchUser: '',
        });
      }
      this.getTableList();
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
    user.roleId = this.props.form.getFieldValue('role');
    if(user.roleId === "正式") {
      user.roleId = 1;
    }else if(user.roleId === "试用") {
      user.roleId = 0;
    }
    user.name = this.props.form.getFieldValue('username');
    user.username = this.props.form.getFieldValue('mobile');
    user.password = this.props.form.getFieldValue('password');
    user.auctionDataType = this.props.form.getFieldValue('dataType');
    //确定前还需验证
    // {"roleId":0,"name":"sss","username":"18967830267","password":"830267","structuredObject":[8],"auctionDataType":1}
    userCreate(user).then(res => {
      if (res.data.code === 200) {
        message.success("账号添加成功");
      } else {
        message.error(res.data.message);
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

  //验证账号密码-输入框格式
  handleValidator = (rule, val, callback) => {
    if (rule.field === "username") {
      if(!val){
        callback('姓名不能为空');
      }
      else if (val.length > 20) {
        callback("姓名最大长度为20个字符");
      }
    }
    if (rule.field === "mobile") {
      if(!val){
        callback('账号不能为空');
      }
      else if (!this.user.username.match(/^\d{11}$/)) {
        callback("请输入11位数字");
      }
    }
    if (rule.field === "password") {
      if(!val){
        callback('密码不能为空');
      }
      else if (val.length > 20 || val.length < 6) {
        callback('密码长度为6-20位');
      }
    }
  };

  setPwd=()=> {
    let password=this.props.form.getFieldValue('mobile').substring(
      5,
      this.user.username.length
    );
    return password;
  };

  //换页
  onChangePage=(pagination)=>{
    this.setState({
      page: pagination.current,
    });
    this.getTableList();
  };
  render() {
      const {tableList,total,page,visible,characterList,structureList}=this.state;
      const { getFieldDecorator } = this.props.form;
      const paginationProps = {
        current: page, //当前页
        showQuickJumper:true, //跳转
        total: total, // 数据总数
        pageSize: 10, // 每页条数
        showTotal: (() => {
          return `共 ${total} 条`;
        }),
      };
    return(
          <div>
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>账号管理 > 结构化账号</div>
              <Button onClick={this.showModal}>+ 添加账号</Button>
              <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                <TabPane tab="正常账号" key="1">
                  <Table className="table-list" columns={columns} dataSource={tableList} style={{margin:10,width:1040}}
                         rowKey={record => record.id}
                         onChange={this.onChangePage}
                         pagination={paginationProps}
                  />
                </TabPane>
                <TabPane tab="已删除账号" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
              <div style={{width:387}}>
              <Modal
                style={{width:387}}
                title="添加结构化账号"
                visible={visible}
                destroyOnClose={true}
                closable={true}
                footer={null}
								onCancel={this.handleCancel}
              >
                <div style={{ opacity: 0, height: 0, display: 'none' }}>
                  <input type="text" />
                  <input type="password" />
                </div>
                <Form className="add-user-modal" style={{width:387}} {...formItemLayout}>
                  <Form.Item className="part" label="角色：">
                    {getFieldDecorator('role', {
                      rules:[
                        { required: true, message: "请选择角色", },
                      ],
                    })(

                        <Select style={{width:70,marginLeft:4}} transfer>
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
                    )}
                  </Form.Item>
                  <Form.Item className="part" label="姓名：">
                    {getFieldDecorator('username', {
                      rules:[
                        { required: true, message: "姓名不能为空", },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                    })(
                      <Input
                        style={{marginLeft: 4,width: 260,height: 32 }}
                        className="yc-input"
                        placeholder="请输入姓名"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="part" label="账号：">
                    {getFieldDecorator('mobile', {
                      rules:[
                        { required: true, message: "手机号不能为空", },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                    })(
                      <Input
                        style={{marginLeft: 4,width: 260,height: 32 }}
                        className="yc-input"
                        placeholder="请输入手机号"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="part" label="密码：">
                    {getFieldDecorator('password', {
                      rules:[
                        { required: true, message: '请输入密码', },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                    })(
                      <Input
                        className="yc-input"
                        initialValue={this.setPwd}
                        type="password"
                        style={{marginLeft: 4,width: 260,height: 32}}
                        placeholder="密码默认为账号后六位"
                      />,
                    )}
                  </Form.Item>
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
                          options={structureList}
                          value={structureList[0]}
                          disabled
                        />
                        <span style={{color: 'red',position: 'absolute',left: 9,top: 60}}
                        >*</span
                        >
                        <p className="structured-dataType">数据类型:</p>
                      </div>
                      <Form.Item>
                        {getFieldDecorator('dataType', {
                          rules:[
                            { required: true },
                          ],
                        })(
                          <Radio.Group
                            style={{marginLeft:5,display:'inline-block' }}
                          >
                            <Radio value={0}>非初标数据</Radio>
                            <Radio value={1}>普通数据</Radio>
                            <Radio value={2}>相似数据</Radio>
                          </Radio.Group>,
                        )}
                      {/*<span style={{color: 'red',position: 'absolute',left: 9,top: 60}}
                      >*</span
                      >
                      <p className="structured-dataType">数据类型:</p>*/}

                      </Form.Item>
                    </div>
                  </div>
                  <div className="footer">
                    <Button type="primary" onClick={this.handleOk}>确定</Button>
                    <Button onClick={this.handleCancel}>取消</Button>
                  </div>
                </Form>
              </Modal>
              </div>
          </div>
        );
    }
}
export default accountForm()(AccountManage)
