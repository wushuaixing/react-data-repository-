import React from 'react'
import AdminBasicDetail from '@/components/assetStructureDetail/basicDetail'
import AdminButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import AdminPropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import AdminDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import AdminWrongDetail from '@/components/assetStructureDetail/wrongDetail'
import ReturnRemark from '@/components/assetStructureDetail/returnRemark'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'
import {
    getFeedBackRemark, //获取退回备注
    getCheckDetail,//获取检查人员结构化详情信息
    getWrongTypeAndLevel //获取错误原因和类型
} from '@api';
import { message } from "antd";
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
export default class AdminStructure extends React.Component {
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
        returnRemarks: {}
    }
    componentDidMount() {
        const { id, status } = this.props.match.params
        getCheckDetail(id).then((res) => {
            const data = res.data.data
            this.setState({
                ...res.data.data,
                ah: data && data.ah && data.ah instanceof Array && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                wsUrl: data && data.wsUrl && data.ah instanceof Array && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
            }, () => {
            })
        })
        if (parseInt(status)>=2){
            getWrongTypeAndLevel(id).then((res) => {
                const wrongData = res.data.data.filter((item)=>item.wrongLevel!==0)
                this.setState({
                    wrongData
                })
            })
        }
        if (parseInt(status) === 5) {
            getFeedBackRemark(id).then((res) => {
                this.setState({
                    returnRemarks: {
                        ...res.data.data
                    }
                })
            })
        }
    }
    onClickToTable() {
        this.props.history.push('/index/assetList');
    }
    render() {
        const state = this.state
        const { status } = this.props.match.params
        const moduleOrder = [
            <AdminBasicDetail
                key={0} auctionID={state.id}
                associatedAnnotationId={state.associatedAnnotationId}
                type={state.type} records={state.records}
                title={state.title} auctionStatus={state.auctionStatus}
                reasonForWithdrawal={state.reasonForWithdrawal} url={state.url}
                associatedAnnotationId={state.associatedAnnotationId} wsUrl={state.wsUrl}>
                ></AdminBasicDetail>
        ]
        if (state.wrongData&&state.wrongData.length>0) {
            const wrongData = state.wrongData.filter((item)=>{
                return item.wrongLevel!==0
            })
            moduleOrder.unshift(
                <AdminWrongDetail wrongData={wrongData} key={1} role={'admin'}></AdminWrongDetail>
            )
        }
        if (parseInt(status) === 5) {
            moduleOrder.unshift(
                <ReturnRemark key={2} notes={''}></ReturnRemark>
            )
        }
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化 /详情']}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {moduleOrder[0]}
                        <AdminButtonGroup
                            role={'admin'}
                            handleBack={this.onClickToTable.bind(this)}>
                        </AdminButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        {
                            moduleOrder.length > 0 ?
                                moduleOrder.slice(1) : null
                        }
                        <AdminPropertyDetail
                            enable={true} houseType={state.houseType}
                            collateral={state.collateral} buildingArea={state.buildingArea}
                        ></AdminPropertyDetail>
                        <AdminDocumentDetail
                            enable={true}
                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl} 
                            ah={state.ah} wsInAttach={state.wsInAttach}
                        ></AdminDocumentDetail>
                        <RoleDetail
                            obligors={state.obligors}
                            enable={true}
                        ></RoleDetail>
                    </div>
                </div>
            </div>
        )
    }
}