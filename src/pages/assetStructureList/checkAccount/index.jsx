/** check * */
import React from 'react';
import { withRouter } from "react-router-dom";
import { Spin,message } from 'antd';
import { getCheckList } from "@api";
import SearchForm from "@/components/assetStructureList/searchFilter/check";
import TabTable from "@/components/assetStructureList/tabTable/check";
import '@/pages/style.scss';
import { BreadCrumb } from '@commonComponents';
import {scrollTop } from "@utils/tools";
import { dateUtils} from "@utils/common";

class Check extends React.Component {
	constructor(props) {
		super(props);
		props.cacheLifecycles.didRecover(this.componentDidRecover) //恢复时
		
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
			searchParams: {},//保存搜索框参数
		};
	}
	componentDidRecover = () => {
		this.getTableList();
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
		params.tabFalg = parseInt(tabIndex);
        return params;
    }
	componentDidMount() {
		this.getTableList();
		document.title='资产结构化检查';
		this.isstorageChange();
	};
	isstorageChange(){
		window.addEventListener("storage",()=>{
			this.getTableList();
		});
	}
	getTableList = () => {
		if(this.params['requestStartTime']&&this.params['requestEndTime']&&this.params['requestStartTime']>this.params['requestEndTime']){
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
				return Promise.reject('请求出错')
			}
		}).then((dataObject) => {
			let tableList=[];
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
				waitNum: dataObject.waitConfirmedNum,
				total: (dataObject.result) ? dataObject.result.total : 0,
				page: (dataObject.result) ? dataObject.result.page : 1,
				loading: false
			},()=>{
				localStorage.setItem('tonewdetail',Math.random())
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
		if(this.state.tabIndex===3||this.state.tabIndex===4){
			if(key===3||key===4){       //检查无误”与“检查错误”tab页互相切换时，筛选条件，且带出搜索结果
				this.setState({
					tabIndex: parseInt(key),
					page:1,
				},()=>{
					this.getTableList()
				});
			}else {                  //从检查无误或者检查错误切换到其他任何列时 不保留筛选条件
				this.searchFilterForm.resetFields();
				this.setState({
					tabIndex: parseInt(key),
					page:1,
					searchParams:{},
				},()=>{
					this.getTableList()
				});
			}
		}else if(this.state.tabIndex===5){  //如果是从已修改列切换到其他列   不保留筛选条件
			this.searchFilterForm.resetFields();
			this.setState({
				tabIndex: parseInt(key),
				page:1,
				searchParams:{},
			},()=>{
				this.getTableList()
			});
		}else {
			if(key===3||key===4||key===5){  //从 “全部”、“未检查”、“待确认”跳转到其他列时，不保留筛选条件
				this.searchFilterForm.resetFields();
				this.setState({
					tabIndex: parseInt(key),
					page:1,
					searchParams:{},
				},()=>{
					this.getTableList()
				});
			}else {
				this.setState({        // “全部”、“未检查”、“待确认”tab页互相切换时，保留筛选条件
					tabIndex: parseInt(key),
					page:1,
				},()=>{
					this.getTableList()
				});
			}
		}
	};
	onTablePageChange = (page) => {
		this.setState({
            page,
		},()=>{
			this.getTableList();
			scrollTop();
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
