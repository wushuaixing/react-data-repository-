/** right content for Account manage* */
import React from 'react';
import { userCreateCheck, userEditCheck, userResetCheck, userRemoveCheck, getCheckListCheck } from "@api";
import { message, Button, Table, Spin,Modal,Icon } from 'antd';
import AccountModal from '@/components/accountManagement/checkAccountModal';
import { BreadCrumb } from '@commonComponents'
import createPaginationProps from "@/utils/pagination";
import '../style.scss'
const { confirm ,warning} = Modal;
class Index extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			num:10, //每页显示条数
			total: 1,
			page: 1,
			visible: false,
			action: 'add', //编辑edit 添加add
			info: {},  //传入对话框的账户信息
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
		this.getTableList();
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
			info,
		},()=>{
			this.showModal('edit');
		});
	};
	resetPassword(id) {
		confirm({
			title: '确认重置密码?',
			content:'重置密码后,该账号密码为账号后6位',
			onOk: () => {
				this.setState({
					loading: true,
				});
				userResetCheck(id).then(res => {
					this.setState({
						loading: false,
					});
					if (res.data.code === 200) {
						message.success("重置密码成功");
					} else {
						message.error(res.data.message);
					}
				});
			}
		});
	};
	//删除账号
	deleteUser(id) {
		confirm({
			title: '确认删除账号?',
			content:'删除后,该账户将无法在数据资产平台登录',
			icon: <Icon type="exclamation-circle" />,
			className:'ant-explain-change',
			onOk: () => {
				this.setState({
					loading: true,
				});
				userRemoveCheck(id).then(res => {
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
			}
		});
	};
	getTableList = () => {
		this.setState({
			loading: true,
		});
		const { num,page } = this.state
		getCheckListCheck({ num,page }).then(res => {
			if (res.data.code === 200) {
				const data = res.data.data
				this.setState({
					tableList: data.list,
					total: data.total,
					loading: false,
				});
			} else {
				message.error(res.data.message);
			}
		});
	};
	//弹窗确定
	handleSubmit = (data, id) => {
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
					message.success("账号添加成功");
					setTimeout(this.getTableList, 100);
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
					message.success("修改成功");
					setTimeout(this.getTableList, 100);
				} else {
					message.error(res.data.message);
				}
			});
		}
		
	};
	
	//弹窗取消
	handleCancel = () => {
		this.setState({
			visible: false,
		});
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
		const { tableList, total, page, visible, action, columns, info, loading,num } = this.state;
		const paginationProps = createPaginationProps(page, total, true, num);
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['账号管理', '检查账号']}></BreadCrumb>
				<div className="yc-detail-content">
					<div style={{padding:'12px 20px 0'}}>
						<div className="addUser-button">
							<Button onClick={this.addAccount}>+ 添加账号</Button>
						</div>
						<Spin tip="Loading..." spinning={loading}>
							<div>
								<Table 
								rowClassName="table-list"
									columns={columns} dataSource={tableList} className="role-table"
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
						visible={visible} action={action} info={info}
						handleSubmit={this.handleSubmit.bind(this)}
						handleCancel={this.handleCancel.bind(this)}
						show={this.showModal.bind(this)}
					/>
				</div>
			</div>
		);
	}
}
export default Index
