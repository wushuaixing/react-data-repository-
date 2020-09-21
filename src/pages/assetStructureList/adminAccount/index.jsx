/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { Spin,message } from 'antd';
import { adminStructuredList } from "@api";
import SearchForm from "@/components/assetStructureList/searchFilter/admin";
import AdminTable from "@/components/assetStructureList/tabTable/admin";
import '@/pages/style.scss';
import { BreadCrumb } from '@commonComponents';
import {scrollTop } from "@utils/tools";
import { dateUtils} from "@utils/common";
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
    get params() {
        /* checkType 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
        status 结构化所处阶段 0：全部 1：未检查 2：检查无误 3：检查错误 4：已修改 5：待确认 6:未标记
        根据tabIndex获取参数  需要传递新tab进来  当换页或搜索传外部param合并 包括page title等 */
        let { tabIndex, page } = this.state
        let params = Object.assign(this.state.searchParams, { page })
        //根据不同的tabIndex 设置参数
        params.tabFalg = parseInt(tabIndex);
        return params;
    }
    //改完 跳回详情功能要补充
    componentDidMount() {
        this.getTableList();
        document.title='资产结构化'
    };
    /* checkType 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
       status 结构化所处阶段 0：全部 1：未检查 2：检查无误 3：检查错误 4：已修改 5：待确认 6:未标记*/
    getTableList = () => {
        if(this.params['structuredStartTime']&&this.params['structuredEndTime']&&this.params['structuredStartTime']>this.params['structuredEndTime']){
			message.error('开始时间不能大于结束时间');
			return false;
		}
        this.setState({
            loading: true,
        })
        adminStructuredList(this.params).then(res => {
            //判断状态码 判断结果是否存在 
            if (res.data.code === 200) {
                return res.data.data;
            } else {
                return Promise.reject('请求出错')
            }
        }).then((dataObject) => {
            let tableList=[];   //返回值变为时间戳  
            dataObject.result&&dataObject.result.list.forEach((item)=>{
                let obj=item;
                obj.time=dateUtils.formatStandardNumberDate(item.time)||'';
                obj.info.start=dateUtils.formatStandardNumberDate(item.info.start,true)||'';
                tableList.push(obj);
            })
            this.setState({
                tableList,
                checkErrorNum: dataObject.checkErrorNum,
                editNum: dataObject.alreadyEditedNum,
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
            searchParams: data,
            page:1
		}, () => {
			this.getTableList();
		})

	};

	//清空搜索条件
	clearSearch = () => {
		this.setState({
			searchParams: {}
		}, () => {
			this.getTableList();
		})
	};

	//切换Tab
	changeTab = (key) => {
        this.searchFilterForm.resetFields()
		this.setState({
            tabIndex: parseInt(key),
            searchParams:{},
            page:1
		},()=>{
            this.getTableList()
        });
	};
	//换页
	onTablePageChange = (page) => {
		this.setState({
            page,
		},()=>{
            this.getTableList();
            scrollTop();
        })
	};

    render() {
        const { tableList, checkErrorNum, editNum, total, page, tabIndex, loading } = this.state;
        return (
            <div className="yc-content-container">
                <BreadCrumb texts={['资产结构化']}></BreadCrumb>
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
