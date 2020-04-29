/** document detail * */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { message, Button, Spin } from 'antd';
import { wenshuDetail } from '@api';
import { filters, dateUtils } from "@/utils/common";
import copy from 'copy-to-clipboard'
import './style.scss';

class DocumentDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},  //数据
			ellipsisButtonVisible: false,  //当事人信息是否需要折叠或展开 默认不需要
			loading: false,
		};
		this.getHeight = () => {
			//获取当前右边当事人信息dom节点的高度 如果超过三行则需要做显示隐藏处理
			let node = Array.prototype.slice.call(document.querySelectorAll(".message-line"), -1)[0]
			return node.clientHeight;
		}
	};
	componentDidMount() {
		const { Id } = this.props.match.params;
		this.setState({
			loading: true,
		});
		wenshuDetail(Id).then(res => {
			if (res.data.code === 200) {
				let data = res.data.data;
				console.log(data)
				this.setState({
					data,
					loading: false
				});
				if (data.appellors && this.getHeight() > 50) {
					this.setState({
						ellipsisButtonVisible: true,
					})
				}
			} else {
				message.error(res.data.message);
			}
		});
	}
	copy = () => {
		let text = document.getElementById("link-detail").innerText;
		copy(text)
		message.success("复制成功"); 
	};
	openLink = (url) => {
		window.open(url);
	};

	render() {
		const { data, ellipsisButtonVisible, loading } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div className="externalSource-document-container">
					<div className="container_body">
						<div className="title">
							{data.title}
						</div>
						<div className="publishTime">
							<p>发布日期：{dateUtils.formatStandardDate(data.publishTime)}</p>
						</div>
						<div className="line" />
						<div className="content-container">
							<div dangerouslySetInnerHTML={{ __html: data.content }}></div>
						</div>
					</div>
					<div className="container_rightInfo">
						<div>
							<div className="title">基本信息</div>
							<div>
								<div className="message-line">
									<p className="message-line-left">审理法院:</p>
									<p className="message-line-right">{filters.blockNullData(data.court,'--')}</p>
								</div>
								<div className="message-line">
									<p className="message-line-left">案件类型:</p>
									<p className="message-line-right">{filters.blockNullData(data.caseType,'--')}</p>
								</div>
								<div className="message-line">
									<p className="message-line-left">案由:</p>
									<p className="message-line-right" >{filters.blockNullData(data.reason,'--')}</p>
								</div>
								<div className="message-line">
									<p className="message-line-left">审理程序:</p>
									<p className="message-line-right">{filters.blockNullData(data.trialRound,'--')}</p>
								</div>
								<div className="message-line">
									<p className="message-line-left">裁判日期:</p>
									<p className="message-line-right">{dateUtils.formatStandardDate(data.trialDate)}</p>
								</div>
								<div className="message-line">
									<p className="message-line-left">当事人:</p>
									<input type="checkbox" name="toggle" id="toggle" style={{ display: 'none' }} />
									<div className="message-line-right">{filters.blockNullData(data.appellors,'--')}</div>
									{ellipsisButtonVisible && <label htmlFor="toggle" className="message-line-right" />}
								</div>
							</div>
						</div>
						<div>
							<div className="title">
								源链接
								</div>
							<p className="link" id="link-detail" onClick={() => this.openLink(data.url)}>{data.url}</p>
							<Button style={{ float: 'right' }} onClick={this.copy}>复制链接</Button>
						</div>
					</div>
				</div>
			</Spin>

		);
	}
}
export default withRouter(DocumentDetail);
