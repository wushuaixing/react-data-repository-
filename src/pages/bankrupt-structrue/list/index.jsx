import React from 'react';
import Query from './query';
import Table from './table';
import { Tabs } from 'antd';
import './style.scss';
import {BreadCrumb} from "@/components/common";

export default class BankruptList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey:'A101',
			panes:[
				{ title: '全部', key: 'A101', rule: 'A' },
				{ title: '未标记', key: 'A102', rule: 'A' },
				{ title: '已标记', key: 'A103', rule: 'A' },
				{ title: '自动退回', key: 'A104', rule: 'A' },
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

	render() {
		const { panes, activeKey } = this.state;
		return (
			<div className="yc-bankrupt-wrapper">
				<div className="yc-bankrupt-content">
					<BreadCrumb texts={['破产重组结构化']} />
					<div className="yc-bankrupt-content-all">
						<Query />
						<Tabs tabPosition={this.state.tabPosition} onChange={this.tabChange} activeKey={activeKey} className='yc-bankrupt-content_tabs' >
							{ panes.map(i=><Tabs.TabPane tab={i.title} key={i.key} />) }
						</Tabs>
						<Table activeKey={activeKey} onChange={this.tableChange} dataSource={[]} />
					</div>
				</div>
			</div>
		);
	}
}
