/** right content for Account manage* */
import React from 'react';
import {Tabs, Table, Spin,} from "antd";
import { userCreate, userView, userEdit,userReset,userRemove,userDelete} from "../../../server/api";
import { message } from 'antd';
import AccountModal from "./structureAccountModal";
import SearchAccount from "./search";
import 'antd/dist/antd.css';
import './style.scss';
// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			loading:false,
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
									<a style={{marginRight:8}} onClick={()=>this.resetPassword(record.id)}>重置密码</a>
									<a onClick={()=>this.deleteUser(record.id)}>删除</a>
								</span>
					),
				}
			],
			columnsDelete: [
				{
					title: "ID",
					dataIndex: "id"
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
					title: "当前错误条数",
					dataIndex: "totalWrongNum",
					defaultSortOrder: 'descend',
					sorter: (a, b) => a.totalWrongNum - b.totalWrongNum,
				},
				{
					title: "操作",
					dataIndex: "action",
					align: "center",
					width: 180,
					render: (text, record) => (
						<span>
							<a style={{marginRight:8}} onClick={()=>this.remove(record.id)}>移除</a>
						</span>
					),
				}
			],
		};
  }

  componentDidMount() {
		const {isEnabledUser,searchRole,searchUser}=this.state;
		//默认初始传入正常账号+全部
    this.getTableList(isEnabledUser,1,searchRole,searchUser);
  }
  //账号添加／编辑弹窗
	showModal=(action)=>{
		this.setState({
			visible: true,
			action:action,
		});
	};

	editAccount=(info)=>{
		this.setState({
			info:info,
		});
		this.showModal('edit');
	};

	//重置密码
	resetPassword(id) {
		this.setState({
			loading:true,
		});
		userReset(id).then(res => {
			this.setState({
				loading:false,
			});
			if (res.data.code === 200) {
				message.info("重置密码成功");
			} else {
				message.error(res.data.message);
			}
		});
	};

	//删除账号
	deleteUser(id) {
		const {isEnabledUser,searchRole,searchUser}=this.state;
		this.setState({
			loading:true,
		});
		userRemove(id).then(res => {
			this.setState({
				loading:false,
			});
			if (res.data.code === 200) {
				message.info("删除成功");
				this.getTableList(isEnabledUser,1,searchRole,searchUser);
			} else {
				message.error(res.data.message);
			}
		});
	};

	//已删除账号移除操作
	remove(id) {
		const {isEnabledUser,searchRole,searchUser}=this.state;
		this.setState({
			loading:true,
		});
		userDelete(id).then(res => {
			if (res.data.code === 200) {
				this.setState({
					loading:false,
				});
				message.info("删除成功");
				this.getTableList(isEnabledUser,1,searchRole,searchUser);
			} else {
				message.error(res.data.message);
			}
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
		this.setState({
			loading:true,
		});
		userView(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				this.setState({
					loading:false,
					tableList:res.data.data,
					total:res.data.total,
				});
			} else {
				message.error(res.data.message);
			}
		});

  };

  //弹窗确定
  handleOk = (data,id) => {
		const {action}=this.state;
		//默认初始传入正常账号
		this.setState({
			visible: false,
			laoding: true,
		});
		if(action==='add'){
			//确定前还需验证
			userCreate(data).then(res => {
				this.setState({
					loading:false,
				});
				if (res.data.code === 200) {
					message.success("账号添加成功");
				} else {
					message.error(res.data.message);
				}
			});
		}else{
			userEdit(id, data).then(res => {
				if (res.data.code === 200) {
					this.setState({
						loading:false,
					});
					message.info("修改成功");
				} else {
					message.error(res.data.message);
				}
			});
		}
		setTimeout(this.getTableList,100);
  };

  //弹窗取消
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  //搜索
	searchAccount=(value)=>{
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
		const {searchRole,searchUser}=this.state;
		if (key === "1") {
			this.getTableList(true,1,searchRole,searchUser);
		} else if (key === "2") {
			this.getTableList(false,1,searchRole,searchUser);
		}

	};

  //换页
  onChangePage=(pagination)=>{
		const {isEnabledUser,page,searchRole,searchUser}=this.state;
		this.setState({
      page: pagination.current,
    });
    this.getTableList(isEnabledUser,page,searchRole,searchUser);
  };

  render() {
      const {tableList,total,page,visible,action,columns,columnsDelete,info,loading}=this.state;
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
							<Spin tip="Loading..." spinning={loading}>
								<Tabs defaultActiveKey="1" onChange={this.changeTab} style={{margin:15,fontSize:12}} animated={false}>
									<TabPane tab="正常账号" key="1">
										<SearchAccount 	showModal={this.showModal.bind(this)}
																		searchFn={this.searchAccount.bind(this)}
																		roleFn={this.selectRole.bind(this)}

										/>
										<Table rowClassName="table-list" columns={columns} dataSource={tableList} style={{margin:10,fontSize:12}}
													 rowKey={record => record.id}
													 onChange={this.onChangePage}
													 pagination={paginationProps}
										/>
									</TabPane>
									<TabPane tab="已删除账号" key="2">
										<SearchAccount showModal={this.showModal.bind(this)}
																	 searchFn={this.searchAccount.bind(this)}
																	 roleFn={this.selectRole.bind(this)}
										/>
										<Table rowClassName="table-list" columns={columnsDelete} dataSource={tableList} style={{margin:10,fontSize:12}}
													 rowKey={record => record.id}
													 onChange={this.onChangePage}
													 pagination={paginationProps}
										/>
									</TabPane>
								</Tabs>
							</Spin>
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
