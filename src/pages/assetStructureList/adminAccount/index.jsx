/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { Spin } from 'antd';
import { adminStructuredList } from "../../../server/api";
import SearchForm from "../../../components/searchInfo";
import AdminTable from "../../../components/tabTable/admin";
import '../../../pages/style.scss';
import { BreadCrumb } from '../../../components/common';

class Admin extends React.Component {
    state = {
        page: 1,
        total: 0,
        tableList: [],
        editNmu: 0,  //已修改数字
        checkErrorNum: 0,  //检查错误列数字
        tabIndex: 0, //tab所在页
        loading: false,
    };
    //根据所处tabIndex获取搜索时间栏的文字显示内容 然后传给搜索栏子组件
    get searchTimeTypeInput() {
        switch (this.state.tabIndex) {
            case 0: case 1:
                return '抓取时间';
            case 2:
                return '结构化时间';
            case 3: case 4:
                return '检查时间'
            case 5:
                return '修改时间'
            default:
                return ''
        }
    }

    componentDidMount() {
        const { tabIndex } = this.state;
        //详情页跳回路由
        const option = this.setTimeType(tabIndex);
        let params = {
            status: option.status,
            checkType: option.checkType,
        };
        this.getTableList(params);
    };
    //根据status传不同时间类型
    // checkType = checkType| 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
    // status 0：全部 1：未检查 2：检查无误 3：检查错误 4：已修改 5：待确认 6:未标记
    setTimeType = (tabIndex) => {
        if (tabIndex === 0) {
            return {
                checkType: 3,
                status: 0,
            }
        } else if (tabIndex === 1) {
            return {
                checkType: 3,
                status: 6,
            }
        } else if (tabIndex === 2) {
            return {
                checkType: 1,
                status: 1,
            }
        } else if (tabIndex === 3) {
            return {
                checkType: 2,
                status: 2,
            }
        } else if (tabIndex === 4) {
            return {
                checkType: 2,
                status: 3,
            }
        } else if (tabIndex === 5) {
            return {
                checkType: 0,
                status: 4,
            }
        }

    };
    //根据tabIndex获取参数 合并参数  设置默认tabIndex,仅当切换新tab 需要传递新tab进来  当换页传新param 包括page等
    getParamsByTabIndex({tabIndex = this.state.tabIndex, extraParams} = {}) {
        //判断page参数是否有
        const params = (arguments[0].extraParams) ? Object.assign({}, extraParams) : {}
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
        })
    };

    // 搜索框
    handleSearch = data => {
        const { tabIndex } = this.state;
        let params = data;
        const option = this.setTimeType(tabIndex);
        params.checkType = option.checkType;
        this.getTableList(params);

    };

    //清空搜索条件
    clearSearch = (tabIndex) => {
        console.log(tabIndex)
        const option = this.setTimeType(tabIndex);
        let params = {
            status: option.status,
            checkType: option.checkType,
        };
        this.getTableList(params);
    };

    //切换Tab 改完
    changeTab = (key) => {
        const _key = parseInt(key);
        const params = this.getParamsByTabIndex({tabIndex:_key});
        this.getTableList(params);
        this.setState({
            tabIndex: _key
        });
    };

    //换页 改完 
    onTablePageChange = (page) => {
        const { tabIndex } = this.state;
        let params = this.getParamsByTabIndex({extraParams:{page},tabIndex})
        this.getTableList(params);
        this.setState({
            page
        })
    };

    render() {
        const { tableList, checkErrorNum, editNum, total, page, tabIndex, loading } = this.state;
        return (
            <div className="yc-content-container">
                <BreadCrumb texts={['资产结构化检查']}></BreadCrumb>
                <div className="yc-detail-content">
                    <div className="yc-search-line">
                        <SearchForm status={tabIndex}
                            timeType={this.searchTimeTypeInput}
                            toSearch={this.handleSearch.bind(this)}
                            toClear={this.clearSearch.bind(this)}
                        />
                    </div>
                    <p className="line" />
                    <div className="yc-tab">
                        <Spin tip="Loading..." spinning={loading}>
                            <AdminTable
                                page={page}
                                tabIndex={tabIndex.toString()}
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
