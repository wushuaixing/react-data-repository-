import React from "react";
import { Badge } from "antd";
import { AUCTION_STATUS } from './status'
/**
 * created by anran on 2020-02-20.
 */
export const Columns = [
	{
		title: "拍卖信息",
		dataIndex: "info",
		render: (text, record) => {
			return (
				<span>
					{
						record && record.info &&
						<div className="info">
							<div className="info-line">
								<a href={record.info.url} target="_target">{record.info.title}</a>
							</div>
							<div className="info-line">
								<p>处置法院/单位:{record.info.court}</p>
							</div>
							<div className="info-line">
							<p>拍卖时间:{record.info.start}</p>
							</div>
							<div className="info-line">
								<p>拍卖状态:{AUCTION_STATUS[record.info.status]}</p>
							</div>
							<div className="info-line">
								<p>{`评估价:${record.info.consultPrice}元`}</p>
							</div>
							<div className="info-line">
								<p>{`起拍价:${record.info.initialPrice}元`}</p>
							</div>
						</div>
					}
				</span>
			)
		}
	},
	{
		title: "状态",
		dataIndex: "status",
		width: 180,
		render: (status) => (
			<span>
				{
					(() => {
						let color = 'default';
						let text = '';
						switch (status) {
							case 1:
								text = '未检查';
								break;
							case 2:
								color = 'success';
								text = '检查无误';
								break;
							case 3:
								color = 'error';
								text = '检查错误';
								break;
							case 4:
								color = 'success';
								text = '已修改';
								break;
							case 5:
								color = 'error';
								text = '待确认';
								break;
							default:
								text = '未标记'
								break;
						}
						return (
							<Badge status={color} text={text} />
						);
					})()
				}

			</span>
		),
	},
	{
		title: "结构化人员",
		dataIndex: "structPersonnel",
		render: (text, record) => (
			<span>
				{!record.structPersonnelEnable ?
					<p style={{ fontSize: 12 }}>{record.structPersonnel ? record.structPersonnel : '--'}
						<span style={{ color: 'rgb(177, 177, 177)' }}>(已删除)</span></p>
					: <p style={{ fontSize: 12 }}>{record.structPersonnel}</p>
				}
			</span>
		),
	},
	{
		title: "检查人员",
		dataIndex: "checkPersonnel",
		render: (text, record) => (
			<span>
				<p style={{ fontSize: 12 }}>{record.checkPersonnel ? record.checkPersonnel : '--'}</p>
			</span>
		),
	},
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
				{
					(() => {
						let color = 'default';
						let text = '待标记';
						switch (status) {
							case 0:
								color = 'default';
								text = '待标记';
								break;
							case 1:
								color = 'success';
								text = '已标记';
								break;
							case 2:
								color = 'error';
								text = '待修改';
								break;
							default:
								break;
						}
						return (
							<Badge status={color} text={text} />
						);
					})()
				}
			</span>
		),
	},


];

