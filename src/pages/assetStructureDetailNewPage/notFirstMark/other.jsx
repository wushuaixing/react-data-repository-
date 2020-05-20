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
import { message } from 'antd'
import { getCheckDetail, structuredById } from '@api'
class Other extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            status: 0,
            wrongData: [],
            records: [],
            title: '',
            reasonForWithdrawal: '',
            auctionStatus: 0,
            url: '',
            collateral: 1,
            buildingArea: null,
            houseType: null,
            wsFindStatus: 0,
            wsUrl: [],
            ah: [],
            wsInAttach: 1,
            obligors: []
        }
    }
    handleClosePage() {
        if (window.opener) {
            window.opener = null;
            window.open('', '_self');
            window.close();
        } else {
            //如果不是新开页打开的 无法关闭
            message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面。')
            setTimeout(() => {
                window.location.href = "about:blank";
            }, 1500)
        }
    }
    get role() {
        return this.props.history.location.pathname.split('/')[2]
    }
    componentDidMount() {
        this.loadData()
    }
    loadData() {
        const { associatedAnnotationId, associatedStatus } = this.props.match.params
        if (this.role === 'admin') {
            getCheckDetail(associatedAnnotationId).then((res) => {
                if (res.data) {
                    this.setState({
                        ...res.data.data,
                        status:this.state.detailStatus
                    },()=>{
                        console.log(this.state)
                    })
                }

            })
        } else {
            structuredById(associatedAnnotationId, associatedStatus).then((res) => {
                if (res.data) {
                    this.setState({
                        ...res.data
                    })
                }
            })
        }
    }
    render() {
        const state = this.state
        const basicDetails = {
            title: state.title,
            url: state.url,
            auctionStatus: state.auctionStatus,
            reasonForWithdrawal: state.reasonForWithdrawal
        }
        basicDetails.records = this.role === 'admin' ? state.records : []
        const moduleOrder = [
            <BasicDetail key={0} {...basicDetails}></BasicDetail>
        ]
        if (parseInt(state.status) >= 2 && this.role === 'admin') {
            moduleOrder.unshift(
                <WrongDetail wrongData={state.wrongData.slice(-1)} key={1} ></WrongDetail>
            )
        }
        return (
            <div className="yc-content-container-newPage assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化 /详情']}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {
                            moduleOrder[0]
                        }
                        <ButtonGroup handleClosePage={this.handleClosePage.bind(this)}></ButtonGroup>
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
            </div>
        )
    }
}
export default withRouter(Other)