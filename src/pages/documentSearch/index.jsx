/** document search * */
import React from 'react';
import { Form, Input, Button, Table, message, Spin, Row, Col, Popover } from 'antd';
import { wenshuSearch } from "../../server/api";
import { Link, withRouter } from "react-router-dom";
import '../style.scss';
import './style.scss'
import { BreadCrumb } from '@commonComponents'
import createPaginationProps from '@utils/pagination'
import { filters } from '@utils/common'
import moment from 'moment'
const searchForm = Form.create;
//表column
const columns = [
	{
		title: "发布日期",
		dataIndex: 'publishTime',
		width: 110,
		render(record) {
			return (
				<span>
					{filters.blockNullData(record, '——')}
				</span>
			)
		}
	},
	{
		title: "标题",
		render(record) {
			const temp = <span className="ws-link"
				style={{
					width: 160,
					WebkitLineClamp: 2,
					WebkitBoxOrient: 'vertical',
					overflow: 'hidden',
					display: '-webkit-box',
					textOverflow: 'ellipsis'
				}}>{filters.blockNullData(record.title, '——')}</span>;
			return (
				<Link to={`/documentDetail/${record.wenshuId}`} target="_blank" >
					{
						record.title && record.title.length > 30 ? <Popover content={record.title}>{temp}</Popover> : temp
					}
				</Link>
			)
		}
	},
	{
		title: "案号",
		dataIndex: "ah"
	},
	{
		title: "相关人员",
		dataIndex: "appellors",
		render(record) {
			const temp = <span className="ws-link"
				style={{
					width: 160,
					WebkitLineClamp: 2,
					WebkitBoxOrient: 'vertical',
					overflow: 'hidden',
					display: '-webkit-box',
					textOverflow: 'ellipsis'
				}}>{filters.blockNullData(record, '——')}</span>;
			return (
				<span>
					{
						record && record.length > 25 ? <Popover content={record}>{temp}</Popover> : temp
					}
				</span>
			)
		},
	},
	{
		title: "法院",
		dataIndex: "court"
	},
	{
		title: "案由",
		render(record) {
			return (
				<span>
					{filters.blockNullData(record.reason, '——')}
				</span>
			)
		}
	},
	{
		title: "案件类型",
		dataIndex: "caseType",
		width: 125
	}
];


class Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,  //初始页数
			total: 0,  //数据总量
			tableList: [], //表数据的source
			searchParams: {},  //搜索参数 包括全文/案号/法院/链接
			loading: false,
		};
	}
	//get table dataSource
	getTableList = () => {
		let params = {
			page: this.state.page
		}
		let { searchParams } = this.state
		Object.keys(searchParams).forEach((key) => {
			if (filters.filterNullKey(searchParams[key])) {
				params[key] = searchParams[key]
			}
		})
		this.setState({
			loading: true,
		});
		wenshuSearch(params).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				let data = res.data.data
				for (let i = 0; i < data.length; i++) {
					data[i].publishTime = moment.unix(data[i].publishTime).format('YYYY-MM-DD')
				}

				this.setState({
					tableList: data,
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
			content: this.props.form.getFieldValue('whole'),
			ah: this.props.form.getFieldValue('ah'),
			court: this.props.form.getFieldValue('court'),
			url: this.props.form.getFieldValue('url')
		};
		this.setState({
			searchParams: params,
			page: 1
		}, () => {
			this.getTableList();
		});

	};
	//清空搜索条件
	clearSearch = () => {
		this.props.form.resetFields();
		let params = {
			ah: "",
			content: "",
			court: "",
			url: ""
		};
		this.setState({
			searchParams: params,
			page: 1
		}, () => {
			this.getTableList();
		})
	};
	//换页
	onTablePageChange = (pagination) => {
		this.setState({
			page: pagination.current,
		}, () => {
			this.getTableList();
		});
	};
	render() {
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, page, loading } = this.state;
		const paginationProps = createPaginationProps(page, total)
		return (
			<div className="yc-main-body">
				<div className="yc-right-content">
					<div className="yc-content-container-newPage" style={{width:1250}}>
						<BreadCrumb texts={['文书搜索']}></BreadCrumb>
						<div className="yc-detail-content">
							<div className="yc-search-line document-search">
								<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form">
									<Form.Item label="全文" style={{ width: '100%' }}>
										{getFieldDecorator('whole', {})
											(<Input
												style={{ width: '100%' }}
												type="text"
												size='default'
												placeholder="姓名、公司、地址关键词等"

											/>)}
									</Form.Item>
									<Row>
										<Col span={19}>
											<Form.Item label="案号">
												{getFieldDecorator('ah', {})
													(<Input
														type="text"
														size='default'
														placeholder="案号"
													/>)}
											</Form.Item>
											<Form.Item label="法院">
												{getFieldDecorator('court', {})
													(<Input
														type="text"
														size='default'
														placeholder="法院"
													/>)}
											</Form.Item>
											<Form.Item label="链接">
												{getFieldDecorator('url', {})
													(<Input
														type="text"
														size='default'
														placeholder="文书源链接"
													/>)}
											</Form.Item>
										</Col>
										<Col span={5} style={{ textAlign: 'right' }}>
											<Form.Item>
												<Button type="primary" htmlType="submit" style={{ backgroundColor: '#0099CC', marginLeft: 15 }}>
													搜索
									</Button>
												<Button type="default" style={{ marginLeft: 5 }} onClick={this.clearSearch}>
													清空搜索条件
									</Button>
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</div>
							<p className="line" />
							<div className="yc-tab">
								<Spin tip="Loading..." spinning={loading}>
									<Table rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.wenshuId}
										pagination={paginationProps}
										onChange={this.onTablePageChange}
									/>
								</Spin>
							</div>
						</div>
					</div>
				</div>
			</div>

		);
	}
}
export default withRouter(searchForm()(Check));
