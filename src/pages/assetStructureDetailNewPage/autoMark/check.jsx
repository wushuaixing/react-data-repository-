import React from 'react'
import { withRouter } from 'react-router-dom'
import BasicDetail from '@/components/assetStructureDetail/basicDetail'
import ButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import PropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import DocumentDetail from '@/components/assetStructureDetail/documentDetail'
import WrongDetail from '@/components/assetStructureDetail/wrongDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'
import CheckModal from "@/components/assetStructureDetail/checkErrorModal";
import {
    changeWrongType,//在结构化人员未修改前 再次修改错误
    beConfirmed, //待确认列表中点击确认
    getFeedBackRemark, //获取退回备注
    getCheckDetail,//获取检查人员结构化详情信息
    inspectorCheck,  // 检查提交
    saveInspectorStructureDetail, //保存已删除的结构化账号的结构化信息
    getWrongTypeAndLevel //获取错误原因和类型
} from '@api';
import { message } from "antd";
function CheckWrongLog() {
    this.auctionExtractWrongTypes = []
    this.remark = ''
    this.wrongLevel = 0
}
class Check extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 0,
            wrongData: [],
            records: [],
            title: '',
            reasonForWithdrawal: '',
            auctionStatus: null,
            url: '',
            collateral: null,
            buildingArea: null,
            houseType: null,
            wsFindStatus: null,
            wsUrl: [],
            ah: [],
            wsInAttach: null,
            obligors: [],
            wrongData: [],
        }
    }
    get updateOrSubmitCheck() {
        const length = this.state.records.length
        const desc = this.state.records[length - 1].desc
        return (['结构化','自动标注'].indexOf(desc)>=0||length===0) ? 'submit' : 'update'
    }
    loadData(){
        const { associatedAnnotationId } = this.props.match.params
        getCheckDetail(associatedAnnotationId).then((res)=>{
            if(res.data.code===200&&res.data.data){
                this.setState({
                    ...res.data.data,
                    status:res.data.data.detailStatus
                },()=>{
                    if(this.state.detailStatus>=3){
                        this.getWrongReason(associatedAnnotationId)
                    }
                })
            }else{
                message.error(res.data.message)
            }
        })
    }
    getWrongReason(associatedAnnotationId){
        getWrongTypeAndLevel(associatedAnnotationId).then((res)=>{
            if(res.data.code===200&&res.data.data){
                this.setState({
                    wrongData:res.data.data
                })
            }else{
                message.error(res.data.message)
            }
        })
    }
    componentDidMount(){
        this.loadData()
    }
    handleErrorModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleNoErr() {
        this.submitWrongRecord({}, false)
    }
    handleModalSubmit = (data) => {
        this.submitWrongRecord(data, true)
    };
    handleClosePage() {
        if (window.opener) {
            window.opener = null;
            window.open('', '_self');
            window.close();
        } else {
            //如果不是新开页打开的 无法关闭
            message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面')
            setTimeout(() => {
                window.location.href = "about:blank";
            }, 1500)
        }
    }
    submitWrongRecord(data, checkError = true) {
        const { status } = this.state
        const { associatedAnnotationId } = this.props.match.params
        if (this.updateOrSubmitCheck === 'submit') {
            let params = {
                checkWrongLog: Object.assign({}, data),
                checkError,
                id:associatedAnnotationId
            }
            inspectorCheck(params, status).then(res => {
                if (res.data.code === 200) {
                    message.success("操作成功,2秒后为您关闭页面");
                    setTimeout(this.handleClosePage, 2000)
                } else {
                    message.error("操作失败");
                }
            });
        } else {
            let params = (checkError) ? { ...data } : new CheckWrongLog();
            changeWrongType(associatedAnnotationId, params).then(res => {
                if (res.data.code === 200) {
                    message.success("操作成功,2秒后为您关闭页面");
                    setTimeout(this.handleClosePage, 2000)
                } else {
                    message.error("操作失败");
                }
            })
        }
    }
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
    render() {
        const state = this.state
        const moduleOrder = [
            <BasicDetail
                records={state.records} title={state.title} url={state.url}
                auctionStatus={state.auctionStatus} key={0}
                reasonForWithdrawal={state.reasonForWithdrawal}></BasicDetail>
        ]
        if (parseInt(state.status) >= 2) {
            moduleOrder.unshift(
                <WrongDetail wrongData={state.wrongData.slice(-1)} key={1} ></WrongDetail>
            )
        }
        return (
            <div className="yc-content-container-newPage assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化检查 /详情']}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {moduleOrder[0]}
                        <ButtonGroup
                            handleClosePage={this.handleClosePage.bind(this)}
                            handleErrorModal={this.handleErrorModal.bind(this)}
                            handleNoErr={this.handleNoErr.bind(this)}
                            role={'notFirstMark-check'} status={state.status}>
                        </ButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        {
                            moduleOrder.length > 0 ?
                                moduleOrder.slice(1) : null
                        }
                        <PropertyDetail enable={true}
                            collateral={state.collateral} buildingArea={state.buildingArea}
                            houseType={state.houseType}></PropertyDetail>
                        <DocumentDetail enable={true}
                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl}
                            ah={state.ah} wsInAttach={state.wsInAttach}>
                        </DocumentDetail>
                        <RoleDetail enable={true} obligors={state.obligors}></RoleDetail>
                    </div>
                </div>
                <CheckModal visible={state.visible}
                    status={state.status}
                    wrongReasons={state.wrongData.slice(-1)}
                    handleModalSubmit={this.handleModalSubmit.bind(this)}
                    handleModalCancel={this.handleModalCancel.bind(this)}
                    style={{ width: 430 }}
                />
            </div>
        )
    }
}
export default withRouter(Check)