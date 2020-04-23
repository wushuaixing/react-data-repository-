/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { message, Spin } from 'antd';
import { getCheckList } from "../../../server/api";
import SearchForm from "../../../components/searchFilter/check";
import TabTable from "../../../components/tabTable/check";
import '../../../pages/style.scss';
import { BreadCrumb } from '../../../components/common'
class Check extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			num: 10,
			page: 1,
			total: 0,
			tableList: [],
			waitNum: 0,
			editNmu: 0,
			checkErrorNum: 0,
			status: 0,
			tabIndex: 0,
			personnelList: [],
			loading: false,
		};
	}

	componentDidMount() {
		const params = this.getParamsByTabIndex()
        this.getTableList(params);
	};
	getParamsByTabIndex({ tabIndex = this.state.tabIndex, extraParams = null } = {}) {
        //判断是否有额外参数
        const params = (extraParams) ? Object.assign({}, extraParams) : {}
        //根据不同的tabIndex 设置参数
        switch (tabIndex) {
            case 0:
                params.checkType = 1; params.status = 0; break;
            case 1:
                params.checkType = 1; params.status = 1; break;
            case 2:
                params.checkType = 2; params.status = 2; break;
            case 3:
                params.checkType = 2; params.status = 3; break;
            case 4:
                params.checkType = 0; params.status = 4; break;
            case 5:
                params.checkType = 1; params.status = 5; break;
            default:
                break;
        }
        return params;
    }
	getTableList = (params) => {
		this.setState({
			loading: true,
		});
		getCheckList(params).then(res => {
            //判断状态码 判断结果是否存在 
            if (res.data.code === 200) {
                return res.data.data;
            } else {
                Promise.reject('请求出错')
            }
        }).then((dataObject) => {
            this.setState({
                checkErrorNum: dataObject.checkErrorNum,
				editNum: dataObject.alreadyEditedNum,
				waitNum: dataObject.waitConfirmedNum,
                tableList: (dataObject.result) ? dataObject.result.list : [], //为空
                total: (dataObject.result) ? dataObject.result.total : 0,
                page: (dataObject.result) ? dataObject.result.page : 1,
                loading: false
            });
        })
	};

	// 搜索框
	handleSearch = data => {
		const params = this.getParamsByTabIndex({ extraParams: data })
        this.getTableList(params);

	};

	//清空搜索条件
	clearSearch = () => {
        const params = this.getParamsByTabIndex();
        this.getTableList(params);
    };

	//切换Tab
	changeTab = (key) => {
		const _key = parseInt(key);
        const params = this.getParamsByTabIndex({ tabIndex: _key });
        this.getTableList(params);
        this.setState({
            tabIndex: _key
        });
	};
	//换页
	onTablePageChange = (page) => {
        let params = this.getParamsByTabIndex({ extraParams: { page } })
        this.getTableList(params);
        this.setState({
            page
        })
    };

	render() {
		const { tableList, waitNum, checkErrorNum, editNum, total, page, status, tabIndex, loading } = this.state;
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化检查']}></BreadCrumb>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<SearchForm status={status}
							tabIndex={tabIndex}
							toSearch={this.handleSearch.bind(this)}
							toClear={this.clearSearch.bind(this)}
						/>
					</div>
					<p className="line" />
					<div className="yc-tab">
						<Spin tip="Loading..." spinning={loading}>
							<TabTable page={page}
								tabIndex={tabIndex}
								total={total}
								waitNum={waitNum}
								checkErrorNum={checkErrorNum}
								editNum={editNum}
								data={tableList}
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
export default withRouter(Check);
