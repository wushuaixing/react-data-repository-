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
			api().then(({code,message:mes})=>{
				if(code ===200) history.push(href);
				else message.error(mes)
			}).finally(()=>this.setState({loading:false}))
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
