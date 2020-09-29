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
import NoDataIMG from '../../assets/img/no_data.png'
import {scrollTop } from "@utils/tools";
import RecordsDel from '../../assets/img/records_del.png';
import RecordsDelHover from '../../assets/img/records_del_hover.png';
// import moment from 'moment'
const searchForm = Form.create;
let storage = window.localStorage;
class Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			page: 1,  //初始页数
			total: 0,  //数据总量
			tableList: [], //表数据的source
			searchParams: {},  //搜索参数 包括全文/案号/法院/链接
			loading: false,//表column
			documentSearchRecords:[],//搜索记录
			IconColor:false //图片滑过显示
		};
	}
	//get table dataSource
	getTableList = () => {
		let params = {
			page: this.state.page
		};
		let { searchParams } = this.state;
		Object.keys(searchParams).forEach((key) => {
			if (filters.filterNullKey(searchParams[key])) {
				params[key] = searchParams[key]
			}
		});
		this.setState({
			loading: true,
		});
		wenshuSearch(params).then(res => {
			this.setState({
				loading: false,
			});
			if (res.data.code === 200) {
				let data = res.data.data;
				// for (let i = 0; i < data.length; i++) {
				// 	data[i].publishTime = moment.unix(data[i].publishTime).format('YYYY-MM-DD')
				// }

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
		const { form:{ getFieldValue,setFieldsValue} } = this.props;
		const get =field=> (getFieldValue(field)||'');
		const records=JSON.parse(storage.getItem('documentSearchRecords'))||[];//取值
		get('whole')&&records.unshift(get('whole').trim().replace(/\s+/g,' '));//搜索框中有值的情况下去空格将多个空格合并为一个
		const recordsData=JSON.stringify(records.slice(0,9)); //取最近10条
		storage.setItem('documentSearchRecords',recordsData);
		this.setState({
			searchParams:{
				content: get('whole').trim().replace(/\s+/g," "),
				ah: get('ah'),
				court: get('court'),
				url: get('url')
			},
			page: 1,
			documentSearchRecords:records
		}, () => {
			this.getTableList();
		});
		setFieldsValue({whole:get('whole').trim().replace(/\s+/g," "),
						   ah:get('ah').trim(),
						court:get('court').trim(),
						  url:get('url').trim()
						})

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
	handClick=(val)=>{
		const { form:{ getFieldValue,setFieldsValue} } = this.props;
		const get =field=> (getFieldValue(field)||'');
		setFieldsValue({whole:val});             //点击搜索记录时填充到搜索框中
		this.setState({
			searchParams:{
				content: get('whole').trim().replace(/\s+/g," "),
				ah: get('ah'),
				court: get('court'),
				url: get('url')
			},
			page: 1,
		}, () => {
			this.getTableList();
		});
	}
	clearRecords=()=>{
		localStorage.removeItem('documentSearchRecords');//清楚记录
		this.setState({
			documentSearchRecords:[],
			isHover:false
		})
	}
	handIconHover=(key)=>{ //删除图标滑过
		this.setState({
			isHover:key
		})
	}
	//换页
	onTablePageChange = (pagination) => {
		this.setState({
			page: pagination.current,
		}, () => {
			this.getTableList();
			scrollTop('no-yc-layout-main');
		});
	};
	componentDidMount(){
		const records=JSON.parse(storage.getItem('documentSearchRecords'))||[];
		this.setState({
			documentSearchRecords:records
		});
		document.title="文书搜索";
	}
	render() {
		const { getFieldDecorator } = this.props.form;
		const { tableList, total, page, loading,searchParams:{content},documentSearchRecords,isHover} = this.state;
		const paginationProps = createPaginationProps(page, total);
		const columns = [
			{
				title: "发布日期",
				dataIndex: 'publishTime',
				width: 130,
				render: val => val || '--'
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
						}}>{filters.blockNullData(record.title, '—')}</span>;
					return (
						<Link to={`/documentDetail/${record.wenshuId}/${record.wid}/${content?content:'content'}`} target="_blank" >
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
						}}>{filters.blockNullData(record, '—')}</span>;
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
							{filters.blockNullData(record.reason, '—')}
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
		const inputOption = {
		};
		return (
			<div className="yc-main-body">
				<div className="yc-right-content">
					<div className="yc-content-container-newPage">
						<BreadCrumb texts={['文书搜索']}/>
						<div className="yc-detail-content">
							<div className="yc-search-line document-search">
								<Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form">
									<Form.Item label="全文" style={{ width: '100%' }}>
										{getFieldDecorator('whole', inputOption)
											(<Input
												style={{ width: '100%' }}
												type="text"
												size='default'
												placeholder="姓名、公司、地址关键词等"
												autoComplete='off'
											/>)}
									</Form.Item>
									{
										documentSearchRecords&&documentSearchRecords.length>0&&
										<SearchRecord 
											records={documentSearchRecords}
											handClick={this.handClick}	
											clearRecords={this.clearRecords}
											isHover={isHover}
											handIconHover={this.handIconHover}
										/>
									}
									<Row style={{marginTop:8}}>
										<Col span={19}>
											<Form.Item label="案号">
												{getFieldDecorator('ah', inputOption)
													(<Input
														type="text"
														size='default'
														placeholder="案号"
														autoComplete='off'
													/>)}
											</Form.Item>
											<Form.Item label="法院">
												{getFieldDecorator('court', inputOption)
													(<Input
														type="text"
														size='default'
														placeholder="法院"
														autoComplete='off'
													/>)}
											</Form.Item>
											<Form.Item label="链接">
												{getFieldDecorator('url', inputOption)
													(<Input
														type="text"
														size='default'
														placeholder="文书源链接"
														autoComplete='off'
													/>)}
											</Form.Item>
										</Col>
										<Col span={5} style={{ textAlign: 'right' }}>
											<Form.Item>
												<Button type="primary" htmlType="submit" style={{ marginLeft: 15 }}>搜索</Button>
												<Button type="default" style={{ marginLeft: 10 }} onClick={this.clearSearch}>清空搜索条件</Button>
											</Form.Item>
										</Col>
									</Row>
								</Form>
							</div>
							<div className="yc-tab">
								<Spin tip="Loading..." spinning={loading}>
									<Table rowClassName="table-list"
										columns={columns}
										dataSource={tableList}
										rowKey={record => record.wenshuId}
										pagination={paginationProps}
										onChange={this.onTablePageChange}
										locale={{emptyText: <div className="no-data-box">
																<img src={NoDataIMG} alt="暂无数据"/>
																<p>暂无数据</p>
															</div>}}
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
const SearchRecord=(props)=>(
	<div className="record-content">
		<span className="record-title">最近搜索：</span>
		{
			props.records.map((item,index)=>{
				return <span key={`records${index}`} onClick={()=>props.handClick(item,index)}>{item}</span>
			})
		}
		 <Popover content={'清空最近搜索记录'}>
		 		<span className="del_icon"><img src={props.isHover?RecordsDelHover:RecordsDel} onClick={props.clearRecords} onMouseOver={()=>props.handIconHover(true)} onMouseLeave={()=>props.handIconHover(false)} alt="" /></span>
         </Popover>
	</div>
)
export default withRouter(searchForm()(Check));
