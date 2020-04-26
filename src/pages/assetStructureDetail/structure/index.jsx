import React from 'react';
import { BreadCrumb } from '@commonComponents'
import StructureBasicDetail from '@/components/assetStructureDetail/basicDetail'
import StructureButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import StructurePropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import StructureDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import WrongDetail from '@/components/assetStructureDetail/wrongDetail'
import { structuredById } from '@api'
import './index.scss'
class StructureDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            ah: [],
            associatedAnnotationId: "",
            auctionStatus: null,
            buildingArea: 0,
            collateral: 0,
            firstExtractTime: "-",
            houseType: 0,
            id: 3106814,
            obligors: [],
            reasonForWithdrawal: "",
            sign: "",
            title: "",
            type: 0,
            url: "",
            wrongReason: [],
            wsFindStatus: 1,
            wsInAttach: 0,
            wsUrl: []
        }
    }
    handleChange(key, value) {
        this.setState({
            [key]: value
        }, () => {
            console.log(this.state)
        })
    }
    handleDocumentChange(combine,value){
        const arr_index = combine.substr(combine.length-1,1)
        const key = combine.substr(0,combine.length-1)
        const arr = [...this.state[key]]
        arr[arr_index].value = value
        this.setState({
            [key]:arr
        },()=>{
            console.log(this.state)
        })
    }
    handleClick() {

    }
    handleAddClick(key) {
        const arr = [...this.state[key],{value:''}]
        this.setState({
            [key]:arr
        },()=>{
            console.log(this.state)
        });
    }
    handleDeleteClick(key){
        const arr = this.state[key].slice(0,-1)
        this.setState({
            [key]:arr
        },()=>{
            console.log(this.state)
        });
    }
    componentWillMount() {
        const params = this.props.match.params
        structuredById(params.id, params.status).then(res => {
            this.setState({
                ...res.data,
                ah:res.data.ah.length===0?[{value:''}]:res.data.ah,
                wsUrl:res.data.wsUrl.length===0?[{value:''}]:res.data.wsUrl,
            }, () => {
                console.log(this.state)
            })
            
        })
    }
    render() {
        const state = this.state
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb texts={['资产结构化/详情']} note={`1/50`} buttonText={'返回上一条'} icon={'left'}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {/* 传入不同prop 显示不同的基本信息样式 当点击链接需要一个回调函数内写路由跳转逻辑 */}
                        {
                            state.wrongReasons && state.wrongReasons.length > 0 ?
                                <WrongDetail wrongReasons={state.wrongReasons}></WrongDetail> :
                                <StructureBasicDetail
                                    title={state.title} auctionStatus={state.auctionStatus}
                                    reasonForWithdrawal={state.reasonForWithdrawal} url={state.url}
                                    associatedAnnotationId={state.associatedAnnotationId} wsUrl={state.wsUrl}>
                                </StructureBasicDetail>
                        }
                        {/* 传入不同status 显示不同的button样式 返回对应参数值 根据参数值在handleClick里 去请求不同接口 */}
                        <StructureButtonGroup status={1} handleClick={this.handleClick}></StructureButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        {
                            state.wrongReasons && state.wrongReasons.length > 0 ?
                                <StructureBasicDetail
                                    title={state.title} auctionStatus={state.auctionStatus}
                                    reasonForWithdrawal={state.reasonForWithdrawal} url={state.url}
                                    associatedAnnotationId={state.associatedAnnotationId} wsUrl={state.wsUrl}>
                                </StructureBasicDetail> : null
                        }
                        <StructurePropertyDetail
                            collateral={state.collateral} buildingArea={state.buildingArea}
                            houseType={state.houseType} handleChange={this.handleChange.bind(this)}
                        ></StructurePropertyDetail>
                        <StructureDocumentDetail
                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl} ah={state.ah} wsInAttach={state.wsInAttach}
                            handleDocumentChange={this.handleDocumentChange.bind(this)} 
                            handleChange={this.handleChange.bind(this)} 
                            handleAddClick={this.handleAddClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                        ></StructureDocumentDetail>
                        <RoleDetail></RoleDetail>
                    </div>
                </div>
            </div>
        )
    }
}

export default StructureDetail;