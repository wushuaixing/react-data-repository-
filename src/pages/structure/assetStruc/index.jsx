/** admin * */
import React from 'react';
import {Form, Input, Button, DatePicker, Tabs, Table,message} from 'antd';
import {Columns} from "../../../static/columns";
import {structuredList} from "../../../server/api";
import {Link, withRouter} from "react-router-dom";
import 'antd/dist/antd.css';


// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

const searchForm = Form.create;


class  Asset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			num: 10,
			page:1,
			total:'',
			tableList:[],
			waitNum:0,
			status:'',
		};
  }

  componentDidMount() {
		//详情页跳回路由
		if(this.props.location.state){
			let {statusPath,pagePath,tabPath,Id}=this.props.location.state;
			let _status=parseInt(statusPath);
			let _page=parseInt(pagePath);
			this.setState({
				tabIndex:tabPath,
			});
			if(Id){
				let _Id=parseInt(Id);
				this.getApi({_Id});
			}
			this.getTableList(_status,_page);
		}
		else {
			this.getTableList(0, 1);
		}
		this.getWaitNum();

	};

  getWaitNum=()=>{
		structuredList({
			approveStatus: 2,
			num: 10,
			page: 1,
		}).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
					this.setState({
						waitNum:res.data.total,
					});
			} else {
				message.error(res.data.message);
			}
		});

	};

  getApi=(params)=>{
		structuredList(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				let _list=res.data.data;
				_list.map((item)=>{
					let _temp=[];
					_temp.push(item.status);
					item.status=_temp;
					// item=Object.assign(item,{key:index})
				});
				this.setState({
					tableList:_list,
					total:res.data.total,
					status:params.approveStatus,
				});
				if(params.approveStatus === 2){
					this.setState({
						waitNum:res.data.total,
					});
				}
			} else {
				message.error(res.data.message);
			}
		});
	};

	//get table dataSource
	getTableList=(approveStatus,page)=>{
		let params = {
			approveStatus: approveStatus,
			num: 10,
			page: page,
		};
		let _index = approveStatus.toString();
		this.setState({
			tabIndex:_index,
		});
		this.getApi(params);
	};

	//切换Tab
	changeTab=(key)=>{
		// approveStatus| 状态 0未标记 1已标记 2待修改
		if (key === "0") {
			this.getTableList(0,1);
		} else if (key === "1") {
			this.getTableList(1,1);
		} else if (key === "2") {
			let ifWait=true;
			this.getTableList(2,1,ifWait);
		}
	};

	//换页
	onChangePage=(pagination)=>{
		const {status,page}=this.state;
		this.setState({
			page: pagination.current,
		});
		this.getTableList(status,page);
	};

	//日期转换
	dataFilter=(value)=>{
		let data = new Date(value);
		let year = data.getFullYear();
		let month = data.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		let date = data.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		return year + "-" + month + "-" + date;
	};

	//搜索框
	handleSearch = e => {
		e.preventDefault();
		const {status}=this.state;
		const searchTitle=this.props.form.getFieldValue('title');
		const startTime=this.props.form.getFieldValue('start');
		const endTime=this.props.form.getFieldValue('end');
		let params={
			approveStatus: '',
			title: '',
			page: 1,
			num: 10,
			tabIndex:"0"
		};
		let _params=Object.assign(params,{
			approveStatus: status,
			title: searchTitle,
		});
		if(status !== 0){
			if(startTime){_params.structuredStartTime=this.dataFilter((startTime))}
			if(endTime){_params.structuredEndTime=this.dataFilter((endTime))}
		}
		this.getApi(_params);
		// structuredList(params).then(res => {
		// 	if (res.data.code === 200) {
		// 		// this.loading = false;
		// 		let _list=res.data.data;
		// 		_list.map((item)=>{
		// 			let _temp=[];
		// 			_temp.push(item.status);
		// 			item.status=_temp;
		// 		});
		// 		this.setState({
		// 			tableList: _list,
		// 			total: res.data.total,
		// 		});
		// 	} else {
		// 		console.log('wrong');
		// 	}
		// });
	};

	//清空搜索条件
	clearSearch=()=>{
		this.props.form.resetFields();
		const {status}=this.state;
		this.getTableList(status,1);
	};

  render() {
    const { getFieldDecorator } = this.props.form;
		const {tableList,total,waitNum,page,status,tabIndex}=this.state;
		//待标记无时间搜索
		let timeSearch=false;
		if(status !== 0){timeSearch=true}
		const columns = [
			Columns[4],
			Columns[5],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
				<Link to={`/index/${record.id}/${record.status}/${page}/${status}`}>
        <Button>
					标注
        </Button>
				</Link>
      </span>
				),
			},

		];
		const columnsRevise = [
			{
				title: "结构化时间",
				dataIndex: "completeTime",
			},
			Columns[4],
			Columns[5],
			{
				title: "操作",
				dataIndex: "action",
				align: "center",
				width: 180,
				render: (text, record) => (
					<span>
						<Link to={`/index/${record.id}/${record.status}/${page}/${status}`}>
							<Button>
								修改标注
							</Button>
						</Link>
      		</span>
				),

			}
		];
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
              <div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>资产结构化</div>
              <div className="yc-button-goback">
                <Button type="default">获取新数据</Button>
              </div>
            </div>
            <div className="yc-detail-content">
              <div className="yc-search-line">
                <Form layout="inline" onSubmit={this.handleSearch} className="yc-search-form" style={{marginLeft:10,marginTop:15}}>
                  <Form.Item label="标题">
                    {getFieldDecorator('title', {})
                    (<Input
                      type="text"
                      size='default'
                      style={{ width: 240 }}
											placeholder="拍卖信息标题"
                    />)}
                  </Form.Item>
									{
										timeSearch &&
										<Form.Item label="结构化时间">
											{getFieldDecorator('start', {})
											(<DatePicker
												placeholder="开始时间"
												style={{width:108}}
											/>)}
										</Form.Item>
									}
									{
										timeSearch &&
										<Form.Item label="至">
											{getFieldDecorator('end', {})
											(<DatePicker
												placeholder="结束时间"
												style={{width: 108}}
											/>)}
										</Form.Item>
									}
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15,fontSize:12}}>
                      搜索
                    </Button>
                    <Button type="default" style={{marginLeft:5,fontSize:12}} onClick={this.clearSearch}>
                      清空搜索条件
                    </Button>
                  </Form.Item>
                </Form>
              </div>
							<div className="yc-tab">
								<Tabs activeKey={tabIndex}  onChange={this.changeTab}>
									<TabPane tab="待标记" key="0">
										<Table rowClassName="table-list"
													 columns={columns}
													 dataSource={tableList}
													 style={{margin:10,}}
													 rowKey={record => record.id}
													 onChange={this.onChangePage}
													 pagination={paginationProps}
										/>
									</TabPane>
									<TabPane tab="已标记" key="1">
										<Table rowClassName="table-list"
													 columns={columnsRevise}
													 dataSource={tableList}
													 style={{margin:10}}
													 rowKey={record => record.id}
													 onChange={this.onChangePage}
													 pagination={paginationProps}
										/>
									</TabPane>
									<TabPane tab={<span>待修改<span style={{color:'red',marginLeft:2}}>({waitNum})</span></span>} key="2">
										<Table rowClassName="table-list"
													 columns={columnsRevise}
													 dataSource={tableList}
													 style={{margin:10}}
													 rowKey={record => record.id}
													 onChange={this.onChangePage}
													 pagination={paginationProps}
										/>
									</TabPane>
								</Tabs>
							</div>
            </div>
          </div>

        );
	}
}
export default withRouter(searchForm()(Asset));
