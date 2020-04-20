import React from "react";
import { Badge } from "antd";

/**
 * created by anran on 2020-02-20.
 */
export const Columns = [
	{
		title: "拍卖信息",
		dataIndex: "info",
		render: (text, record) => (
			<span>
				{
					<div className="info">
						<p className="link" style={{ display: 'inline-block' }}>
							{record.info.title}
						</p>
						<div className="info-line">
							<p>处置法院/单位:{record.info.court}</p>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>拍卖时间:{record.info.start}</p>
							</div>
							<div className="line-half">
								<p style={{ margin: 10 }}>拍卖状态:</p>
								<p>{record.info.status}</p>
							</div>
						</div>
						<div className="info-line">
							<div className="line-half">
								<p>评估价:</p>
								<p>{record.info.consultPrice}</p>
							</div>
							<div className="line-half">
								<p style={{ margin: 10 }}>起拍价:</p>
								<p>{record.info.initialPrice}</p>
							</div>
						</div>
					</div>
				}
			</span>
		)
	},
	{
		title: "状态",
		dataIndex: "status",
		width: 180,
		render: (status) => (
			<span>
				{status.map((item, index) => {
					let color = 'default';
					let text = '';
					if (item === 1) {
						color = 'default';
						text = '未检查';
					}
					else if (item === 2) {
						color = 'success';
						text = '检查无误';
					} else if (item === 3) {
						color = 'error';
						text = '检查错误';
					}
					else if (item === 4) {
						color = 'success';
						text = '已修改';
					}
					else if (item === 5) {
						color = 'error';
						text = '待确认';
					} else {
						color = 'default';
						text = '未标记';
					}
					return (
						<Badge status={color} text={text} key={index} />
					);
				})}
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
				{!record.checkPersonnelEnable ?
					<p style={{ fontSize: 12 }}>{record.checkPersonnel ? record.checkPersonnel : '--'}
						<span style={{ color: 'rgb(177, 177, 177)' }}>(已删除)</span></p>
					: <p style={{ fontSize: 12 }}>{record.checkPersonnel}</p>
				}
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
