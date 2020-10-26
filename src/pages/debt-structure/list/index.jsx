import React from 'react';
import { withRouter } from 'react-router-dom';
import { Spin,message } from 'antd';
import { structuredList } from '@api'; //结构化列表测试
// import { adminStructuredList } from "@api"; //管理员列表测试
// import { getCheckList } from "@api"; //检查人员列表测试
import DebtTable from './table';
import SearchForm from './query';
import { rule } from '@/components/rule-container';
import { BreadCrumb } from '@commonComponents';
import { scrollTop } from '@utils/tools';
import { dateUtils} from '@utils/common';
import './style.scss';

class DebtList extends React.Component {
    constructor(props){
        super(props);
        const { ruleSource:{rule} } = props;
		const data = [
			{ title: '全部', key: '0', rule: 'admin',status:0 },
			{ title: '未标注', key: '1', rule: 'admin',status:1 },
			{ title: '已标注', key: '2', rule: 'admin',status:2 },
			{ title: '全部', key: '0', rule: 'check',status:0 },
			{ title: '待标注', key: '0', rule: 'normal',status:1 },
			{ title: '已标注', key: '1', rule: 'normal',status:2 },
        ];
        const panes = data.filter(i=>i.rule===rule);
        this.state = {
            page: 1,
            total: 0,
            tableList: [],
            tabIndex: 0, 
            loading: false,
            panes,
            searchParams:{},
        };
    }

    componentDidMount() {
        this.getTableList();
    };

    /*只有管理员下的全部和未标注列显示抓取时间，其它显示初次标注时间*/
    get timeText() {
        const { tabIndex } = this.state;
        if(localStorage.getItem('userState') === '管理员' && tabIndex !== 2){
            return '抓取时间';
        }else{
            return '初次标注时间';
        }
    }

    get params() {
        const { ruleSource:{rule} } = this.props;
        const { tabIndex,page,searchParams } = this.state;
        let params = Object.assign(searchParams, { page });
        // params.tabFalg = rule === 'normal' ? tabIndex+1 :tabIndex;//管理员接口测试
        params.approveStatus =rule === 'normal' ? tabIndex+1 :tabIndex;//结构化接口测试
        return params;
    }

    get searchFilterForm(){
        return this.searchFormRef.props.form;
    }

    getTableList = () => {
        this.setState({
            loading: true,
        })
        structuredList(this.params).then(res => {
            if (res.data.code === 200) {
                // return res.data.data;
                return res.data;
            } else {
                return Promise.reject('请求出错');
            }
        }).then((dataObject) => {
            let tableList=[];  
            // dataObject.result&&dataObject.result.list.forEach((item)=>{
            //     let obj=item;
            //     obj.time=dateUtils.formatStandardNumberDate(item.time)||'';
            //     obj.info.start=dateUtils.formatStandardNumberDate(item.info.start,true)||'';
            //     tableList.push(obj);
            // })
            dataObject.data.forEach((item)=>{
                let obj=item;
                obj.time=dateUtils.formatStandardNumberDate(item.time);
                tableList.push(obj);
            })
            this.setState({
                tableList,
                // total: (dataObject.result) ? dataObject.result.total : 0,
                // page: (dataObject.result) ? dataObject.result.page : 1,
                total: (dataObject) ? dataObject.total : 0,
                page: (dataObject) ? dataObject.page : 1,
                loading: false,
            });
        }).catch(err=>{
			this.setState({
				loading:false,
			},()=>{
				message.error(err);
			});
		});
    };

    /*切换tab*/
	handleTabChange = (key) => {
        this.searchFilterForm.resetFields();
		this.setState({
            tabIndex: parseInt(key),
            searchParams:{},
            page:1,
		},()=>{
            this.getTableList();
        });
    };
    
    /*换页*/
	handlePageChange = (page) => {
		this.setState({
            page,
		},()=>{
            this.getTableList();
            scrollTop();
        });
    };

    /*搜索*/
	handleSearch = (data) => {
		this.setState({
            searchParams: data,
            page:1,
		}, () => {
			this.getTableList();
		});
	};

    /*清空搜索条件*/
    handleClearSearch = () => {
        this.setState({
			searchParams: {},
		}, () => {
			this.getTableList();
		});
    };

    render() {
        const { tableList,total,page,tabIndex,loading,panes } = this.state;
        const { ruleSource:{rule} } = this.props;
        document.title = '债权结构化';
        return (
            <div className="yc-debt-container">
                <div className="yc-debt-content">
                    <BreadCrumb texts={['债权结构化']} />
                    <div className="debt-search-content">
                        <SearchForm
                            wrappedComponentRef={(inst)=>this.searchFormRef = inst}
                            role={rule}
                            tabIndex={tabIndex}
                            timeText={this.timeText}
                            toSearch={this.handleSearch}
                            toClearSearch={this.handleClearSearch}
                        />
                    </div>
                    <div className="debt-list-content">
                        <Spin tip="Loading..." spinning={loading}>
                            <DebtTable
                                page={page}
                                tabIndex={tabIndex}
                                total={total}
                                data={tableList}
                                onPageChange={this.handlePageChange}
                                onTabChange={this.handleTabChange}
                                role={rule}
                                panes={panes}
                                timeText={this.timeText}
                            />
                        </Spin>
                    </div>
                </div>
            </div>
        );
    }
}
export default withRouter(rule(DebtList))
