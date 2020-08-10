import React from 'react';
import { withRouter } from 'react-router';
import { BreadCrumb } from "@/components/common";
import { Button, Form, Input, Icon, Spin, message } from "antd";
import { Item ,ItemList } from './common';
import { ranStr } from "@utils/common";
import { rule } from "@/components/rule-container";
import Api from '@/server/bankruptcy';
import './style.scss';



class BankruptDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading:true,
			source:{}
		};
		this.baseStr = ranStr();
	}

	componentDidMount() {
		const { match:{ params } } = this.props;
		Api.getDetail(params.id).then(({code,data,message:mes})=>{
			if(code === 200){
				console.log(data);
				this.setState({source:data})
			}else{
				message.error(mes)
			}
		}).finally(()=>this.setState({loading:false }))
	}

	getItems = (field, placeholder = '请输入') => {
		if (!field) return;
		const { form: { getFieldValue, getFieldDecorator, setFieldsValue } } = this.props;
		getFieldDecorator(field, { initialValue: [this.baseStr] });
		const itemArray = getFieldValue(field);
		// 相关操作
		const toHandle = (type, field, val) => {
			const values = getFieldValue(field);
			let nextValues = values;
			if (type === 'add') { nextValues = values.concat(ranStr()); }
			if (type === 'sub') {	nextValues = values.filter(i => i !== val);	}
			setFieldsValue({ [field]: nextValues });
		};
		return itemArray.map((item, index) => (
			<div key={index} className="detail-item_input">
				{ getFieldDecorator(`${field}_${item}`)(<Input placeholder={placeholder} style={{ width: 260 }} autoComplete="off" />)}
				{ itemArray.length === index + 1
				&& <Icon className="detail-item_input__icon" type="plus-circle" theme="filled" onClick={() => toHandle('add', field, item)} /> }
				{ itemArray.length > 1
				&& <Icon className="detail-item_input__icon" type="minus-circle" onClick={() => toHandle('sub', field, item)} /> }
			</div>
		));
	};

	render() {
		const { history,match:{ params } } = this.props;
		const { loading,source } = this.state;
		const statusText = { 0:'未标记',	1:'已标记', 2:'自动退回'};
		return (
			<div className="yc-bankrupt-detail-wrapper">
				<div className="detail-content-wrapper">
					<BreadCrumb texts={['破产重组结构化','详情']} suffix={
						<div className="detail-content-crumb_suffix">
							<Button type="primary" ghost style={{width:90}} onClick={()=>history.go(-1)}>返回</Button>
						</div>
					} />
					<Spin spinning={loading} >
						<div className="detail-content">
							{
								params.status === 2 && <Item title='自动退回'>
									<span style={{ color:"#FB0037" }}>企业名称疑似有误，建议核实</span>
								</Item>
							}

							<Item title='基本信息'>
								<ItemList title='标题：'>{source.title}</ItemList>
								<ItemList title='发布时间：'>{source.publishTime||'--'}</ItemList>
								<ItemList title='当前状态：'>{statusText[source.status]||'--'}</ItemList>
								<ItemList title='结构化记录：'>
									<ul className="detail-content-item_ul">
										<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
										<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
										<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
									</ul>
								</ItemList>
							</Item>
							<Item title='破产公告原文'>
								<ItemList noTitle>
									<pre dangerouslySetInnerHTML={{ __html: source.content }} />
								</ItemList>
							</Item>
							{/*<Item title='角色信息'>*/}
							{/*	<div style={{display:'flex'}}>*/}
							{/*		<ItemList title='破产管理人：' style={{maxWidth:500,paddingRight:120}}>*/}
							{/*			<ul className="detail-content-item_ul">*/}
							{/*				<ItemTag text='温州市晨乐鞋业有限公司温州市晨乐鞋业有限公司温州市晨乐鞋业有限公司' tag />*/}
							{/*				<ItemTag text='炳洪的申请于2019年7月29日裁定受' tag />*/}
							{/*				<ItemTag text='依法应予以终结破产程序。依照《中华人民共和国企' />*/}
							{/*			</ul>*/}
							{/*		</ItemList>*/}
							{/*		<ItemList title='申请人：'>--</ItemList>*/}
							{/*	</div>*/}
							{/*	<ItemList title='破产管理人：'>--</ItemList>*/}
							{/*</Item>*/}
							<Item title='角色信息-可编辑' style={{lineHeight:'32px'}}>
								<div style={{display:'flex'}}>
									<ItemList title='破产企业：' style={{maxWidth:500,paddingRight:40}} required>
										{this.getItems('company','请输入破产企业名称')}
									</ItemList>
									<ItemList title='申请人：'>
										{this.getItems('apply','请输入破产申请人名称')}
									</ItemList>
								</div>
								<ItemList title='破产管理人：'>
									{this.getItems('custodian','请输入破产管理人名称')}
								</ItemList>
								<ItemList title=' '>
									<Button>信息无误</Button>
									<Button type="primary">保存并标记下一条</Button>
									<Button type="primary">保存</Button>
								</ItemList>
							</Item>
						</div>
					</Spin>
				</div>
			</div>
		)
	}
}
export default Form.create({ name: 'bankrupt_detail' })(withRouter(rule(BankruptDetail)))
