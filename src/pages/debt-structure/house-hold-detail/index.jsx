import React, {Component, Fragment} from "react";
import {withRouter} from "react-router-dom";
import DebtApi from "@/server/debt";
import {Button, message,Spin} from "antd";
import {rule} from "@/components/rule-container";
import DebtRights from "../detail/asset-package";
import PledgersAndDebtorsInfo from "./pledgers";
import GuarantorsInfo from "./guarantors";
import CollateralMsgsInfo from "./collatera-msgs";
import {ANCHOR_TYPE} from "../common/type";
import {filters, clone} from "@utils/common";
import "./style.scss";

/**
 * 债权-添加编辑 户/未知对应关系
 */
class HouseHoldDetail extends Component {
	constructor() {
		super();
		this.state = {
			id: 1002,
			dynamicOwners: [],
			unitNumber: 0,
			creditorsRightsPrincipal: 0,
			outstandingInterest: 0,
			totalAmountCreditorsRights: 0,
			summation: 1,
			debtors: [],
			pledgers: [],
			collateralMsgs: [],
			guarantors: [],
			detailInfo: {
				pledgers: [],
				debtors: [],
				guarantors: [{msgVOS: []}],
			},
			collateralMsgsData: [],
			activeFlag: 0,
			isNormalLeave: false,
			debtorsNameGroup: "",
			loading:false,
		};
	}

	componentDidMount() {
		this.getDetailInfo(this.props);
		this.beforeunload();
	}

	get documentTitle() {
		const isHouseHoldDetail = window.location.href.includes("houseHoldDetail");
		const {
			match: {
				params: {id},
			},
		} = this.props;
		const {debtorsNameGroup} = this.state;
		if (isHouseHoldDetail) {
			if (id !== "0") {
				return debtorsNameGroup;
			} else {
				return "添加户";
			}
		} else {
			return "未知对应关系";
		}
	}

	/**
	 * 获取保证人索引值
	 * @param arr 保证人所有数据
	 * @param index 第几组
	 * @param indexs 组中第几个保证人
	 * return 第n组中第n个保证人 在整批保证人中的索引
	 */
	getLength = (arr, index, indexs) => {
		const data = arr.slice(0, index);
		let i = 0;
		data.forEach((item) => {
			item.msgs.forEach(() => i++);
		});
		return i + indexs + 1;
	};

	//获取所有人下拉框数据
	getOwners = (flag) => {
		const {detailInfo,dynamicOwners} = this.state;
		const compare = (arr1,arr2)=> {
				const oldArr = arr1.map(i=>i.name);
				const NewArr = arr2.map(i=>i.name);
				if(oldArr.length !== NewArr.length){
					return true;
				};
				if(!oldArr.every((v,i)=>(v === NewArr[i]))){
					return true;
				}
				return  false;
		};
		let arr = [];
		const {debtors, guarantors, pledgers} = detailInfo;
		debtors.forEach((item, index) => {
			let obj = {
				name: item.name,
				id: item.id >= 1 ? item.id : 0,
				typeName: item.typeName ? item.typeName : `债务人${index + 1}`,
			};
			arr.push(obj);
		});
		pledgers.forEach((item, index) => {
			let obj = {
				name: item.name,
				typeName: item.typeName ? item.typeName : `抵质押人${index + 1}`,
				id: item.id >= 1 ? item.id : 0,
			};
			arr.push(obj);
		});
		guarantors[0].msgVOS.forEach((item, index) => {
			item.msgs.forEach((item, indexs) => {
				let dymicIndex = this.getLength(guarantors[0].msgVOS, index, indexs);
				let obj = {
					name: item.name,
					typeName: `保证人${dymicIndex}`,
					id: item.id >= 1 ? item.id : 0,
				};
				arr.push(obj);
			});
		});
		compare(dynamicOwners,arr) && this.setState(
			{
				dynamicOwners: arr, //所有人
			},
			() => {
				flag === "isChange" && this.collateralMsgsRef.handleChange(); //保证人信息  抵质押人信息 债务人信息 变更 让抵押物所有人置空(页面首次加载时不触发)
			}
		);
	};

	//点击浏览器窗口关闭 提示(系統可能不會儲存您所做的變更) 点击保存并关闭||查看界面时 不做提醒
	beforeunload = () => {
		const {
			match: {
				params: {isEdit},
			},
		} = this.props;
		window.onbeforeunload = (e) => {
			e = e || window.event;
			if (!parseInt(isEdit) || this.state.isNormalLeave) {
				return;
			}
			// 兼容IE8和Firefox 4之前的版本
			if (e) {
				e.returnValue = "关闭提示";
			}
			// Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
			return "关闭提示";
		};
	};

	//债权户(未知)信息详情 添加户和未知关系时不请求
	getDetailInfo = (props) => {
		const {
			match: {
				params: {id, debtorsId, debtId},
			},
		} = props;
		const params = {
			flag: id === "null" ? 0 : 1,
			id: id === "null" ? parseInt(debtId) : parseInt(id),
			usrId: id === "null" ? parseInt(debtorsId) : "",
		};
		id !== "0" && this.setState({loading: true});
		id !== "0" &&
		DebtApi.getCreditorsUnitDetail(params).then((result) => {
			const res = result.data;
			if (res.code === 200) {
				const data = res.data;
				this.setState(
					{
						id: data.id,
						collateralMsgs: data.collateralMsgs, //抵押物信息
						debtors: data.debtors, //债务人信息
						guarantors: data.guarantors, //保证人信息
						pledgers: data.pledgers, //抵质押人信息
						creditorsRightsPrincipal: data.creditorsRightsPrincipal, //债权本金
						outstandingInterest: data.outstandingInterest, //利息
						totalAmountCreditorsRights: data.totalAmountCreditorsRights, //本息合计
						collateralMsgsData: data.collateralMsgs, //抵押物信息
						summation: !data.tag * 1, //勾选本息自动求和
					},
					() => {
						const {debtors, guarantors, pledgers, detailInfo} = this.state;
						const arr = detailInfo;
						const debtorsNameGroup = debtors.map((i) => i.name).join("、");
						arr.debtors = debtors;
						arr.guarantors[0].msgVOS =
							guarantors && guarantors.length ? guarantors[0].msgVOS : [];
						arr.pledgers = pledgers;
						this.setState(
							{
								debtorsNameGroup,
								detailInfo: arr,
							},
							() => this.getOwners()
						);
					}
				);
			}
		}).catch(() => message.error("服务繁忙，请稍后再试"))
			.finally(() => this.setState({loading: false}));
		;
	};

	//保存并关闭
	handleSubmit = () => {
		const {
			detailInfo,
			creditorsRightsPrincipal,
			outstandingInterest,
			totalAmountCreditorsRights,
			collateralMsgsData,
			summation
		} = this.state;
		const {
			match: {
				params: {packageId, id, type},
			},
		} = this.props;
		const params = {
			type: parseInt(type), //类型(0户 1未知户)
			packageID: parseInt(packageId), //包id
			id: parseInt(id), //户id
			creditorsRightsPrincipal, //债权本金
			outstandingInterest, //利息
			totalAmountCreditorsRights, //本息合计
			collateralMsgs: collateralMsgsData, //抵押物信息
			tag: !summation * 1,
			...detailInfo, //保证人信息  抵质押人信息 债务人信息
		};
		const isHouseHoldDetail = window.location.href.includes("houseHoldDetail");
		if (detailInfo.debtors.length <= 0 && isHouseHoldDetail) {
			message.warning("债务人信息遗漏");
			return;
		}
		this.setState({loading: true})
		DebtApi.unitSaveDetail(params).then((res) => {
			if (res.data.code === 200 && res.data.data) {
				this.setState(
					{
						isNormalLeave: true,
					},
					() => {
						localStorage.setItem("debtAction", 'SUCCESS');
						message.success("保存成功", 2, this.handleClosePage);
					}
				);
			} else {
				message.warning(res.data.message,()=>this.setState({loading: false}));
			}
		})
	};

	//关闭页面
	handleClosePage = () => {
		if (window.opener) {
			window.opener = null;
			window.open("", "_self");
			window.close();
		} else {
			message.warning(
				"由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面",
				2,
				() => (window.location.href = "about:blank")
			);
		}
	};
	//债权信息 抵押物信息 变更
	handleDebtRightsChange = (key, value) => {
		if (key === "collateralMsgs") {
			let arr = value.filter(
				(i) => (i.owner && i.owner.length > 0) || i.collateralName
			); //抵押物信息 填写名称或所有人有效
			this.setState({
				collateralMsgsData: arr,
			});
		} else {
			this.setState(
				{
					[key]: value,
				},
				() => {
					const {
						summation,
						creditorsRightsPrincipal,
						outstandingInterest,
					} = this.state;
					if (key !== "totalAmountCreditorsRights") {
						if (summation) {
							this.setState({
								totalAmountCreditorsRights:
									creditorsRightsPrincipal + outstandingInterest,
							});
						};
						if(key === 'summation' && !summation){
							this.setState({
								totalAmountCreditorsRights: "",
							});
						};
					}
				}
			);
		}
	};

	// 保证人信息  抵质押人信息 债务人信息 变更
	handleChange = (key, value) => {
		const {detailInfo} = this.state;
		const arr = detailInfo;
		if (key === "guarantors") {
			const guarantorVal = clone(value);
			arr[key][0].msgVOS = guarantorVal.filter((i) => {
				let params = i;
				params.msgs = filters.blockEmptyRow(params.msgs, ["name", "number"]);
				return params.msgs.length > 0;
			});
		} else {
			arr[key] = filters.blockEmptyRow(value, ["name", "number"]);
		}
		this.setState(
			{
				detailInfo: arr,
			},
			() => this.getOwners("isChange")
		);
	};

	render() {
		const {
			creditorsRightsPrincipal,
			outstandingInterest,
			totalAmountCreditorsRights,
			debtors,
			pledgers,
			collateralMsgs,
			guarantors,
			summation,
			dynamicOwners,
			activeFlag,
			debtorsNameGroup,
			loading
		} = this.state;
		const isHouseHoldDetail = window.location.href.includes("houseHoldDetail");
		const anchorList = isHouseHoldDetail
			? Object.keys(ANCHOR_TYPE)
			: Object.keys(ANCHOR_TYPE).slice(2);
		const {
			match: {
				params: {isEdit, id, debtId},
			},
		} = this.props;
		const noEdit = parseInt(isEdit);
		document.title = this.documentTitle;
		return (
			<div className="yc-debt-newpage-container">
				<div className="yc-debt-newpage-content">
					<Spin spinning={loading} tip="Loading...">
						<div className="yc-household-detail">
							<div className="detail-header">
								{isHouseHoldDetail && Boolean(parseInt(id))
									? `债务人：${debtorsNameGroup}`
									: this.documentTitle}
							</div>
							<div className="yc-anchor">
								<ul>
									{anchorList.map((item, index) => (
										<li key={`anchor${index}`}>
											<a
												href={`#${item}`}
												className={index === activeFlag ? "active" : null}
												onClick={() => this.setState({activeFlag: index})}
											>
												{ANCHOR_TYPE[item]}
											</a>
										</li>
									))}
								</ul>
							</div>
							{isHouseHoldDetail && (
								<Fragment>
									<DebtRights
										creditorsRightsPrincipal={creditorsRightsPrincipal}
										outstandingInterest={outstandingInterest}
										totalAmountCreditorsRights={totalAmountCreditorsRights}
										summation={summation}
										isEdit={noEdit}
										handleChange={this.handleDebtRightsChange}
										role="DebtRights"
									/>
									<PledgersAndDebtorsInfo
										data={debtors}
										isEdit={noEdit}
										handleChange={this.handleChange}
										role="debtors"
									/>
								</Fragment>
							)}
							<GuarantorsInfo
								data={guarantors[0] ? guarantors[0].msgVOS : []}
								isEdit={noEdit}
								handleChange={this.handleChange}
							/>
							<PledgersAndDebtorsInfo
								data={pledgers}
								isEdit={noEdit}
								handleChange={this.handleChange}
								role="pledgers"
							/>
							<CollateralMsgsInfo
								data={collateralMsgs}
								handleChange={this.handleDebtRightsChange}
								dynamicOwners={dynamicOwners}
								isEdit={noEdit}
								id={debtId}
								wrappedComponentRef={(inst) => (this.collateralMsgsRef = inst)}
							/>
							{noEdit ? (
								<div className="save-btn">
									<Button onClick={this.handleSubmit} type="primary">
										保存并关闭
									</Button>
								</div>
							) : null}
						</div>
					</Spin>
				</div>
			</div>
		);
	}
}

export default withRouter(rule(HouseHoldDetail));
