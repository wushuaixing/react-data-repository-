/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { Spin,message } from 'antd';
import { getCheckList } from "@api";
import SearchForm from "@/components/assetStructureList/searchFilter/check";
import TabTable from "@/components/assetStructureList/tabTable/check";
import '@/pages/style.scss';
import { BreadCrumb } from '@commonComponents'
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
			searchParams: {} //保存搜索框参数
		};
	}
	get searchFilterForm(){
        return this.searchFormRef.props.form
	}
	get params() {
        /* checkType 查询类型 0：最新结构化时间  1：初次结构化时间 2：检查时间 3：抓取时间
        status 结构化所处阶段 0：全部 1：未检查 2：检查无误 3：检查错误 4：已修改 5：待确认 6:未标记
        根据tabIndex获取参数  需要传递新tab进来  当换页或搜索传外部param合并 包括page title等 */
        let { tabIndex, page } = this.state;
        let params = Object.assign(this.state.searchParams, { page });
        //根据不同的tabIndex 设置参数
        switch (tabIndex) {
            case 0:
                params.checkType = 1; break;
            case 1:
                params.checkType = 1; break;
            case 2:
                params.checkType = 2; break;
            case 3:
                params.checkType = 2; break;
            case 4:
                params.checkType = 0; break;
            case 5:
                params.checkType = 1; break;
            default:
                break;
		}
		params.status = parseInt(tabIndex);
        return params;
    }
	componentDidMount() {
		this.getTableList();
	};
	getTableList = () => {
		if(this.params['structuredStartTime']&&this.params['structuredEndTime']&&this.params['structuredStartTime']>this.params['structuredEndTime']){
			message.error('开始时间不能大于结束时间');
			return false;
		}
		this.setState({
			loading: true,
		});
		getCheckList(this.params).then(res => {
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
				waitNum: dataObject.waitConfirmedNum,
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
		const _data = data;
		const { tabIndex } = this.state;
		if ( tabIndex === 2 || tabIndex === 3 ){
			_data.checkStartTime = _data.structuredStartTime;
			_data.checkEndTime = _data.structuredEndTime;
			delete _data.structuredStartTime;
			delete _data.structuredEndTime;
		}
		this.setState({
			searchParams: _data,
			page:1
		}, () => {
			this.getTableList();
		})
	};
	clearSearch = () => {
		this.setState({
			searchParams: {}
		}, () => {
			this.getTableList();
		})
	};
	changeTab = (key) => {
		this.searchFilterForm.resetFields();
		this.setState({
            tabIndex: parseInt(key),
            searchParams:{},
            page:1
		},()=>{
            this.getTableList()
        });
	};
	onTablePageChange = (page) => {
		this.setState({
            page,
		},()=>{
            this.getTableList();
        })
	};

	render() {
		const { tableList, waitNum, checkErrorNum, editNum, total, page, status, tabIndex, loading } = this.state;
		return (
			<div className="yc-content-container">
				<BreadCrumb texts={['资产结构化']}/>
				<div className="yc-detail-content">
					<div className="yc-search-line">
						<SearchForm
							wrappedComponentRef={(inst)=>this.searchFormRef = inst}
							status={status}
							tabIndex={tabIndex}
							toSearch={this.handleSearch.bind(this)}
							toClear={this.clearSearch.bind(this)}
						/>
					</div>
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
