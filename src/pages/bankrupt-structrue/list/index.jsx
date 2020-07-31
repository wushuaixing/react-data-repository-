import React from 'react';
import { Tabs} from 'antd';
import { BreadCrumb } from "@/components/common";
import Query from './query';
import Table from './table';
import './style.scss';

export default class BankruptList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey:'A100',
			panes:[
				{ title: '全部', key: 'A100', rule: 'A' ,approveStatus:3},
				{ title: '未标记', key: 'A101', rule: 'A',approveStatus:0 },
				{ title: '已标记', key: 'A102', rule: 'A' ,approveStatus:1},
				{ title: '自动退回', key: 'A103', rule: 'A',approveStatus:2 },
				{ title: '未标记', key: 'B101', rule: 'S',approveStatus:0 },
				{ title: '已标记', key: 'B102', rule: 'S',approveStatus:1 },
				{ title: '待修改', key: 'B103', rule: 'S',approveStatus:2 },
			],
			dataSource:[],
			page:1,
		};
	}

	componentDidMount() {

	}

	getApproveStatus = activeKey => {
		const { panes } = this.state;
		return (panes.filter(i=>i.key===activeKey)[0]||{}).approveStatus;
	};

	tabChange=(activeKey)=>{
		this.setState({ activeKey });
		this.toQuery({ approveStatus:this.getApproveStatus(activeKey) },true)
	};

	tableChange=(params)=>{
		console.log(params);
	};

	toQuery=(params,init)=>{
		const _params = Object.assign({},params,init?{page:1,num:10}:{});
		console.log('查询数据:',_params);
	};

	render() {
		const { panes, activeKey } = this.state;
		return (
			<div className="yc-bankrupt-wrapper">
				<div className="yc-bankrupt-content">
					<BreadCrumb texts={['破产重组结构化']} />
					<div className="yc-bankrupt-content-all">
						<Query onSearch={params =>this.toQuery(params,true)} />
						<Tabs onChange={this.tabChange} activeKey={activeKey} className='yc-bankrupt-content_tabs' >
							{ panes.map(i=><Tabs.TabPane tab={i.title} key={i.key} />) }
						</Tabs>
						<Table activeKey={activeKey} onChange={this.tableChange} dataSource={[]} />
					</div>
				</div>
			</div>
		);
	}
}
