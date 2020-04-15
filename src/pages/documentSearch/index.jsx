/** document search * */
import React from 'react';
import { Form, Input, Button, Table, message, Spin } from 'antd';
import { wenshuSearch } from "../../server/api";
import { Link, withRouter } from "react-router-dom";
import '../style.scss';
import {BreadCrumb} from '../../components/common'
const searchForm = Form.create;
//表column
const columns = [
	{
		title: "发布日期",
		dataIndex: "publishTime"
	},
	{
		title: "标题",
		dataIndex: "title",
		render: (text, record) => (
			<span>
				<Link to={`/documentDetail/${record.wid}`} target="_blank" >
					<span className="ws-link">{record.title}</span>
				</Link>
			</span>
		),
	},
	{
		title: "案号",
		dataIndex: "ah"
	},
	{
		title: "相关人员",
		dataIndex: "appellors"
	},
	{
		title: "法院",
		dataIndex: "court"
	},
	{
		title: "案由",
		dataIndex: "reason"
	},
	{
		title: "案件类型",
		dataIndex: "caseType"
	}
];


class Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 20,  //每页条数，固定默认20  
			page: 1,  //初始页数
			total: 0,  //数据总量
			tableList: [], //表数据的source
			searchParams: {},  //搜索参数 包括全文/案号/法院/链接
			loading: false,
		};
	}
	//get table dataSource
	getTableList = (search, page) => {
		let params = {
			ah: "",
			content: "",
			court: "",
			url: "",
			num: 20,
			page: page?page:1,
		};
		Object.assign(params,search);
		for (let key in params) {
			if (params[key] !== 0 && params[key] !== false && !params[key]) {
				delete params[key];
			}
		}
		this.setState({
			loading: true,
		});
		wenshuSearch(params).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				this.setState({
					tableList: res.data.data,
					total: res.data.total,
				});
			} else {
				message.error(res.data.message);
			}
		});

	};

	// 搜索框
	handleSearch = e => {
		e.preventDefault();
		let params = {
			content:this.props.form.getFieldValue('whole'),
			ah : this.props.form.getFieldValue('ah'),
			court : this.props.form.getFieldValue('court'),
			url : this.props.form.getFieldValue('url')
		};
		this.setState({
			searchParams: params,
			page:1
		});
		this.getTableList(params);
	};
	//清空搜索条件
	clearSearch = () => {
		this.props.form.resetFields();
		let params = {
			ah: "",
			content: "",
			court: "",
			num: 20,
			page: 1,
			url: ""
		};
		this.setState({
			searchParams:params
		})
		this.getTableList(params);
	};
	//换页
	onTablePageChange = (pagination) => {
		const { searchParams, page } = this.state;
		this.setState({
			page: pagination.current,
		});
		this.getTableList(searchParams, page+1);
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, page, loading } = this.state;
		const paginationProps = {
			current: page,
			showQuickJumper: true,
			total: total, // 数据总数
			pageSize: 20, // 每页条数
			showTotal: (() => {
				return `共 ${total} 条`;
			}),
		};
		return (
			<div style={{ backgroundColor: '#ffffff', margin: 20 }}>
				<BreadCrumb texts={['文书搜索']}></BreadCrumb>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{ marginLeft: 20, marginTop: 15 }}>
							<Form.Item label="全文">
								{getFieldDecorator('whole', {})
									(<Input
										type="text"
										size='default'
										style={{ width: 1100 }}
										placeholder="姓名、公司、地址关键词等"
									/>)}
							</Form.Item>

							<Form.Item label="案号">
								{getFieldDecorator('ah', {})
									(<Input
										type="text"
										size='default'
										style={{ width: 230 }}
										placeholder="案号"
									/>)}
							</Form.Item>
							<Form.Item label="法院">
								{getFieldDecorator('court', {})
									(<Input
										type="text"
										size='default'
										style={{ width: 230 }}
										placeholder="法院"
									/>)}
							</Form.Item>
							<Form.Item label="链接">
								{getFieldDecorator('url', {})
									(<Input
										type="text"
										size='default'
										style={{ width: 230 }}
										placeholder="文书链接"
									/>)}
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" style={{ backgroundColor: '#0099CC', marginLeft: 15 }}>
									搜索
									</Button>
								<Button type="default" style={{ marginLeft: 5 }} onClick={this.clearSearch}>
									清空搜索条件
									</Button>
							</Form.Item>
						</Form>
					</div>
					<p className="line" />
					<div className="yc-tab">
						<Spin tip="Loading..." spinning={loading}>
							<Table rowClassName="table-list"
								columns={columns}
								dataSource={tableList}
								rowKey={record => record.wid}
								pagination={paginationProps}
								onChange={this.onTablePageChange}
							/>
						</Spin>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(searchForm()(Check));
