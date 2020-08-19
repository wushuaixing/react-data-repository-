import React from 'react';
import { Table } from 'antd';
import { withRouter } from 'react-router';
import { Auction } from '../common';
import Api from '@/server/bankruptcy';
import NoDataIMG from '../../../assets/img/no_data.png';

class ListTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
		};
		this.history = props.history;
	}

	get normalCol() {
		const { activeKey,approveStatus,rule } = this.props;
		const render = {
			status: (status) => {
				let background = '#FFF';
				let text = '-';
				if (status === 1) { background = '#1DB805'; text = '已标记'; }
				else if (status === 2) { background = '#FA9214'; text = '自动退回'; }
				else if (status === 0) { background = '#B8BBBE'; text = '未标记'; }
				return (
					<div className="list-table-status">
						<span className="list-table-status_dot" style={{ background }} />
						<span className="list-table-status-text">{text}</span>
					</div>
				);
			},
			operate: (val, { id, status }) => {
				let text = '';
				if (/^A/.test(activeKey)) text = '查看';
				else if (activeKey === 'B101') text = '标注';
				else if (activeKey === 'B102' || activeKey === 'B103') text = '修改标注';
				return text && <Auction history={this.history} check={rule==='normal'} approveStatus={status}
					key={`${id}approveStatus`} text={text} api={()=>Api.getStatus(id)}
					href={`/index/bankrupt/detail/${id}`}
				/>;
			},
		};
		if (approveStatus === 0 ) {
			return [
				{
					title: '标题',
					dataIndex: 'title',
					key: 'title',
					width: 850,
					render: (text,row) =>text? <a href={row.url} target='_blank' rel="noopener noreferrer" className="a-link">{text}</a>:'-',
				},
				{
					title: '发布日期',
					dataIndex: 'publishTime',
					key: 'date',
					width: 250,
					render:val=>val||'-'
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
				dataIndex: 'companyName',
				key: 'companyName',
				width: 350,
				render:val=>val||'-'
			},
			{
				title: '标题',
				dataIndex: 'title',
				key: 'title',
				width: 350,
				render: (text,row) =>text? <a href={row.url} target='_blank' rel="noopener noreferrer" className="a-link">{text}</a>:'-',
			},
			{
				title: '发布日期',
				dataIndex: 'publishTime',
				key: 'date',
				width: 110,
				render:val=>val||'-'
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
				render:val=>val||'-'
			},
			{
				title: '最后更新者',
				dataIndex: 'approverName',
				key: 'updater',
				width: 110,
				render:val=>val||'-'
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

	onChange =({current})=>{
		const { onChange } = this.props;
		if(onChange)onChange(current);
	};

	render() {
		const { dataSource,page:current,total,num,loading } = this.props;
		const props = {
			loading,
			dataSource,
			columns:this.normalCol,
			onChange:this.onChange,
			pagination:{
				defaultPageSize:num,
				showQuickJumper:true,
				current,
				total,
				defaultCurrent:1,
				showTotal:e=>`共 ${e} 条`
			}
		};
		return (
			<div className="list-table-wrapper">
				<Table className='list-table'
					   rowKey={e=>e.id} {...props} 
					   locale={{emptyText: <div className="no-data-box">
												<img src={NoDataIMG} alt="暂无数据"/>
												<p>暂无数据</p>
										   </div>}}  
					   />
			</div>
		);
	}
}
export default withRouter(ListTable)
