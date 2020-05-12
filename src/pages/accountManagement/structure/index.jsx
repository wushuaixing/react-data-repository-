/** right content for Account manage* */
import React from 'react';
import { BreadCrumb } from '@commonComponents'
import { Tabs, Table, Spin, message } from "antd";
import { userCreate, userView, userEdit, userReset, userRemove, userDelete } from "@api";
import AccountModal from '@/components/accountManagement/structureAccountModal';
import SearchAccount from "@/components/accountManagement/search";
import createPaginationProps from '@/utils/pagination'
import '../style.scss';
// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

class AccountManage extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			isEnabledUser: true,
			num:10,
			page: 1,
			role: '',
			username: '',
			total: 1,
			visible: false,
			action: 'add',
			info: {},
			columns: [
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
							<a style={{ marginRight: 8 }} onClick={() => this.editAccount(record)}>编辑</a>
							<a style={{ marginRight: 8 }} onClick={() => this.resetPassword(record.id)}>重置密码</a>
							<a onClick={() => this.deleteUser(record.id)}>删除</a>
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
							<a style={{ marginRight: 8 }} onClick={() => this.remove(record.id)}>移除</a>
						</span>
					),
				}
			],
		};
	}

	componentDidMount() {
		//默认初始传入正常账号+全部
		this.getTableList();
	}
	//账号添加／编辑弹窗
	showModal = (action) => {
		this.setState({
			visible: true,
			action,
		});
	};

	editAccount = (info) => {
		this.setState({
			info,
		});
		//console.log(info)
		this.showModal('edit');
	};

	//重置密码
	resetPassword(id) {
		this.setState({
			loading: true,
		});
		userReset(id).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				message.success("重置密码成功");
			} else {
				message.error(res.data.message);
			}
		});
	};

	//删除账号
	deleteUser(id) {
		console.log(id)
		this.setState({
			loading: true,
		});
		userRemove(id).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				message.success("删除成功");
				this.getTableList();
			} else {
				message.error(res.data.message);
			}
		});
	};
	//已删除账号移除操作
	remove(id) {
		this.setState({
			loading: true,
		});
		userDelete(id).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				message.success("移除成功");
				this.getTableList();
			} else {
				message.error(res.data.message);
			}
		});
	};
	getTableList = () => {
		const { isEnabledUser, num, page,role, username } = this.state;
		let params = {
			isEnabledUser,
			num,
			page,
			role,
			username
		};
		this.setState({
			loading: true,
		});
		userView(params).then(res => {
			if (res.data.code === 200) {
				this.setState({
					loading: false,
					tableList: res.data.data,
					total: res.data.total,
				});
			} else {
				message.error(res.data.message);
			}
		});

	};
	//弹窗确定
	handleSubmit = (data, id) => {
		const { action } = this.state;
		this.setState({
			visible: false,
			loading: true
		});
		if (action === 'add') {
			//确定前还需验证
			userCreate(data).then(res => {
				this.setState({
					loading: false,
				});
				if (res.data.code === 200) {
					message.success("账号添加成功");
				} else {
					message.error(res.data.message);
				}
			});
		} else {
			userEdit(id, data).then(res => {
				if (res.data.code === 200) {
					this.setState({
						loading: false,
					});
					message.info("修改成功");
				} else {
					message.error(res.data.message);
				}
			});
		}
		setTimeout(this.getTableList, 100);
	};

	//弹窗取消
	handleCancel = () => {
		this.setState({
			visible: false,
		});
	};
	//搜索
	searchAccount = (value) => {
		this.setState({
			username: value,
		},()=>{
			this.getTableList();
		});
	};
	//角色选择
	selectRole = (value) => {
		console.log(value)
		this.setState({
			role: value,
		},()=>{
			this.getTableList();
		})
	};
	//切换Tab
	changeTab = (tabIndex) => {
		this.setState({
			isEnabledUser:tabIndex===1?true:false
		},()=>{
			this.getTableList();
		})
	};
	//换页
	onChangePage = (pagination) => {
		this.setState({
			page: pagination.current,
		},()=>{
			this.getTableList();
		});
	};
	render() {
		const { tableList, total, page, visible, action, columns, columnsDelete, info, loading } = this.state;
		const paginationProps = createPaginationProps(page, total, true, 10)
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['账号管理', '结构化账号']}></BreadCrumb>
				<div className="yc-detail-content">
					<Spin tip="Loading..." spinning={loading}>
						<Tabs defaultActiveKey="1" onChange={this.changeTab} animated={false} className="role-tab">
							<TabPane tab="正常账号" key="1">
								<SearchAccount 
									handleShowModal={this.showModal.bind(this)}
									searchFn={this.searchAccount.bind(this)}
									roleFn={this.selectRole.bind(this)}
								/>
								<Table rowClassName="table-list" columns={columns} dataSource={tableList} className="role-table"
									rowKey={record => record.id}
									onChange={this.onChangePage}
									pagination={paginationProps}
								/>
							</TabPane>
							<TabPane tab="已删除账号" key="2">
								<SearchAccount handleShowModal={this.showModal.bind(this)}
									searchFn={this.searchAccount.bind(this)}
									roleFn={this.selectRole.bind(this)}
								/>
								<Table rowClassName="table-list" columns={columnsDelete} dataSource={tableList} className="role-table"
									rowKey={record => record.id}
									onChange={this.onChangePage}
									pagination={paginationProps}
								/>
							</TabPane>
						</Tabs>
					</Spin>
				</div>
				<div>
					<AccountModal
						visible={visible}
						handleSubmit={this.handleSubmit.bind(this)}
						handleCancel={this.handleCancel.bind(this)}
						action={action}
						info={info}
					/>
				</div>
			</div>
		);
	}
}
export default AccountManage
