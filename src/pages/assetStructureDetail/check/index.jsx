import React from 'react'
import CheckBasicDetail from '@/components/assetStructureDetail/basicDetail'
import CheckButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import { BreadCrumb } from '@commonComponents'
import './index.scss'
import {
    getCheckDetail,inspectorCheck
} from '@api';
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
        status: 1,
        title: "",
        url: "",
        wsFindStatus: 1,
        wsInAttach: 0,
        wsUrl: []
    }
    componentDidMount() {
        const { id } = this.props.match.params
        getCheckDetail(id).then((res) => {
            this.setState({
                ...res.data.data
            },()=>{
                console.log(this.state)
            })
        })
    }
    handleSubmit(){

    }
    handleChange(){

    }
    render() {
        const state = this.state
        const { status, id } = this.props.match.params
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化检查 /详情']}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        <CheckBasicDetail
                            type={state.type} records={state.records}
                            title={state.title} auctionStatus={state.auctionStatus}
                            reasonForWithdrawal={state.reasonForWithdrawal} url={state.url}
                            associatedAnnotationId={state.associatedAnnotationId} wsUrl={state.wsUrl}>
                        </CheckBasicDetail> 
                        <CheckButtonGroup
                            type={state.type} role={'check'}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            status={status}>
                        </CheckButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">

                    </div>
                </div>
            </div>
        )
    }
}

export default Check;