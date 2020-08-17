import React from 'react';
import { Button, message } from "antd";

export default class Auction extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading:false
		};
	}

	onClick = () =>{
		const { history, href, api, check } = this.props;
		if(check){
			this.setState({ loading:true });
			api().then(({code})=>{
				this.setState({loading:false},()=>{
					if(code ===200) history.push(href);
					else message.warning('该数据已被标注，请到已标记列表查看',1.5)
				})
			}).catch(()=>this.setState({loading:false}));
		}else{
			history.push(href);
		}
	};

	render() {
		const { text } = this.props;
		const { loading } = this.state;
		return (
			<Button size="small" type="primary" ghost style={{ minWidth: 60, height:28 }} loading={loading} onClick={this.onClick}>
				{text}
			</Button>
		)
	}
}
