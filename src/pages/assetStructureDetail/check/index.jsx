import React from 'react'
import CheckBasicDetail from '@/components/assetStructureDetail/basicDetail'
import CheckButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import CheckPropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import CheckDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import CheckWrongDetail from '@/components/assetStructureDetail/wrongDetail'
import ReturnRemark from '@/components/assetStructureDetail/returnRemark'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'
import { withRouter } from 'react-router-dom'
import './index.scss'
import {
    changeWrongType,//在结构化人员未修改前 再次修改错误
    // beConfirmed, //待确认列表中点击确认
    getFeedBackRemark, //获取退回备注
    getCheckDetail,//获取检查人员结构化详情信息
    inspectorCheck,  // 检查提交
    saveInspectorStructureDetail, //保存已删除的结构化账号的结构化信息
    getWrongTypeAndLevel, //获取错误原因和类型,
    updateBackStatus,
} from '@api';
import CheckModal from "@/components/assetStructureDetail/checkErrorModal";
import { message } from "antd";
import { filters } from '@utils/common'
function getObligor() {
    return {
        "birthday": '',
        "gender": "0",
        "labelType": "1",
        "name": "",
        "notes": "",
        "number": "",
        "type": "1"
    }
}
function CheckWrongLog(){
    this.auctionExtractWrongTypes = [];
	  this.remark = '';
	  this.wrongLevel = 0
}
class Check extends React.Component {
    state = {
        ah: [],
        associatedAnnotationId: "",
        auctionStatus: 1,
        buildingArea: 0,
        collateral: 0,
        detailStatus: 1,
        houseType: 0,
        obligors: [],
        reasonForWithdrawal: "",
        records: [],
        title: "",
        url: "",
        wsFindStatus: 1,
        wsInAttach: 0,
        wsUrl: [],
        onlyThis: 0,
        wrongData: [],
        returnRemarks: '',
        isUpdateRecord:false
    };

    get updateOrSubmitCheck() {
        const length = this.state.records.length;
        const desc = this.state.records[length - 1].desc;
        return (['结构化','自动标注'].indexOf(desc)>=0||length===0) ? 'submit' : 'update'
    }

    // 是否 待确认列数据
    get isUnconfirmed(){
        const { match:{ params:{ tabIndex } } } = this.props;
        return tabIndex==='5';
    }

    componentDidMount() {
        const { id, status,isNotConfirm } = this.props.match.params;
        console.log(this.props.location.query);
        if (!sessionStorage.getItem('structPersonnelEnable') && this.props.location.query && this.props.location.query.enable !== undefined) {
            //console.log(this.props.location.query.enable)
            sessionStorage.setItem('structPersonnelEnable', this.props.location.query.enable)
        }
        getCheckDetail(id).then((res) => {
            const data = res.data.data;
            this.setState({
                ...res.data.data,
                ah: data && data.ah && data.ah instanceof Array && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                wsUrl: data && data.wsUrl && data.ah instanceof Array && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
            }, () => {
                /* console.log(this.state) */
            })
        });
        if (parseInt(status) >= 3) {
            getWrongTypeAndLevel(id).then((res) => {
                this.setState({
                    wrongData: (res.data.data!==null)?res.data.data:[]
                },()=>{

                })
            })
        }
        if (parseInt(isNotConfirm) === 1) {
            getFeedBackRemark(id).then((res) => {
                //console.log(res)
                this.setState({
                    returnRemarks: res.data.data
                })
            })
        }
    }
    componentWillUnmount() {
        sessionStorage.removeItem('structPersonnelEnable')
    }

    handleSubmit() {
        this.saveRecordData()
    }
    handleChange(key, value) {
        this.setState({
            [key]: value,
            isUpdateRecord:true
        }, () => {
            //console.log(this.state)
        })
    }
    handleDocumentChange(combine, value) {
        const arr_index = combine.substr(combine.length - 1, 1);
        const key = combine.substr(0, combine.length - 1);
        const arr = [...this.state[key]];
        arr[arr_index].value = value;
        this.setState({
            [key]: arr,
            isUpdateRecord:true
        }, () => {
            //console.log(this.state)
        })
    }
    handleRoleChange(combine, value) {
        const arr_index = combine.substr(combine.length - 1, 1);
        const key = combine.substr(0, combine.length - 1);
        const arr = [...this.state.obligors];
        arr[arr_index][key] = value;
        this.setState({
            obligors: arr,
            isUpdateRecord:true
        }, () => {
            //console.log(this.state)
        })
    }
    onClickToTable() {
        this.props.history.push('/index');
    }
    submitWrongRecord(data, checkError = true) {
        const { id,status } = this.props.match.params;
        if (this.updateOrSubmitCheck === 'submit') {
            let params = {
                checkWrongLog: Object.assign({}, data),
                checkError,
                id,
            };
            if(this.isUnconfirmed) params.flag=1;
            inspectorCheck(params,status).then(res => {
                if (res.data.code === 200) {
                    message.success("操作成功");
                    this.onClickToTable()
                } else {
                    message.error("操作失败");
                }
            });
        } else {
            let params = (checkError) ? {...data} : new CheckWrongLog();
            if(this.isUnconfirmed) params.flag=1;
            changeWrongType(id,params).then(res => {
                if (res.data.code === 200) {
                    message.success("操作成功");
                    this.onClickToTable()
                } else {
                    message.error("操作失败");
                }
            })
        }

    }
    handleConfirm(){
        const { id } = this.props.match.params;
        updateBackStatus({id}).then((res)=>{
            if (res.data.code === 200) {
                message.success("操作成功");
                this.onClickToTable()
            } else {
                message.error("操作失败");
            }
        })
    }
    //检查错误弹窗按钮接口
    handleModalSubmit = (data) => {
        this.submitWrongRecord(data, true)
    };
    handleModalCancel = () => {
        this.setState({
            visible: false,
        });
    };
    handleErrorModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleNoErr() {
        this.submitWrongRecord({}, false)
    }
    handleAddClick(key) {
        const arr = (key !== 'obligors') ? [...this.state[key], { value: '' }] : [...this.state[key], { ...getObligor() }];
        this.setState({
            [key]: arr,
            isUpdateRecord:true
        }, () => {
            //console.log(this.state)
        });
    }
    handleDeleteClick(key, index = -1) {
        console.log(key, index);
        //角色对应顺序删除  文书从下往上删
        const arr = (index >= 0) ? this.state[key].slice(0) : this.state[key].slice(0, -1);
        if (index >= 0) {
            arr.splice(index, 1)
        }
        this.setState({
            [key]: arr,
            isUpdateRecord:true
        }, () => {
            //console.log(this.state)
        });
    }
    handleStructureUpdate() {
        if(!this.enable&&!this.state.isUpdateRecord){
            //如果是已删除账号的检查结构化详情 并且未做修改 不能保存
            message.warning('当前页面未作修改，请修改后再保存');
            return false;
        }
        /* 资产标注详情页存在名称里不含“银行”、“信用社”、“信用联社”且备注为空的债权人时，点击保存，
        保存无效并弹出“债权人备注待完善”非模态框提示； */
        for (let i = 0; i < this.state.obligors.length; i++) {
            let name = this.state.obligors[i].name;
            if (this.state.obligors[i].notes === '' && this.state.obligors[i].labelType === '2' && name.indexOf('银行') < 0 && name.indexOf('信用社') < 0 && name.indexOf('信用联社') < 0) {
                message.warning('债权人备注待完善');
                return false;
            }
            if (this.state.obligors[i].notes === '' && this.state.obligors[i].labelType === '3') {
                message.warning('资产线索备注待完善');
                return false;
            }
        }
        /* 资产标注详情页存在备注为空的资产线索时，点击保存，保存无效并弹出“资产线索备注待完善”非模态框提示 */
        const { id } = this.props.match.params;
        //去空行
        const keys = ['name', 'birthday', 'notes', 'number'];
        const state = this.state;
        state.obligors = filters.blockEmptyRow(this.state.obligors, keys);
        // 如果是未找到文书 去掉文书链接 相关文书案号 见附件详情
        if (state.wsFindStatus === 0) {
            state.wsUrl = [];
            state.wsInAttach = 0;
            state.ah = []
        } else {
            state.ah = filters.blockEmptyRow(this.state.ah, ['value']);
            state.wsUrl = filters.blockEmptyRow(this.state.wsUrl, ['value'])
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
            wsUrl: state.wsUrl
        };
        if(this.isUnconfirmed) params.flag=1;
        saveInspectorStructureDetail(id, params).then(res => {
            if (res.data.code === 200) {
                message.success('保存成功!');
                this.props.history.push({
                    pathname: `/index`
                })
            } else {
                message.error('保存失败!')
            }
        })
    }
    get enable(){
        return JSON.parse(sessionStorage.getItem('structPersonnelEnable'));
    }
    render() {
        const state = this.state;
        const { status,isNotConfirm } = this.props.match.params;
        const enable = this.enable;
        const moduleOrder = [
            <CheckBasicDetail
                key={0} auctionID={state.id}
                associatedAnnotationId={state.associatedAnnotationId}
                type={state.type} records={state.records}
                title={state.title} auctionStatus={state.auctionStatus}
                reasonForWithdrawal={state.reasonForWithdrawal} url={state.url} wsUrl={state.wsUrl}>
            </CheckBasicDetail>
        ];
        if (parseInt(status) >= 3&&state.wrongData&&state.wrongData.length>0) {
            moduleOrder.unshift(
                <CheckWrongDetail wrongData={state.wrongData.slice(0, 1)} key={1} />
            )
        }
        if (parseInt(isNotConfirm) === 1) {
            moduleOrder.unshift(
                <ReturnRemark key={2} notes={this.state.returnRemarks}/>
            )
        }
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb texts={['资产结构化检查 / 详情']}/>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {moduleOrder[0]}
                        <CheckButtonGroup
                            role={'check'} enable={enable} type={state.type}
                            handleErrorModal={this.handleErrorModal.bind(this)}
                            handleBack={this.onClickToTable.bind(this)}
                            handleStructureUpdate={this.handleStructureUpdate.bind(this)}
                            handleNoErr={this.handleNoErr.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            handleConfirm={this.handleConfirm.bind(this)}
                            status={status}>
                        </CheckButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        { moduleOrder.length > 0 ? moduleOrder.slice(1) : null }
                        <CheckPropertyDetail
                            enable={enable}
                            collateral={state.collateral} buildingArea={state.buildingArea}
                            houseType={state.houseType} handleChange={this.handleChange.bind(this)}
                        />
                        <CheckDocumentDetail
                            enable={enable}
                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl} ah={state.ah} wsInAttach={state.wsInAttach}
                            handleDocumentChange={this.handleDocumentChange.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            handleAddClick={this.handleAddClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                        />
                        <RoleDetail
                            obligors={state.obligors}
                            enable={enable}
                            handleChange={this.handleRoleChange.bind(this)}
                            handleAddClick={this.handleAddClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                        />
                    </div>

                </div>
                <CheckModal visible={state.visible}
                    returnRemarks={state.returnRemarks}
                    wrongReasons={state.wrongData.slice(0,1)}
                    handleModalSubmit={this.handleModalSubmit.bind(this)}
                    handleModalCancel={this.handleModalCancel.bind(this)}
                    style={{ width: 430 }}
                />
            </div>
        )
    }
}

export default withRouter(Check);
