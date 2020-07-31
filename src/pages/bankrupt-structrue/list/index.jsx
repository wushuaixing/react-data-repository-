import React from 'react';
import { Tabs } from 'antd';
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
				{ title: '全部', key: 'A100', rule: 'A' },
				{ title: '未标记', key: 'A101', rule: 'A' },
				{ title: '已标记', key: 'A102', rule: 'A' },
				{ title: '自动退回', key: 'A103', rule: 'A' },
				{ title: '未标记', key: 'B101', rule: 'S' },
				{ title: '已标记', key: 'B102', rule: 'S' },
				{ title: '待修改', key: 'B103', rule: 'S' },
			]
		};
	}

	tabChange=(activeKey)=>{
		this.setState({ activeKey })
	};

	tableChange=(params)=>{
		console.log(params);
	};

	toQuery=()=>{
		console.log('查询数据');
	};

	render() {
		const { panes, activeKey } = this.state;
		return (
			<div className="yc-bankrupt-wrapper">
				<div className="yc-bankrupt-content">
					<BreadCrumb texts={['破产重组结构化']} />
					<div className="yc-bankrupt-content-all">
						<Query />
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
