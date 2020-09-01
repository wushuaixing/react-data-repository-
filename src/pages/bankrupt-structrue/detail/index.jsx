import React from 'react';
import { withRouter } from 'react-router';
import { BreadCrumb } from "@/components/common";
import { Button, Form, Input, Icon, Spin, message, Modal } from "antd";
import { Item, ItemList, ItemTag } from './common';
import { ranStr } from "@utils/common";
import { scrollTop } from "@utils/tools";
import { rule } from "@/components/rule-container";
import Api from '@/server/bankruptcy';
import './style.scss';

class BankruptDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			source: {},
		};
		this.changed = false;
		this.errorName = [];
		this.baseStr = ranStr();
	}

	componentDidMount() {
		this.toGetDetailInfo();
	}

	componentWillReceiveProps(nextProps, nextContext) {
		const { match:{ params:{ id } } } = this.props;
		const { match:{ params:{ id:nextId } } } = nextProps;
		if(id !== nextId) this.toGetDetailInfo(nextId);
	}
	/* 初始化参数 */
	toResetInfo = () => {
		this.changed = false;
		this.errorName = [];
		this.baseStr = ranStr();
	};
	/* 获取数据基本信息 */
	toGetDetailInfo = (id) => {
		const { match:{ params },form } = this.props;
		this.setState({ loading: true });
		form.resetFields();
		Api.getDetail(id || params.id)
			.then(({ code, data, message: mes }) => {
				if (code === 200) {
					this.toResetInfo();
					this.setUserInfo(data);
					this.setState({ source: data });
					scrollTop();
				} else {
					message.error(mes);
				}
			})
			.finally(() => this.setState({ loading: false }));
	};
	/* 动态创建相关输入框 */
	getItems = (field, placeholder = '请输入') => {
		if (!field) return;
		const {
			getFieldValue, getFieldDecorator, setFieldsValue, getFieldError, setFields
		} = this.props.form;
		getFieldDecorator(field, { initialValue: [this.baseStr] });
		// console.log(getFieldsValue());
		// 相关操作
		const toHandle = (type, field, val) => {
			if(!this.changed) this.changed = true;
			const values = getFieldValue(field);
			let nextValues = values;
			if (type === 'add') { nextValues = values.concat(ranStr()); }
			if (type === 'sub') {	nextValues = values.filter(i => i !== val);	}
			setFieldsValue({ [field]: nextValues });
		};
		// 获取 field 错误状态
		const getError = field =>getFieldError(field)?getFieldError(field).join(','):null;
		// input 变化校验
		const toInputChange = (event, _field, err) => {
			const { value:_value } = event.target;
			const value = (_value||"").replace(/\s/g,'');
			if(!this.changed) this.changed = true;
			if (/company/.test(_field)) {
				if (err) { setFields({ [_field]: { value, errors: [] } }); }
				else {
					// if (this.errorName.includes(value))setFields({ [_field]: { value, errors: [new Error('企业名称疑似有误')] } });
				}
			}
		};
		const onBlur= (e,_field) =>{
			const { setFieldsValue } = this.props.form;
			const { value:_value }  =e.target;
			const value = (_value||'').replace(/\s/g,'');
			setFieldsValue({[_field]:value})
		};

		const itemArray = getFieldValue(field);
		return itemArray.map((item, index) => {
			const _field = `${field}_${item}`;
			const err = getError(_field);
			return (
				<div key={index} className={`detail-item_input${err ? ' detail-item_error' : ''}`}>
					{ getFieldDecorator(_field, { onChange: e => toInputChange(e, _field, err) })
						(<Input placeholder={placeholder} style={{ width: 260 }} autoComplete="off" onBlur={e=>onBlur(e,_field)} />)}
					{ err && <span className="detail-item_input__error">{err}</span> }
					{ itemArray.length === index + 1
					&& <Icon className="detail-item_input__icon" type="plus-circle" theme="filled" onClick={() => toHandle('add', field, item)} /> }
					{ itemArray.length > 1
					&& <Icon className="detail-item_input__icon" type="minus-circle" onClick={() => toHandle('sub', field, item)} /> }
				</div>
			);
		});
	};

	// 设置 => 表达数据初始化
	setUserInfo = (source) => {
		const { form: { setFieldsValue: set, setFields } } = this.props;
		const { companyName: company, applicant: apply, publisher: custodian } = source;
		const data = { field: {}, value: {} };
		const errorStr = [];
		const addValue = (array, field, checkField = 'value') =>	(array || []).forEach((i) => {
			if (i[checkField]) {
				const _ranStr = ranStr();
				data.field[field] = [...(data.field[field] || []), _ranStr];
				data.value[`${field}_${_ranStr}`] = i[checkField];
				if (i.bol && field === 'company') {
					this.errorName.push(i[checkField]);
					errorStr.push({
						field: `company_${_ranStr}`,
						value: i[checkField],
						errors: [new Error('企业名称疑似有误')],
					});
				}
			}
		});
		addValue(company, 'company', 'bankruptcyCompanyName');
		addValue(apply, 'apply');
		addValue(custodian, 'custodian');
		// 设置数据
		set(data.field, () => {
			set(data.value);
			errorStr.forEach(i => setFields({ [i.field]: { value: i.value, errors: i.errors } }));
		});
	};
	// 获取 => 表单数据
	getUserInfo = () => {
		const { form: { getFieldValue: get } } = this.props;
		const getValue = field => (get(field) || []).map(i => ({ value: get(`${field}_${i}`) })).filter(i => i.value);
		return {
			companyName: getValue('company'),
			applicant: getValue('apply'),
			publisher: getValue('custodian'),
		};
	};

	// 检查当前输入数据是否变化 [ true：未变化 , false：已变化 ]
	get ChangeStatus(){
		if(!this.changed) return true;
		const { source:{ companyName, applicant, publisher} } = this.state;
		const source = this.getUserInfo();
		// 比较数组，不同返回true，想同返回false
		const compareArray= (arr1=[],arr2=[])=>{
			if(arr1.length !== arr2.length) return true;
			const _arr1 = arr1.map(i=>encodeURI(i||'')).sort();
			const _arr2 = arr2.map(i=>encodeURI(i||'')).sort();
			return _arr1.join(',')!==_arr2.join(',')
		};
		const getAry = (ary,field)=>ary.map(i=>(i||{})[field||'value']);
		const compareRes = compareArray(getAry(companyName,'bankruptcyCompanyName'),getAry(source.companyName)) || compareArray(getAry(applicant),getAry(source.applicant)) || compareArray(getAry(publisher),getAry(source.publisher));
		return !compareRes;
	}

	// 检查当前记录是否变更
  toCheck = async (id) => {
		const { source } = this.state;
		const res = await Api.getStatus(id);
		let result = '';
		if (res.code === 200) result = source.status === res.data ? 'normal' : 'error';
		else result = 'warning';
		return result
	};

	// 保存结构化对象
	toSave = async () => {
		console.info('保存结构化对象');
		const { history, match: { params } } = this.props;
		const source = this.getUserInfo();
		if (this.ChangeStatus) return message.error('当前页面未作修改，请修改后再保存');
		if (!source.companyName.length) return message.warning('请输入破产企业名称！');
		this.setState({ loading: true });
		// 校验当前数据状态
		const idStatus = await this.toCheck(params.id);
		if (idStatus !== 'normal') {
			// history.push(`/index/bankrupt?approveStatus=1`)
			if (idStatus === 'error') return message.error('该数据已被检查错误，请到待修改列表查看',2,()=>history.go(-1));
			else message.error('服务繁忙，请稍后再试');
		}else {
			// 保存当前数据
			Api.saveDetail(params.id, source)
				.then((res) => {
					if (res.code === 200) {
						message.success('保存成功', 1, () => history.go(-1));
					}	else message.error(res.message);
				})
				.catch(()=>message.error('服务繁忙，请稍后再试'))
				.finally(() => setTimeout(() => this.setState({loading: false}), 1000));
		}
	};

	// 保存结构化对象并获取下一条id
	toSaveNext = async type => {
		console.info('保存结构化对象并获取下一条id');
		if(this.ChangeStatus && type === 'modify') return message.error('当前页面未作修改，请修改后再保存');
		// console.log(this.ChangeStatus && type === 'modify');
		const source = this.getUserInfo();
		if (!source.companyName.length) return message.warning('请输入破产企业名称！');
		const { history, match: { params } } = this.props;
		this.setState({ loading: true });
		const idStatus = await this.toCheck(params.id);
		if (idStatus !== 'normal') {
			if (idStatus === 'error') {
				const text = type === 'modify'?'该数据已被处理':'该数据已被标注';
				const _type = type === 'modify'? 2 :  0;
				Api.getNext(_type)
					.then(res => {
						if(res.code === 200){
							if(res.data){
								message.error(`${text}，为您跳转至下一条`,2,()=>{
									history.replace(`/index/bankrupt/detail/${res.data}`)
								})
							}else	message.error(`${text}，为您跳转至未标记列表`,2,()=>{
								history.push(`/index/bankrupt?approveStatus=0`)
							})
						} else message.error(res.message);
					})
					.catch(()=>message.error('服务繁忙，请稍后再试'))
					.finally(() => setTimeout(() => this.setState({loading: false}), 2000));
			}	else message.error('服务繁忙，请稍后再试');
		} else {
			Api.saveDetailNext(params.id, source)
				.then((res) => {
					if (res.code === 200) {
						if (res.data){
							history.replace(`/index/bankrupt/detail/${res.data}`);
							message.success('保存成功',1)
						} else this.toWillBackModal(type === 'modify' && '已修改完全部数据，');
					} else message.error(res.message);
				})
				.catch(()=>message.error('服务繁忙，请稍后再试'))
				.finally(this.setState({ loading: false }));
		}
	};

	// 信息无误按钮接口 【无误后获取下一条数据】
	toAffirm = async () =>{
		console.info('信息无误按钮接口');
		// if(!this.changed) return message.error('当前页面未作修改，请修改后再保存');
		const { history, match: { params } } = this.props;
		this.setState({ loading: true });
		const idStatus = await this.toCheck(params.id);
		if (idStatus !== 'normal') {
			if (idStatus === 'error') {
				Api.getNext(2)
					.then(res => {
						if(res.code === 200){
							if(res.data){
								message.error('该数据已被处理，为您跳转至下一条',2,()=>{
									history.replace(`/index/bankrupt/detail/${res.data}`)
								})
							}else	message.error('该数据已被处理，为您跳转至未标记列表',2,()=>{
									history.push(`/index/bankrupt?approveStatus=0`)
								})
						} else message.error(res.message);
					})
					.catch(()=>message.error('服务繁忙，请稍后再试'))
					.finally(() => setTimeout(() => this.setState({loading: false}), 2000));
			}	else message.error('服务繁忙，请稍后再试');
		} else {
			Api.updateStatus(params.id)
				.then((res) => {
					if (res.code === 200) {
						if (res.data) {
							history.replace(`/index/bankrupt/detail/${res.data}`);
							message.success('操作成功',1)
						}	else this.toWillBackModal('已修改完全部数据，');
					} else message.error(res.message);
				})
				.catch(()=>message.error('服务繁忙，请稍后再试'))
				.finally(this.setState({ loading: false }));
		}
	};

	toWillBackModal = (text)=>{
		const { history } = this.props;
		let secondsToGo = 2;
		const onOk = ()=>{
			if(timer)	clearInterval(timer);
			history.push(`/index/bankrupt?approveStatus=0`);
		};
		const modal = Modal.success({
			centered: true,
			className: 'yc-bankrupt-modal',
			title: [text||'已标记完全部数据，',<span style={{color:'#016AA9'}} key='time'>{secondsToGo}s</span>,' 后回到未标记列表'],
			icon: <Icon type="check-circle" theme="filled" />,
			okText: ' 我知道了 ',
			onOk,
		});
		const timer = setInterval(() => {
			secondsToGo -= 1;
			modal.update({
				title: [text||'已标记完全部数据，',<span style={{color:'#016AA9'}} key='time'>{secondsToGo}s</span>,' 后回到未标记列表'],
			});
		}, 1000);
		setTimeout(() => {
			clearInterval(timer);
			modal.destroy();
			onOk();
		}, secondsToGo * 1000);
	};

	render() {
		const { history, ruleSource:{ rule } } = this.props;
		const { loading,source } = this.state;
		const statusText = { 0:'未标记',	1:'已标记', 2:'自动退回'};
		const { autoReturn, autoReturnMsg } =source||{};
		return (
			<div className="yc-bankrupt-detail-wrapper">
				<div className="detail-content-wrapper">
					<BreadCrumb texts={['破产重组结构化','详情']} suffix={rule === 'admin' && (
						<div className="detail-content-crumb_suffix">
							<Button type="primary" ghost style={{width:90}} onClick={()=>history.go(-1)}>返回</Button>
						</div>
					)} />
					<Spin spinning={loading} >
						<div className="detail-content">
							<Item title='自动退回' hide={!(source.status === 2)}>
								<ul className="detail-content-item_ul">
									{
										((autoReturn||{}).time && rule === 'admin') ? ( <li>
											<span className="li-span li-span_time">{autoReturn.time}</span>
											{ autoReturn.msg && <span className="li-span">{autoReturn.msg}</span>}
											{ autoReturn.bol && <span className="li-span" style={{ color:"#FB0037" }}>有误</span>}
										</li>	): null
									}
									<li style={{ color:"#FB0037" }}>{autoReturnMsg}</li>
								</ul>
							</Item>
							<Item title='基本信息'>
								<ItemList title='标题：'>
									{source.url? <a href={source.url} target='_blank' rel="noopener noreferrer" className="a-link">{source.title||'--'}</a>: (source.title||'--')}
								</ItemList>
								<ItemList title='发布时间：'>{source.publishTime||'--'}</ItemList>
								<ItemList title='当前状态：'>{statusText[source.status]||'--'}</ItemList>
								<ItemList title='结构化记录：' hide={ source.status === 0 }>
									<ul className="detail-content-item_ul">
										{
											(source.records||[]).length ? source.records.map(i=>(
												<li key={i.time}>
													<span className="li-span li-span_time">{i.time}</span>
													{ i.user && <span className="li-span">{i.user}</span>}
													{ i.msg && i.flag !== 1 && <span className="li-span">
														{i.flag === 2 && '初次' }
														{i.flag === 3 && '修改' }
														{i.flag !== 3 ? i.msg : ''}
													</span>}
													{ i.flag === 0 && <span className="li-span" style={{ color:"#FB0037" }}>有误</span>}
													{ i.flag === 1 && <span className="li-span" style={{ color:"#1DB805" }}>信息无误</span>}
												</li>
											)): <li key='nothing'>--</li>
										}
									</ul>
								</ItemList>
							</Item>
							<Item title='破产公告原文'>
								<ItemList noTitle>
									<pre dangerouslySetInnerHTML={{ __html: (source.content||'').replace(/^\s{2,}|\s{2,}$/gm,"\n") }} style={{whiteSpace: "pre-wrap"}}/>
								</ItemList>
							</Item>
							<Item title='角色信息' hide={rule !== 'admin'}>
								<div style={{ display: 'flex' }}>
									<ItemList title="破产企业：" style={{ maxWidth: 500, paddingRight: 120 }}>
										<ul className="detail-content-item_ul">
											{ (source.companyName || []).map(({ bankruptcyCompanyName: name, bol }) => <ItemTag key={name} text={name} tag={bol} />) }
											{ !(source.companyName || []).length && '-' }
										</ul>
									</ItemList>
									<ItemList title="申请人：">
										<ul className="detail-content-item_ul">
											{ (source.applicant || []).map(({ value: name, bol }) => <ItemTag key={name} text={name} />) }
											{ !(source.applicant || []).length && '-' }
										</ul>
									</ItemList>
								</div>
								<ItemList title="破产管理人：">
									<ul className="detail-content-item_ul">
										{ (source.publisher || []).map(({ value: name, bol }) => <ItemTag key={name} text={name} />) }
										{ !(source.publisher || []).length && '-' }
									</ul>
								</ItemList>
							</Item>
							<Item title='角色信息' style={{ lineHeight: '32px' }} hide={rule !== 'normal'} >
								<div style={{display:'flex',paddingBottom:10}}>
									<ItemList title='破产企业：' style={{ maxWidth: 500, paddingRight: 40 }} required>
										{this.getItems('company','请输入破产企业名称')}
									</ItemList>
									<ItemList title='申请人：'>
										{this.getItems('apply','请输入破产申请人名称')}
									</ItemList>
								</div>
								<ItemList title='破产管理人：' style={{paddingBottom:26}}>
									{this.getItems('custodian','请输入破产管理人名称')}
								</ItemList>
								<ItemList title=' '>
									{ source.status === 0 && <Button type="primary" onClick={()=>this.toSaveNext('sign')}>保存并标记下一条</Button> }
									{ source.status === 1 && <Button type="primary" onClick={this.toSave}>保存</Button> }
									{ source.status === 2 && [
										<Button key='noError' onClick={this.toAffirm}>信息无误</Button>,
										<Button key='nextTag' type="primary" onClick={()=>this.toSaveNext('modify')}>保存并修改下一条</Button>
									]}
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
