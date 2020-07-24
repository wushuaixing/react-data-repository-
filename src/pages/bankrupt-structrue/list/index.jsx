import React from 'react';
import Query from './query';
import Table from './table';
import { Tabs } from 'antd';
import './style.scss';


export default class BankruptList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			activeKey:'A101',
			panes:[
				{title:'全部',key:'A101'},
				{title:'已标记',key:'A102'},
				{title:'自动退出',key:'A103'},
				{title:'待标记',key:'B101'},
				{title:'已标记',key:'B102'},
				{title:'待修改',key:'B103'},
			]
		};
	}

	render() {
		const { panes } = this.state;
		return (
			<div className="yc-bankrupt-wrapper">
				<Query />
				<Tabs tabPosition={this.state.tabPosition}>
					{ panes.map(i=><Tabs.TabPane tab={i.title} key={i.key} />) }
				</Tabs>
				<Table />
			</div>
		);
	}
}
