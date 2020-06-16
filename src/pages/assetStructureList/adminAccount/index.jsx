/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { Spin,message } from 'antd';
import { adminStructuredList } from "@api";
import SearchForm from "@/components/assetStructureList/searchFilter/admin";
import AdminTable from "@/components/assetStructureList/tabTable/admin";
import '@/pages/style.scss';
import { BreadCrumb } from '@commonComponents';

class Admin extends React.Component {
    state = {
        page: 1,
        total: 0,
        tableList: [],
        editNmu: 0,  //已修改数字
        checkErrorNum: 0,  //检查错误列数字
        tabIndex: 0, //tab所在页
        loading: false,
        searchParams: {} //保存搜索框参数
    };
    get searchFilterForm(){
        return this.searchFormRef.props.form
    }
    //改完 跳回详情功能要补充
    componentDidMount() {
        const params = this.getParamsByTabIndex()
        this.getTableList(params);
    };
    /* checkType 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
       status 结构化所处阶段 0：全部 1：未检查 2：检查无误 3：检查错误 4：已修改 5：待确认 6:未标记
    根据tabIndex获取参数并合并外部参数  设置默认tabIndex,仅当切换新tab 
    需要传递新tab进来  当换页或搜索传外部param合并 包括page title等 */
    getParamsByTabIndex({ tabIndex = this.state.tabIndex, extraParams = null } = {}) {
        //判断是否有额外参数 将额外参数放外面 在更新新参数 覆盖原有参数
		const params = (extraParams) ? Object.assign({}, this.state.searchParams, extraParams) : Object.assign({}, this.state.searchParams)
        //根据不同的tabIndex 设置参数
        switch (tabIndex) {
            case 0:
                params.checkType = 3; params.status = 0; break;
            case 1:
                params.checkType = 3; params.status = 6; break;
            case 2:
                params.checkType = 1; params.status = 1; break;
            case 3:
                params.checkType = 2; params.status = 2; break;
            case 4:
                params.checkType = 2; params.status = 3; break;
            case 5:
                params.checkType = 0; params.status = 4; break;
            default:
                break;
        }
        return params;
    }
    //改完
    getTableList = (params) => {
        this.setState({
            loading: true,
        })
        adminStructuredList(params).then(res => {
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
                tableList: (dataObject.result) ? dataObject.result.list : [], //为空
                total: (dataObject.result) ? dataObject.result.total : 0,
                page: (dataObject.result) ? dataObject.result.page : 1,
                loading: false
            });
        }).catch(err=>{
			this.setState({
				loading:false
			},()=>{
				message.error(err)
			})
		})
    };
    // 搜索框
	handleSearch = data => {
		this.setState({
			searchParams: data
		}, () => {
			const params = this.getParamsByTabIndex()
			this.getTableList(params);
		})

	};

	//清空搜索条件
	clearSearch = () => {
		this.setState({
			searchParams: {}
		}, () => {
			const params = this.getParamsByTabIndex();
			this.getTableList(params);
		})
	};

	//切换Tab
	changeTab = (key) => {
        this.searchFilterForm.resetFields()
		const _key = parseInt(key);
		const params = this.getParamsByTabIndex({ tabIndex: _key });
		this.getTableList(params);
		this.setState({
            tabIndex: _key,
            searchParams:{}
		});
	};
	//换页
	onTablePageChange = (page) => {
		let params = this.getParamsByTabIndex({ extraParams: { page } })
		this.getTableList(params);
		this.setState({
            page,
            searchParams:{}
		})
	};

    render() {
        const { tableList, checkErrorNum, editNum, total, page, tabIndex, loading } = this.state;
        return (
            <div className="yc-content-container">
                <BreadCrumb texts={['资产结构化检查']}></BreadCrumb>
                <div className="yc-detail-content">
                    <div className="yc-search-line">
                        <SearchForm 
                            wrappedComponentRef={(inst)=>this.searchFormRef = inst}
                            tabIndex={tabIndex}
                            toSearch={this.handleSearch.bind(this)}
                            toClear={this.clearSearch.bind(this)}
                        />
                    </div>
                    <div className="yc-tab">
                        <Spin tip="Loading..." spinning={loading}>
                            <AdminTable
                                page={page}
                                tabIndex={tabIndex}
                                total={total}
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
export default withRouter(Admin);
