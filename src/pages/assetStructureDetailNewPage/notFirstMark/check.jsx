import React from 'react';
import { withRouter } from 'react-router-dom';
import { message } from 'antd';
import BasicDetail from '@/components/assetStructureDetail/basicDetail';
import ButtonGroup from '@/components/assetStructureDetail/buttonGroup';
import PropertyDetail from '@/components/assetStructureDetail/propertyDetail';
import DocumentDetail from '@/components/assetStructureDetail/documentDetail';
import WrongDetail from '@/components/assetStructureDetail/wrongDetail';
import RoleDetail from '@/components/assetStructureDetail/roleDetail';
import { BreadCrumb } from '@commonComponents';
import CheckModal from '@/components/assetStructureDetail/checkErrorModal';
import {
	changeWrongType, // 在结构化人员未修改前 再次修改错误
	getCheckDetail, getWrongTypeAndLevel, // 获取检查人员结构化详情信息
	inspectorCheck, saveInspectorStructureDetail, // 检查提交
} from '@api';
import {filters} from "@utils/common";

const getObligors = ()=> ({
	birthday: '',
	gender: '0',
	labelType: '1',
	name: '',
	notes: '',
	number: '',
	type: '1',
});

function CheckWrongLog() {
	this.auctionExtractWrongTypes = [];
	this.remark = '';
	this.wrongLevel = 0;
}

class Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: false,
			records: [],
			title: '',
			reasonForWithdrawal: '',
			auctionStatus: null,
			url: '',
			collateral: null,
			buildingArea: null,
			houseType: null,
			wsFindStatus: null,
			wsUrl: [],
			ah: [],
			wsInAttach: null,
			obligors: [],
			wrongData: [],
			returnRemarks: '',
			status: 0, // 测试状态  0 未检查 1 检查无误 2 检查错误 3 已修改
		};
		this.enable = true;
	}

	get updateOrSubmitCheck() {
		const { length } = this.state.records;
		const desc = length !== 0 && this.state.records[length - 1].desc;
		return (['结构化', '自动标注'].indexOf(desc) >= 0 || length === 0) ? 'submit' : 'update';
	}

	componentDidMount() {
		this.toGetCheckDetail();
	}

	handleModalCancel = () => {
		this.setState({ visible: false });
	};

	handleErrorModal = () => {
		this.setState({ visible: true });
	};

	/* 请求基本数据 */
	toGetCheckDetail() {
		const { associatedAnnotationId } = this.props.match.params;
		getCheckDetail(associatedAnnotationId).then((res) => {
			if (res.data.code === 200) {
				const { data } = res.data;
				this.enable= !(data.structPersonnelEnable === 0 || data.structPersonnelEnable === 2);
				this.setState({
					...data,
					status: data.detailStatus,
					ah: data && data.ah && data.ah instanceof Array && data.ah.length === 0 ? [{ value: '' }] : data.ah,
					wsUrl: data && data.wsUrl && data.ah instanceof Array && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
				});
			} else {
				message.error(res.data.message);
			}
		});
		getWrongTypeAndLevel(associatedAnnotationId).then((res) => {
			this.setState({
				wrongData: (res.data.data !== null) ? res.data.data : [],
			});
		});
	}


	handleNoErr = () =>this.submitWrongRecord({}, false);

	handleModalSubmit = (data) => this.submitWrongRecord(data, true);

	handleClosePage = () =>{
		if (window.opener) {
			window.opener = null;
			window.open('', '_self');
			window.close();
		} else {
			// 如果不是新开页打开的 无法关闭
			message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面');
			setTimeout(() => {
				window.location.href = 'about:blank';
			}, 1500);
		}
	};

	submitWrongRecord = (data, checkError = true)=> {
		const { status } = this.state;
		const { associatedAnnotationId } = this.props.match.params;
		if (this.updateOrSubmitCheck === 'submit') {
			const params = {
				checkWrongLog: Object.assign({}, data),
				checkError,
				id: associatedAnnotationId,
			};
			inspectorCheck(params, status).then((res) => {
				if (res.data.code === 200) {
					message.success('操作成功,2秒后为您关闭页面');
					setTimeout(this.handleClosePage, 2000);
				} else {
					message.error('操作失败');
				}
			});
		} else {
			const params = (checkError) ? { ...data } : new CheckWrongLog();
			changeWrongType(associatedAnnotationId, params).then((res) => {
				if (res.data.code === 200) {
					message.success('操作成功,2秒后为您关闭页面');
					setTimeout(this.handleClosePage, 2000);
				} else {
					message.error('操作失败');
				}
			});
		}
	};

	handleChange=(key, value) => {
		this.setState({
			[key]: value,
			isUpdateRecord: true,
		});
	};

	handleStructureUpdate=() => {
		if (!this.enable && !this.state.isUpdateRecord) {
			// 如果是已删除账号的检查结构化详情 并且未做修改 不能保存
			message.warning('当前页面未作修改，请修改后再保存');
			return false;
		}
		/* 资产标注详情页存在名称里不含“银行”、“信用社”、“信用联社”且备注为空的债权人时，点击保存，
				保存无效并弹出“债权人备注待完善”非模态框提示； */
		const { obligors } = this.state;
		for (let i = 0; i < obligors.length; i++) {
			const { name } = obligors[i];
			if (obligors[i].notes === '' && obligors[i].labelType === '2'
				&& name.indexOf('银行') < 0 && name.indexOf('信用社') < 0 && name.indexOf('信用联社') < 0) {
				message.warning('债权人备注待完善');
				return false;
			}
			if (obligors[i].notes === '' && obligors[i].labelType === '3') {
				message.warning('资产线索备注待完善');
				return false;
			}
		}
		/* 资产标注详情页存在备注为空的资产线索时，点击保存，保存无效并弹出“资产线索备注待完善”非模态框提示 */
		const id = this.state.id;
		// 去空行
		const keys = ['name', 'birthday', 'notes', 'number'];
		const { state } = this;
		state.obligors = filters.blockEmptyRow(obligors, keys);
		// 如果是未找到文书 去掉文书链接 相关文书案号 见附件详情
		if (state.wsFindStatus === 0) {
			state.wsUrl = [];
			state.wsInAttach = 0;
			state.ah = [];
		} else {
			state.ah = filters.blockEmptyRow(this.state.ah, ['value']);
			state.wsUrl = filters.blockEmptyRow(this.state.wsUrl, ['value']);
		}
		const params = {
			ah: state.ah,
			buildingArea: state.buildingArea,
			collateral: state.collateral,
			houseType: state.houseType,
			obligors: state.obligors,
			onlyThis: state.onlyThis,
			wsFindStatus: state.wsFindStatus,
			wsInAttach: state.wsInAttach,
			wsUrl: state.wsUrl,
		};
		if (this.isUnconfirmed) params.flag = 1;
		saveInspectorStructureDetail(id, params).then((res) => {
			if (res.data.code === 200) {
				message.success('保存成功!');
				this.props.history.push({
					pathname: '/index',
				});
			} else {
				message.error('保存失败!');
			}
		});
	};

	handleDocumentChange(combine, value) {
		const arr_index = combine.substr(combine.length - 1, 1);
		const key = combine.substr(0, combine.length - 1);
		const arr = [...this.state[key]];
		arr[arr_index].value = value;
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		});
	}
	/* 角色信息 - 相关操作 */
	handleRoleChange(combine, value) {
		const arr_index = combine.substr(combine.length - 1, 1);
		const key = combine.substr(0, combine.length - 1);
		const arr = [...this.state.obligors];
		arr[arr_index][key] = value;
		this.setState({
			obligors: arr,
			isUpdateRecord: true,
		});
	}

	handleAddClick(key) {
		const arr = (key !== 'obligors') ? [...this.state[key], { value: '' }] : [...this.state[key], { ...getObligors() }];
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		}, () => {
			// console.log(this.state)
		});
	}

	handleDeleteClick(key, index = -1) {
		// 角色对应顺序删除  文书从下往上删
		const arr = (index >= 0) ? this.state[key].slice(0) : this.state[key].slice(0, -1);
		if (index >= 0) {
			arr.splice(index, 1);
		}
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		}, () => {
			// console.log(this.state)
		});
	}

	render() {
		const { state } = this;
		const moduleOrder = [
			<BasicDetail
				key={0}
				auctionID={state.id}
				type={state.status}
				associatedAnnotationId={state.associatedAnnotationId}
				records={state.records}
				title={state.title}
				url={state.url}
				auctionStatus={state.auctionStatus}
				reasonForWithdrawal={state.reasonForWithdrawal}
			/>,
		];
		if (parseInt(state.status) >= 3) {
			moduleOrder.unshift(<WrongDetail wrongData={state.wrongData.slice(0, 1)} key={1} />);
		}
		return (
			<div className="yc-content-container-newPage assetStructureDetail-structure">
				<BreadCrumb texts={['资产结构化检查 /详情']} />
				<div className="assetStructureDetail-structure_container">
					<div className="assetStructureDetail-structure_container_header">
						{moduleOrder[0]}
						<ButtonGroup
							role="notFirstMark-check"
							status={ButtonGroup.getStatus(state.status,state.structPersonnelEnable)}
							enable={this.enable}
							type={state.type}
							handleClosePage={this.handleClosePage}
							handleErrorModal={this.handleErrorModal}
							handleNoErr={this.handleNoErr}
							handleStructureUpdate={this.handleStructureUpdate}
							handleChange={this.handleChange}
						/>
					</div>
					<div className="assetStructureDetail-structure_container_body">
						{ moduleOrder.length > 0 ? moduleOrder.slice(1) : null }
						<PropertyDetail
							enable={this.enable}
							collateral={state.collateral}
							buildingArea={state.buildingArea}
							houseType={state.houseType}
							handleChange={this.handleChange}
						/>
						<DocumentDetail
							enable={this.enable}
							wsFindStatus={state.wsFindStatus}
							wsUrl={state.wsUrl}
							ah={state.ah}
							wsInAttach={state.wsInAttach}
							handleDocumentChange={this.handleDocumentChange.bind(this)}
							handleChange={this.handleChange}
							handleAddClick={this.handleAddClick.bind(this)}
							handleDeleteClick={this.handleDeleteClick.bind(this)}
						/>
						<RoleDetail
							enable={this.enable}
							obligors={state.obligors}
							handleChange={this.handleRoleChange.bind(this)}
							handleAddClick={this.handleAddClick.bind(this)}
							handleDeleteClick={this.handleDeleteClick.bind(this)}
						/>
					</div>
				</div>
				<CheckModal
					visible={state.visible}
					status={state.status}
					wrongReasons={state.wrongData.slice(0, 1)}
					handleModalSubmit={this.handleModalSubmit}
					handleModalCancel={this.handleModalCancel}
					style={{ width: 430 }}
				/>
			</div>
		);
	}
}
export default withRouter(Check);
