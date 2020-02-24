/** document search * */
import React from 'react';
import {Form, Input, Button, Table, message, Spin} from 'antd';
import {wenshuSearch} from "../../server/api";
import {Link, withRouter} from "react-router-dom";
import 'antd/dist/antd.css';
import '../style.scss';

const searchForm = Form.create;

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
				<Link to={`/documentDetail/${record.wid}`}>
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


class  Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page:1,
			total:0,
			tableList:[],
			waitNum:0,
			status:'',
			personnelList:[],
			timeType:"结构化时间",
			searchContent:{},
			loading:false,
		};
	}

	componentDidMount() {
	};

	//get table dataSource
	getTableList=(search,page)=>{
		let params = {
			ah: "",
			content: "",
			court: "",
			num: 10,
			page: page,
			url: ""
		};
		params={
			content: search.content,
			ah: search.ah,
			court:search.court,
			url:search.url,
		};

		for (let key in params) {
			if (params[key] !== 0 && params[key] !== false && !params[key]) {
				delete params[key];
			}
		}
		this.setState({
			loading:true,
		});
		wenshuSearch(params).then(res => {
			this.setState({
				loading:false,
			});
			if (res.data.code === 200) {
				this.setState({
					tableList:res.data.data,
					total:res.data.total,
				});
			} else {
				message.error(res.data.message);
			}
		});

	};

	// 搜索框
	handleSearch = e => {
		e.preventDefault();
		const {page}=this.state;
		const content=this.props.form.getFieldValue('whole');
		const ah=this.props.form.getFieldValue('ah');
		const court=this.props.form.getFieldValue('court');
		const url=this.props.form.getFieldValue('url');
		let params = {
			ah: "",
			content: "",
			court: "",
			num: 10,
			page: page,
			url: ""
		};
		params={
			content: content,
			ah: ah,
			court: court,
			url: url,
		};
		this.setState({
			searchContent:params,
		});
		this.getTableList(params);
	};

	//清空搜索条件
	clearSearch=()=>{
		this.props.form.resetFields();
		let params = {
			ah: "",
			content: "",
			court: "",
			num: 10,
			page: 1,
			url: ""
		};
		this.getTableList(params);
	};

	//换页
	onTablePageChange=(pagination)=>{
		const {searchContent,page}=this.state;
		this.setState({
			page: pagination.current,
		});
		this.getTableList(searchContent,page);
	};

	render() {
		const { getFieldDecorator } = this.props.form;
		const {tableList,total,page,loading}=this.state;
		const paginationProps = {
			current: page,
			showQuickJumper:true,
			total: total, // 数据总数
			pageSize: 10, // 每页条数
			showTotal: (() => {
				return `共 ${total} 条`;
			}),
		};
		return(
				<div>
					<div className="yc-detail-title">
						<div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>文书搜索</div>
					</div>
					<div className="yc-detail-content">
						<div className="yc-search-line">
							<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{marginLeft:20,marginTop:15}}>
								<Form.Item label="全文">
									{getFieldDecorator('whole', {})
									(<Input
										type="text"
										size='default'
										style={{width:1100}}
										placeholder="姓名、公司、地址关键词等"
									/>)}
								</Form.Item>

								<Form.Item label="案号">
									{getFieldDecorator('ah', {})
									(<Input
										type="text"
										size='default'
										style={{width:230}}
										placeholder="案号"
									/>)}
								</Form.Item>
								<Form.Item label="法院">
									{getFieldDecorator('court', {})
									(<Input
										type="text"
										size='default'
										style={{width:230}}
										placeholder="法院"
									/>)}
								</Form.Item>
								<Form.Item label="链接">
									{getFieldDecorator('url', {})
									(<Input
										type="text"
										size='default'
										style={{width:230}}
										placeholder="文书链接"
									/>)}
								</Form.Item>
								<Form.Item>
									<Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15}}>
										搜索
									</Button>
									<Button type="default" style={{marginLeft:5}} onClick={this.clearSearch}>
										清空搜索条件
									</Button>
								</Form.Item>
							</Form>
						</div>
						<p className="line"/>
						<div className="yc-tab">
							<Spin tip="Loading..." spinning={loading}>
									<Table rowClassName="table-list"
												 columns={columns}
												 dataSource={tableList}
												 style={{margin:10}}
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
