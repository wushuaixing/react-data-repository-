/** right content for Account manage* */
import React from 'react';
import { Table, Spin, } from "antd";
import { userCreateCheck, userEditCheck, userResetCheck, userRemoveCheck, getCheckListCheck } from "../../../server/api";
import { message, Button } from 'antd';
import AccountModal from '../../../components/accountManagement/checkAccountModal';
import 'antd/dist/antd.css';
import {BreadCrumb} from '../../../components/common'

class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			isEnabledUser: true,
			taleList: [],
			total: 1,
			page: 1,
			searchRole: '',
			searchUser: '',
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
					dataIndex: "accountNo"
				},
				{
					title: "姓名",
					dataIndex: "name"
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
		};
	}

	componentDidMount() {
		const { isEnabledUser, searchRole, searchUser } = this.state;
		//默认初始传入正常账号+全部
		this.getTableList(isEnabledUser, 1, searchRole, searchUser);
	}
	//账号添加／编辑弹窗
	showModal = (action) => {
		this.setState({
			visible: true,
			action,
		});
	};

	addAccount = () => {
		this.showModal('add');
	};

	editAccount = (info) => {
		this.setState({
			info: info,
		});
		this.showModal('edit');
	};

	//重置密码
	resetPassword(id) {
		this.setState({
			loading: true,
		});
		userResetCheck(id).then(res => {
			this.setState({
				loading: false,
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
		this.setState({
			loading: true,
		});
		userRemoveCheck(id).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				message.info("删除成功");
				this.getTableList();
			} else {
				message.error(res.data.message);
			}
		});
	};

	//get table dataSource
	getTableList = () => {
		this.setState({
			loading: true,
		});
		getCheckListCheck({ num: 1000 }).then(res => {
			if (res.data.code === 200) {
				this.setState({
					tableList: res.data.data.list,
					total: res.data.data.total,
					loading: false,
				});
			} else {
				message.error(res.data.message);
			}
		});
	};

	//弹窗确定
	handleOk = (data, id) => {
		const { action } = this.state;
		//默认初始传入正常账号
		this.setState({
			visible: false,
			loading: true,
		});
		if (action === 'add') {
			//确定前还需验证
			userCreateCheck(data).then(res => {
				this.setState({
					loading: false,
				});
				if (res.data.code === 200) {
					message.info("账号添加成功");
				} else {
					message.error(res.data.message);
				}
			});
		} else {
			userEditCheck(id, data).then(res => {
				this.setState({
					loading: false,
				});
				if (res.data.code === 200) {
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

	//换页
	onChangePage = (pagination) => {
		const { page } = this.state;
		this.setState({
			page: pagination.current,
		});
		this.getTableList({ page: page });
	};

	render() {
		const { tableList, total, page, visible, action, columns, info, loading } = this.state;
		const paginationProps = {
			current: page, //当前页
			showQuickJumper: true, //跳转
			total: total, // 数据总数
			pageSize: 10, // 每页条数
			showTotal: (() => {
				return `共 ${total} 条`;
			}),
		};
		return (
			<div style={{ backgroundColor: '#ffffff', margin: 20 }}>
				<BreadCrumb texts={['账号管理','检查账号']}></BreadCrumb>
				<div className="yc-detail-content">
					<div>
						<div style={{ margin: 10, textAlign: 'right' }}>
							<Button onClick={this.addAccount}>+ 添加账号</Button>
						</div>
						<Spin tip="Loading..." spinning={loading}>
							<div>
								<Table rowClassName="table-list" columns={columns} dataSource={tableList} style={{ margin: 10, fontSize: 12 }}
									rowKey={record => record.id}
									onChange={this.onChangePage}
									pagination={paginationProps}
								/>
							</div>
						</Spin>
					</div>
				</div>
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
export default Index
