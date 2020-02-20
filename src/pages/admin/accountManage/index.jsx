/** right content for Account manage* */
import React from 'react';
import {Tabs, Table, } from "antd";
import { userCreate, userView, userEdit} from "../../../server/api";
import Button from "antd/es/button";
import { Select, message } from 'antd';
import Search from "antd/es/input/Search";
import AccountModal from "./accountModal";
import 'antd/dist/antd.css';
import './style.scss';
// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;
const { Option } = Select;

// const columns = [
//     {
//       title: "ID",
//       dataIndex: "id"
//     },
//     {
//       title: "账号",
//       dataIndex: "username"
//     },
//     {
//       title: "姓名",
//       dataIndex: "name"
//     },
//     {
//       title: "结构化对象",
//       dataIndex: "structuredObject"
//     },
//     {
//       title: "数据类型",
//       dataIndex: "dataType"
//     },
//     {
//       title: "角色",
//       dataIndex: "role"
//     },
//     {
//       title: "操作",
//       dataIndex: "action",
//       align: "center",
//       width: 180,
//       render: () => (
//         <span>
//         <a style={{marginRight:8}} onClick={()=>this.showModal()}>编辑</a>
//         <a style={{marginRight:8}}>重置密码</a>
//         <a>删除</a>
//       </span>
//       ),
//     }
//   ];


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
			action:'add',
			info:{},
			characterList: [
				{
					value: 1,
					label: "正式"
				},
				{
					value: 0,
					label: "试用"
				},
				{
					value:'',
					label:"全部"
				}
			],
		  columns:[
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
					render: (text, record) => (
								<span>
									<a style={{marginRight:8}} onClick={()=>this.editAccount(record)}>编辑</a>
									<a style={{marginRight:8}}>重置密码</a>
									<a>删除</a>
								</span>
					),
				}
			],
		};
  }

  componentDidMount() {
		const {isEnabledUser,searchRole,searchUser}=this.state;
		//默认初始传入正常账号
    this.getTableList(isEnabledUser,1,searchRole,searchUser);


  }

  addAccount=()=>{
  	this.showModal('add');
	};

	editAccount=(info)=>{
		this.setState({
			info:info,
		});
		this.showModal('edit');
	};

	showModal=(action)=>{
		this.setState({
			visible: true,
			action:action,
		});
	};

  //get table dataSource
  getTableList=(isEnabledUser,page,searchRole,searchUser)=>{
  	const {action}=this.state;
		let params = {
			isEnabledUser: true,
			num: 10,
			page: 1,
			role: '',
			username: ''
		};
		if(action !=='edit'){
			params = {
				isEnabledUser: isEnabledUser,
				num: 10,
				page: page,
				role: searchRole,
				username: searchUser
			};
		}
		//isEnabledUser=true&num=10&page=1&role=1&username=gg
		userView(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				this.setState({
					tableList:res.data.data,
					total:res.data.total,
				});
			} else {
				message.error(res.data.message);
			}
		});

  };



  handleOk = (data,id) => {
		const {action,info}=this.state;
		//默认初始传入正常账号
		this.setState({
			visible: false,
		});
		if(action==='add'){
			//确定前还需验证
			// {"roleId":0,"name":"sss","username":"18967830267","password":"830267","structuredObject":[8],"auctionDataType":1}
			userCreate(data).then(res => {
				if (res.data.code === 200) {
					message.success("账号添加成功");
				} else {
					message.error(res.data.message);
				}
			});
		}else{
			console.log(id,'id');
			// {"auctionDataType":3,"name":"张三12","functionId":[8],"roleId":1}
			userEdit(id, data).then(res => {
				if (res.data.code === 200) {
					message.info("修改成功");
				} else {
					message.error(res.data.message);
				}
			});
		}
		setTimeout(this.getTableList,100);
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  //搜索
	searchAccount=(value)=>{
		console.log(value,'va');
		const {isEnabledUser,searchRole,searchUser}=this.state;
		this.setState({
			searchUser:value,
		});
		this.getTableList(isEnabledUser,1,searchRole,searchUser);
	};
	//角色选择
	selectRole=(value)=>{
		this.setState({
			searchRole:value,
		})
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

  //换页
  onChangePage=(pagination)=>{
		const {isEnabledUser,page,searchRole,searchUser}=this.state;

		this.setState({
      page: pagination.current,
    });
    this.getTableList(isEnabledUser,1,searchRole,searchUser);
  };

  render() {
      const {tableList,total,page,visible,characterList,action,columns,info}=this.state;
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
              <Tabs defaultActiveKey="1" onChange={this.changeTab} style={{margin:15,fontSize:12}}>
                <TabPane tab="正常账号" key="1">
                  <div className="search-line">
                    <div className="search">
                      <Search
                        placeholder="输入账号/姓名"
                        onSearch={this.searchAccount}
                        style={{ width: 240 }}
                      />
                    </div>
                    <div className="character">
                      <p>角色:</p>
                      <Select style={{width:75,marginLeft:4}} placeholder="全部" transfer>
                        {
                          characterList && characterList.map((item) => {
                            return (
                              <Option
                                value={item.value}
                                key={item.value}
																onChange={this.selectRole}
                              >
                                {item.label}
                              </Option>
                            );
                          })
                        }
                      </Select>
                  </div>
                    <Button onClick={this.addAccount} style={{marginRight:10}}>+ 添加账号</Button>


                  </div>
                  <Table rowClassName="table-list" columns={columns} dataSource={tableList} style={{margin:10,fontSize:12}}
                         rowKey={record => record.id}
                         onChange={this.onChangePage}
                         pagination={paginationProps}
                  />
                </TabPane>
                <TabPane tab="已删除账号" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
              <div>
                <AccountModal
                  visible={visible}
                  ok={this.handleOk.bind(this)}
                  cancel={this.handleCancel.bind(this)}
                  show={this.showModal.bind(this)}
									action={action}
									info={info}
                />
              </div>
          </div>
        );
    }
}
export default AccountManage
