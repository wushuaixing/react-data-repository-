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
            visible: false,
            records: [{ desc: "结构化", error: false, errorLevel: 0, time: "2020-05-19 10:55:20", user: "邵颖结构化" }],
            title: '测试111',
            reasonForWithdrawal: '测试撤回原因',
            auctionStatus: 9,
            url: 'http://www.baidu.com',
            collateral: 1,
            buildingArea: 1.3,
            houseType: 1,
            wsFindStatus: 1,
            wsUrl: [{ value: '测试文书1' }],
            ah: [{ value: '测试案号1' }, { value: '测试案号2' }],
            wsInAttach: 1,
            obligors: [{ birthday: 0, gender: "0", labelType: "2", name: "中国建设银行", notes: "", number: "", type: "4" }],
            wrongData: [],
            returnRemarks: '',
            status: 0 //测试状态  0 未检查 1 检查无误 2 检查错误 3 已修改
        }
    }
    get updateOrSubmitCheck() {
        const length = this.state.records.length
        return (this.state.records[length - 1].desc === '结构化') ? 'submit' : 'update'
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const { associatedAnnotationId } = this.props.match.params
        getCheckDetail(associatedAnnotationId).then((res)=>{
            if(res.data.code===200){
                this.setState({
                    ...res.data.data
                })
            }else{
                message.error(res.data.message)
            }
        })
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
        const { id, status } = this.state
        if (this.updateOrSubmitCheck === 'submit') {
            let params = {
                checkWrongLog: Object.assign({}, data),
                checkError,
                id
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
            changeWrongType(id, params).then(res => {
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
                auctionID={state.id}
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
                    returnRemarks={state.returnRemarks}
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