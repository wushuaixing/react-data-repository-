/** document detail * */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { message, Button, Spin } from 'antd';
import { wenshuDetail } from '../../../server/api';
import { filters } from "../../../utils/common";
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
		let text = document.getElementById("link-detail").innerText; //
		let clipBoard = document.querySelectorAll('.container_rightInfo textarea')[0];//隐藏的剪切板
		clipBoard.value = text; // 修改文本框的内                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        容
		clipBoard.select(); // 选中剪切板
		document.execCommand("copy"); // 执行浏览器复制命令
		message.info("复制成功");
	};
	openLink = (url) => {
		window.open(url);
	};

	render() {
		const { data, ellipsisButtonVisible, loading } = this.state;
		return (
			<Spin tip="Loading..." spinning={loading}>
				<div className="externalSource-document">
					<div className="container">
						<div className="container_body">
							<div className="title">
								{data.title}
							</div>
							<div className="publishTime">
								<p>发布日期：{filters.formatStandardDate(data.publishTime)}</p>
							</div>
							<div className="line" />
							<div className="content-container">
								<div dangerouslySetInnerHTML={{ __html: data.content }}></div>
							</div>
						</div>
						<div className="container_rightInfo">
							<textarea />
							<div>
								<div className="title">基本信息</div>
								<div>
									<div className="message-line">
										<p className="message-line-left">审理法院:</p>
										<p className="message-line-right">{filters.blockNullByBar(data.court)}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">案件类型:</p>
										<p className="message-line-right">{filters.blockNullByBar(data.caseType)}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">案由:</p>
										<p className="message-line-right" >{filters.blockNullByBar(data.reason)}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">审理程序:</p>
										<p className="message-line-right">{filters.blockNullByBar(data.trialRound)}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">裁判日期:</p>
										<p className="message-line-right">{filters.formatStandardDate(data.trialDate)}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">当事人:</p>
										<input type="checkbox" name="toggle" id="toggle" style={{ display: 'none' }} />
										<p className="message-line-right">{filters.blockNullByBar(data.appellors)}</p>
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
				</div>
			</Spin>

		);
	}
}
export default withRouter(DocumentDetail);
