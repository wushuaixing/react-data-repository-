import React from 'react';
import { Tabs} from 'antd';
import moment from 'moment';
import { withRouter } from 'react-router';
import { BreadCrumb } from "@/components/common";
import Query from './query';
import Table from './table';
import Api from '@/server/bankruptcy'
import { parseQuery, urlEncode, scrollTop } from "@utils/tools";
import './style.scss';

class BankruptList extends React.Component {
	constructor(props) {
		super(props);
		const data = [
			{ title: '全部', key: 'A100', rule: 'A' ,approveStatus:3},
			{ title: '未标记', key: 'A101', rule: 'A',approveStatus:0 },
			{ title: '已标记', key: 'A102', rule: 'A' ,approveStatus:1},
			{ title: '自动退回', key: 'A103', rule: 'A',approveStatus:2 },
			{ title: '未标记', key: 'B101', rule: 'S',approveStatus:0 },
			{ title: '已标记', key: 'B102', rule: 'S',approveStatus:1 },
			{ title: '待修改', key: 'B103', rule: 'S',approveStatus:2 },
		];
		const defaultInfo = data[0];
		const queryRes = parseQuery();
		const activeKey = queryRes.approveStatus !== ''
			?((data.filter(i => i.approveStatus === Number(queryRes.approveStatus))[0] || {}).key||defaultInfo.key):defaultInfo.key;
		const approveStatus =queryRes.approveStatus?Number(queryRes.approveStatus):defaultInfo.approveStatus;
		queryRes.uid = queryRes.uid ==='0'?'':queryRes.uid;
		this.state = {
			activeKey,
			approveStatus,
			loading:false,
			panes:data,
			dataSource:[],
			page:1,
			num:10,
			total:0,
		};
		this.refQuery = null;
		this.params= {
			page:1,
			num:10,
			...queryRes,
			approveStatus
		};
	}

	componentDidMount(){
		this.toQuery(this.params,true);
		this.toSetDefaultQuery()
	}

	/**
	 * 设置默认查询条件
	 */
	toSetDefaultQuery = ()=>{
		const defaultParams = {};
		["companyName", "publishEndTime", "publishStartTime", "title", "uid", "updateEndTime", "updateStartTime"].forEach(i=>{
			if(/Time$/.test(i) && this.params[i]) defaultParams[i] = moment(this.params[i],'YYYY-MM-DD');
			else if(this.params[i])defaultParams[i] = this.paramsp[i];
		});
		this.refQuery.setFieldsValue(defaultParams);
	};

	/**
	 * tab 切换事件
	 * @param _activeKey
	 */
	tabChange=(_activeKey)=>{
		const { activeKey,panes } = this.state;
		const approveStatus = (panes.filter(i => i.key === _activeKey)[0] || {}).approveStatus;
		if(activeKey!==_activeKey){
			this.refQuery.resetFields();
			this.setState({ activeKey:_activeKey,approveStatus,dataSource:[]},()=>{
				this.toQuery({},true);
			});
		}
	};

	/**
	 * 查询数据
	 * @param params
	 * @param init 是否初始化辅助参数
	 */
	toQuery=(params = {}, init = false)=>{
		const { num,approveStatus } = this.state;
		const { history } = this.props;
		const _params = Object.assign(init?{}:this.params,params,init?{ page:1, num, approveStatus }:{});
		history.replace('/index/bankrupt?'+urlEncode(_params).replace(/^&/,''));
		this.setState({ loading:true });
		Api.bankruptcyList(_params).then(res=>{
			if(res.code===200){
				const {list,page,total} = res.data;
				this.setState({
					dataSource:list,
					page,
					total,
				},()=>scrollTop())
			}
		}).catch(error=>{
			console.log(error);
		}).finally(()=>{
			this.setState({loading:false})
		});
	};

	render() {
		const { panes, activeKey, num, page,total,dataSource,loading,approveStatus } = this.state;
		const tableProps = {
			dataSource,
			num,
			page,
			total,
			loading,
			approveStatus,
			activeKey,
		};
		const queryProps = {
			loading,
			simply:approveStatus===0,
		};
		return (
			<div className="yc-bankrupt-wrapper">
				<div className="yc-bankrupt-content">
					<BreadCrumb texts={['破产重组结构化']} />
					<div className="yc-bankrupt-content-all">
						<Query onSearch={params =>this.toQuery(params,true)} ref={e=>this.refQuery=e} {...queryProps}/>
						<Tabs onChange={this.tabChange} activeKey={activeKey} className='yc-bankrupt-content_tabs' >
							{ panes.map(i=><Tabs.TabPane tab={i.title} key={i.key} />) }
						</Tabs>
						<Table onChange={val=>this.toQuery({page:val})} {...tableProps}/>
					</div>
				</div>
			</div>
		);
	}
}

export default withRouter(BankruptList)
