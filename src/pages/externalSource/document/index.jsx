/** document detail * */
import React from 'react';
import {withRouter} from 'react-router-dom';
import {message, Button, Spin} from 'antd';
import {wenshuDetail} from '../../../server/api';
import {dataFilter} from "../../../utils/common";
import './style.scss';

class  DocumentDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: {},
			isBu: false,
			html: '',
			loading: false,
		};
		this.textInput = null;
		this.textBox = element => {
			this.textInput = element;
		};
		this.getHeight = () => {
			if (this.textInput) {
				return this.textInput.clientHeight
			}
		}
	};


	componentDidMount() {
		const {Id} = this.props.match.params;
		this.setState({
			loading:true,
		});
		wenshuDetail(Id).then(res => {
			this.setState({
				loading:false,
			});
			if (res.data.code === 200) {
				let data=res.data.data;
				data.publishTime=dataFilter(data.publishTime);
				data.trialDate=dataFilter(data.trialDate);
				let detail =
					"<div>" + res.data.data.content + "</div>";
				this.setState({
					data:data,
					html:detail,
				});
				if(data.appellors){
					const height=this.getHeight();
					if(height>50){
						this.setState({
							isBu:true,
						})
					}
				}
			} else {
				message.error(res.data.message);
			}
		});
	}


	copy=()=> {
		var text = document.getElementById("link-detail").innerText;
		var input = document.getElementById("document-detail-input");
		input.value = text; // 修改文本框的内容
		input.select(); // 选中文本
		document.execCommand("copy"); // 执行浏览器复制命令
		message.info("复制成功");
	};

	openLink=(url)=> {
		window.open(url);
	};

	render() {
		const {data,html,isBu,loading}=this.state;
		return(
			<Spin tip="Loading..." spinning={loading}>
				<div>
					<div className="document-detail">
						<div className="document-detail-left">
							<div className="title">
								{ data.title }
							</div>
							<div className="publish-time">
								<p>发布日期：</p>
								<p>{ data.publishTime ? data.publishTime : '--' }</p>
							</div>
							<div className="line"/>
							<div className="detail">
								<div id="document-detail-content" dangerouslySetInnerHTML={{ __html: html }}>
								</div>
							</div>
						</div>
						<div className="document-detail-right">
							<textarea id="document-detail-input"/>
							<div>
								<p>
									基本信息
								</p>
								<div>
									<div className="message-line">
										<p className="message-line-left">审理法院:</p>
										<p className="message-line-right">{ data.court ? data.court : '--'}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">案件类型:</p>
										<p className="message-line-right">{ data.caseType ? data.caseType : '--' }</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">案由:</p>
										<p className="message-line-right" >{ data.reason ? data.reason : '--' }</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">审理程序:</p>
										<p className="message-line-right">{ data.trialRound ? data.trialRound : '--'}</p>
									</div>
									<div className="message-line">
										<p className="message-line-left">裁判日期:</p>
										<p className="message-line-right">{ data.trialDate ? data.trialDate : '--'}</p>
									</div>
									<div className="message-line" ref={this.textBox}>
										<p className="message-line-left">当事人:</p>
										<input type="checkbox" name="toggle" id="toggle" style={{display: 'none'}} />
											<p className="message-line-right" ref="toggleBox">{ data.appellors ? data.appellors : '--'}</p>
												{isBu && <label htmlFor="toggle" className="message-line-right" style={{color:'#0099CC'}} />}
									</div>
								</div>
							</div>
							<div style={{marginTop: 16}}>
								<p>
									源链接
								</p>
								<p className="link" id="link-detail" onClick={()=>this.openLink(data.url)}>{ data.url }</p>
							<Button style={{float: 'right'}} onClick={this.copy}>复制链接</Button>
					</div>
				</div>
					</div>
				</div>
			</Spin>

		);
	}
}
export default withRouter(DocumentDetail);
