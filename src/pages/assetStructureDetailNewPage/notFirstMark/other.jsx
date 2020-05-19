// 管理员和资产结构化人员共用此页面
import React from 'react'
import { withRouter } from 'react-router-dom'
import BasicDetail from '@/components/assetStructureDetail/basicDetail'
import ButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import PropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import DocumentDetail from '@/components/assetStructureDetail/documentDetail'
import WrongDetail from '@/components/assetStructureDetail/wrongDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'
class Other extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            records: [{ desc: "结构化", error: false, errorLevel: 0, time: "2020-05-19 10:55:20", user: "邵颖结构化" }],
            title: '测试111',
            reasonForWithdrawal: '测试撤回原因',
            auctionStatus: 9,
            url: 'http://www.baidu.com',
            collateral: 1,
            buildingArea: 1.3,
            houseType: 1,
            wsFindStatus:1,
            wsUrl:[{value:'测试文书1'}],
            ah:[{value:'测试案号1'},{value:'测试案号2'}],
            wsInAttach:1,
            obligors:[{birthday: 0, gender: "0", labelType: "2", name: "中国建设银行", notes: "", number: "", type: "4"}]
        }
    }
    render() {
        const state = this.state
        return (
            <div className="yc-content-container-newPage assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化 /详情']}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        <BasicDetail
                            records={state.records} title={state.title} url={state.url}
                            auctionStatus={state.auctionStatus}
                            reasonForWithdrawal={state.reasonForWithdrawal}></BasicDetail>
                        <ButtonGroup></ButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
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
            </div>
        )
    }
}
export default withRouter(Other)