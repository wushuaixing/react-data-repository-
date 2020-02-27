/** document detail * */
import React from 'react';
import {withRouter} from 'react-router-dom';
import {message, Button, Spin} from 'antd';
import {wenshuDetail} from '../../../server/api';
import './style.scss';

class  DocumentDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data:{},
			isBu:false,
			html:'',
			loading:false,
		};
	}

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
				data.publishTime=this.dataFilter(data.publishTime);
				data.trialDate=this.dataFilter(data.trialDate);
				let detail =
					"<div>" + res.data.data.content + "</div>";
				this.setState({
					data:data,
					html:detail,
				});
				//
				// if(data.appellors){
				// 	// console.log('ifdata',this.data.appellors)
				// 	if(this.$refs.textBox.offsetHeight && this.$refs.toggleBox.offsetHeight){
				// 		let _isBu= this.$refs.toggleBox.offsetHeight == 54;
				// 		this.setState({
				// 			isBu:_isBu,
				// 		});
				// 	}
				// }
				// item.detail = item.detail.replace(new RegExp(searchText,'g'),'<span>'+searchText+'</span>');
				// let subjectMatterIntroduction =
				// 	"<span><div>" + res.data.data["content"] + "</div></span>";
				//
				// document
				// 	.getElementById("document-detail-content")
				// 	.appendChild(
				// 		this.$parseDom(this.$clearStyle(subjectMatterIntroduction))[0]
				// 	);
			} else {
				message.error(res.data.message);
			}
		});
	}


	dataFilter=(value)=> {
		let data = new Date(value);
		let year = data.getFullYear();
		let month = data.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		let date = data.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		return year + "-" + month + "-" + date;
	};

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
		const {data,html,loading}=this.state;
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
									<div className="message-line" ref="textBox">
										<p className="message-line-left">当事人:</p>
										<input type="checkbox" name="toggle" id="toggle" style={{display: 'none'}} />
											<p className="message-line-right" ref="toggleBox">{ data.appellors ? data.appellors : '--'}</p>
											<label for="toggle" className="message-line-right" style={{color:'#0099CC'}} />
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
