/** admin * */
import React from 'react';
import {Form, Input, Button, DatePicker, Tabs, Table,Badge} from 'antd';
import 'antd/dist/antd.css';
import Pagination from "../../admin/accountManage";
import {structuredList} from "../../../server/api";

// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

const searchForm = Form.create;
const columns = [
	{
		title: "拍卖标题",
		dataIndex: "title",
	},
	{
		title: "结构化状态",
		dataIndex: "status",
		width: 285,
	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: 180,
		render: () => (
			<Button onClick={()=>this.onChangePage}>
				标注
			</Button>
		),
	}
];
const columnsRevise = [
	{
		title: "拍卖标题",
		dataIndex: "title",
	},
	{
		title: "结构化状态",
		dataIndex: "status",
		width: 285,
		render: (status) => (
			<span>
        {status.map((item,index) => {
        	let color='default';
        	let text='待标记';
					if (item === 0) {
						color = 'default';
						text='待标记';
					}
					else if (item === 1) {
						color = 'success';
						text='已标记';
					}else if(item === 2){
						color = 'error';
						text='待修改';
					}
					return (
						<Badge status={color} text={text} key={index} />
					);
				})}
      </span>
		),

	},
	{
		title: "操作",
		dataIndex: "action",
		align: "center",
		width: 180,
		render: () => (
			<Button onClick={()=>this.onChangePage}>
				修改标注
			</Button>
		),
	}
];

class  Asset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
			num: 10,
			page:1,
			total:0,
			tableList:[],
			waitNum:0,
		};
  }

  componentWillMount() {

  };

  componentDidMount() {
		this.getTableList(0,1);
  };

	//get table dataSource
	getTableList=(approveStatus,page,ifWait)=>{
		let params = {
			approveStatus: approveStatus,
			num: 10,
			page: page,
		};
		structuredList(params).then(res => {
			if (res.data.code === 200) {
				// this.loading = false;
				let _list=res.data.data;
				let _temp=[];
				_list.map((item,index)=>{
						_temp.push(item.status);
						item.status=_temp;
						item=Object.assign(item,{key:index})
				});
				this.setState({
					tableList:_list,
					total:res.data.total,
				});
				if(ifWait){
					this.setState({
						waitNum:res.data.total,
					});
				}
			} else {
				// this.$Message.error(res.data.message);
			}
		});
	};

	//切换Tab
	changeTab=(key)=>{
		// approveStatus| 状态 0未标记 1已标记 2待修改
		if (key === "1") {
			this.getTableList(0,1);
		} else if (key === "2") {
			this.getTableList(1,1);
		} else if (key === "3") {
			let ifWait=true;
			this.getTableList(2,1,ifWait);
		}
		// const {approveStatus,page,}=this.state;

	};

	//换页
	onChangePage=(page)=>{
		this.setState({
			page: page,
		});
	};

  render() {
    const { getFieldDecorator } = this.props.form;
		const {tableList,total,waitNum}=this.state;

		return(
          <div>
            <div className="yc-detail-title">
              <div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>资产结构化</div>
              <div className="yc-button-goback">
                <Button type="default" onClick={()=>this.goBack}>获取新数据</Button>
              </div>
            </div>
            <div className="yc-detail-content">
              <div className="yc-search-line">
                <Form layout="inline" onSubmit={this.handleSubmit} className="yc-search-form" style={{marginLeft:10,marginTop:15}}>
                  <Form.Item label="标题">
                    {getFieldDecorator('title', {})
                    (<Input
                      type="text"
                      size='default'
                      style={{ width: 240 }}
                    />)}
                  </Form.Item>
                  <Form.Item label="结构化时间">
                    {getFieldDecorator('start', {})
                    (<DatePicker
                      placeholder="开始时间"
                      style={{width:108}}
                    />)}
                  </Form.Item>
                  <Form.Item label="至">
                    {getFieldDecorator('end', {})
                    (<DatePicker
                      placeholder="结束时间"
                      style={{width:108}}
                    />)}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15}}>
                      搜索
                    </Button>
                    <Button type="default" htmlType="submit" style={{marginLeft:5}}>
                      清空搜索条件
                    </Button>
                  </Form.Item>
                </Form>
              </div>
							<div className="yc-tab">
								<Tabs defaultActiveKey="1"  onChange={this.changeTab}>
									<TabPane tab="待标记" key="1">
										<Table className="table-list" columns={columns} dataSource={tableList} style={{margin:10,width:1240}} />
									</TabPane>
									<TabPane tab="已标记" key="2">
										<Table className="table-list" columns={columnsRevise} dataSource={tableList} style={{margin:10,width:1240}} />
									</TabPane>
									<TabPane tab={<span>待修改<span style={{color:'red',marginLeft:2}}>({waitNum})</span></span>} key="3">
										<Table className="table-list" columns={columnsRevise} dataSource={tableList} style={{margin:10,width:1240}} />
									</TabPane>
								</Tabs>
								<Pagination showQuickJumper={true} defaultCurrent={1} pageSize={10} total={total} onChange={this.onChangePage} />
							</div>
            </div>
          </div>
        );
    }
}
export default searchForm()(Asset);
