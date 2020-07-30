import React from 'react';
import { Table, Button } from 'antd';

export default class ListTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [
				{
					title: '（2019）川0107破6号受理破产清算申请-公告',
					company: '上海华江电力实业公司',
					updater: '李',
					status: 1,
					publishTime: '2019-12-22',
					updateTime: '2019-12-04 21:02:36',
				},
				{
					title: '（2019）川0107破6号受理破产清算申请-公告（2019）川0107破6号受理破产清算申请-公告（2019）川0107破6号受理破产清算申请-公告川0107破6号受理破产清算申请-公告',
					company: '天津液压机械（集团）有限公司、天津开发区华赢联合有限公司',
					updater: '智',
					status: 2,
					publishTime: '2019-12-22',
					updateTime: '2019-12-04 21:02:36',
				},
				{
					title: '（2019）川0107破6号受理破产清算申请-公告（2019）川0107破6号受理破产清算申请-公告（2019）川0107破6号受理破产清算申请-公告川0107破6号受理破产清算申请-公告',
					company: '天津液压机械（集团）有限公司、天津开发区华赢联合有限公司',
					updater: '恩',
					status: 3,
					publishTime: '2019-12-22',
					updateTime: '2019-12-04 21:02:36',
				},
			],
		};
	}

	get normalCol() {
		const { activeKey } = this.props;
		const render = {
			status: (status) => {
				let background = '#FFF';
				let text = '--';
				if (status === 1) { background = '#1DB805'; text = '已标记'; }
				else if (status === 2) { background = '#FA9214'; text = '自动退回'; }
				else if (status === 3) { background = '#B8BBBE'; text = '未标记'; }
				return (
					<div className="list-table-status">
						<span className="list-table-status_dot" style={{ background }} />
						<span className="list-table-status-text">{text}</span>
					</div>
				);
			},
			operate: () => {
				let text = '';
				if (/^A/.test(activeKey)) text = '查看';
				else if (activeKey === 'B101') text = '标注';
				else if (activeKey === 'B102' || activeKey === 'B103') text = '修改标注';
				return text && <Button size="small" type="primary" ghost style={{ minWidth: 60 }}>{text}</Button>;
			},
		};
		if (activeKey === 'A102' || activeKey === 'B101') {
			return [
				{
					title: '标题',
					dataIndex: 'title',
					key: 'title',
					width: 850,
					render: text => <a>{text}</a>,
				},
				{
					title: '发布日期',
					dataIndex: 'publishTime',
					key: 'date',
					width: 250,
				},
				{
					title: () => <span style={{ paddingLeft: 10 }}>状态</span>,
					dataIndex: 'status',
					key: 'status',
					width: 250,
					render: render.status,
				},
				{
					title: '操作',
					dataIndex: 'age',
					key: 'action',
					width: 250,
					render: render.operate,
				},
			];
		}
		return [
			{
				title: '破产企业名称',
				dataIndex: 'company',
				key: 'company',
				width: 400,
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: 400,
				render: text => <a>{text}</a>,
			},
			{
				title: '发布日期',
				dataIndex: 'publishTime',
				key: 'date',
				width: 110,
			},
			{
				title: () => <span style={{ paddingLeft: 10 }}>状态</span>,
				dataIndex: 'status',
				key: 'status',
				width: 110,
				render: render.status,
			},
			{
				title: '更新时间',
				dataIndex: 'updateTime',
				key: 'update',
				width: 180,
			},
			{
				title: '最后更新者',
				dataIndex: 'updater',
				key: 'updater',
				width: 110,
			},
			{
				title: '操作',
				key: 'address',
				width: 110,
				className: 'list-table-align_center',
				render: render.operate,
			},
		];
	}

	render() {
		const { dataSource } = this.state;
		return (
			<div className="list-table-wrapper">
				<Table dataSource={dataSource} columns={this.normalCol} className='list-table'/>
			</div>
		);
	}
}
