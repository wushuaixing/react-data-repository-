/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { message, Spin } from 'antd';
import { getCheckList, adminStructuredList } from "../../../server/api";
import SearchForm from "../../../components/searchInfo";
import AdminTable from "../../../components/tabTable/admin";
import '../../../pages/style.scss';
import { BreadCrumb } from '../../../components/common';
let isCheck = (window.localStorage.userState==='管理员')?false:true;


class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page: 1,
			total: 0,
			currentPage: 1,
			tableList: [],
			waitNum: 0,
			editNmu: 0,
			checkErrorNum: 0,
			status: 0,
			tabIndex: "0",
			personnelList: [],
			timeType: "结构化时间",
			loading: false,
		};
	}

	componentDidMount() {
		const { status } = this.state;
		//详情页跳回路由
		if (this.props.location.state) {
			let { statusPath, pagePath, tabPath } = this.props.location.state;
			let _status = parseInt(tabPath);

			const option = this.setTimeType(_status);
			this.setState({
				tabIndex: tabPath,
			});
			let params = {
				status: option.tab,
				num: 10,
				page: pagePath,
				checkType: option.time,
			};
			this.getTableList(params);
			if (!isCheck) {
				this.setState({
					status: statusPath,
				})
			}
		}
		else {
			const option = this.setTimeType(status);
			let params = {
				status: option.tab,
				num: 10,
				page: 1,
				checkType: option.time,
			};
			this.getTableList(params);
		}
	};
	//根据status传不同时间类型
	// checkType| 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
	setTimeType = (status) => {
		if (status === 0) {
			this.setState({
                timeType: "抓取时间",
            });
            return {
                time: 3,
                tab: 0,
            }
		} else if (status === 1) {
			this.setState({
                timeType: "抓取时间",
            });
            return {
                time: 3,
                tab: 6,
            }
		} else if (status === 2) {
			this.setState({
                timeType: "结构化时间",
            });
            return {
                time: 1,
                tab: 1,
            }
		} else if (status === 3) {
			this.setState({
				timeType: "检查时间",
			});
			return {
                time: 2,
                tab: 2,
            }
		} else if (status === 4) {
			this.setState({
                timeType: "检查时间",
            });
            return {
                time: 2,
                tab: 3,
            }
		} else if (status === 5) {
			this.setState({
                timeType: "修改时间",
            });
            return {
                time: 0,
                tab: 4,
            }
		}

	};

	//get table dataSource
	getTableList = (params) => {
		this.setState({
			loading: true,
		});
		if (isCheck) {
			this.setState({
				approveStatus: params.status,
			})
		} else {
			this.setState({
				status: params.status,
			})
		}
		if (isCheck) {
			getCheckList(params).then(res => {
				this.setState({
					loading: false,
				});
				if (res.data.code === 200) {
					let data = res.data.data.result || {};
					if (data.list) {
						let _list = data.list;
						//待改
						_list.map((item) => {
							let _temp = [];
							_temp.push(item.status);
							item.status = _temp;
							return null;
						});
						this.setState({
							tableList: _list,
							total: res.data.data.result.total,
							page: res.data.data.result.page,
							waitNum: res.data.data.waitConfirmedNum,
							checkErrorNum: res.data.data.checkErrorNum,
							editNum: res.data.data.alreadyEditedNum,
						});
					}
					else {
						let _total = 0;
						this.setState({
							tableList: [],
							total: _total,
						});
					}
				} else {
					message.error(res.data.message);
				}
			});
		} else {
			adminStructuredList(params).then(res => {
				this.setState({
					loading: false,
				});
				if (res.data.code === 200) {
					if (res.data.data.result) {
						let _list = res.data.data.result.list;
						//待改
						_list.map((item) => {
							let _temp = [];
							_temp.push(item.status);
							item.status = _temp;
							return null;
						});
						this.setState({
							tableList: _list,
							total: res.data.data.result.total,
							checkErrorNum: res.data.data.checkErrorNum,
							editNum: res.data.data.alreadyEditedNum,
							page: res.data.data.result.page,
						});
					}
				} else {
					message.error(res.data.message);
				}
			});
		}

	};

	// 搜索框
	handleSearch = data => {
		const { status } = this.state;
		let params = data;

		const option = this.setTimeType(status);
		params.checkType = option.time;
		if (isCheck) {
			this.getTableList(params);
		}
		else {
			this.getTableList(params);
		}

	};

	//清空搜索条件
	clearSearch = (status) => {
		const option = this.setTimeType(status);
		let params = {
			status: option.tab,
			num: 10,
			page: 1,
			checkType: option.time,
		};
		this.getTableList(params);
	};

	//切换Tab
	changeTab = (key) => {
		const _key = parseInt(key);
		const option = this.setTimeType(_key);
		let params = {
			status: option.tab,
			num: 10,
			page: 1,
			checkType: option.time,
		};
		this.getTableList(params);
		const _tabIndex = _key.toString();
		this.setState({
			tabIndex: _tabIndex,
		});
		if (!isCheck) {
			this.setState({
				status: _key,
			})
		}
	};

	//换页
	onTablePageChange = (num) => {
		const { tabIndex } = this.state;
		const _tabIndex = parseInt(tabIndex);
		const option = this.setTimeType(_tabIndex);
		let params = {
			status: option.tab,
			num: 10,
			page: num,
			checkType: option.time,
		};

		this.getTableList(params);
	};

	render() {
		const { tableList, waitNum, checkErrorNum, editNum, timeType, total, page, status, tabIndex, loading } = this.state;
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化检查']}></BreadCrumb>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<SearchForm status={status}
							timeType={timeType}
							toSearch={this.handleSearch.bind(this)}
							toClear={this.clearSearch.bind(this)}
						/>
					</div>
					<p className="line" />
					<div className="yc-tab">
						<Spin tip="Loading..." spinning={loading}>
							<AdminTable page={page}
								status={status}
								tabIndex={tabIndex}
								total={total}
								waitNum={waitNum}
								checkErrorNum={checkErrorNum}
								editNum={editNum}
								data={tableList}
								isCheck={isCheck}
								onPage={this.onTablePageChange.bind(this)}
								onTabs={this.changeTab.bind(this)}
							/>
						</Spin>
					</div>
				</div>
			</div>
		);
	}
}
export default withRouter(Admin);
