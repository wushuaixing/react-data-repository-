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
import {getCheckDetail,getWrongTypeAndLevel} from '@api';
import SpinLoading from "@/components/Spin-loading";
class Other extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            status: 0,
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
        };
        this.isAdmin =localStorage.userState==='管理员';
    }
    handleClosePage() {
        if(window.opener){
            window.opener = null;
            window.open('', '_self');
            window.close();
        }else{
            //如果不是新开页打开的 无法关闭
            message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面。');
            setTimeout(()=>{
                window.location.href = "about:blank";
            },1500)
        }
    }
    componentDidMount(){
        this.loadData()
    }
    loadData(){
        const { associatedAnnotationId } = this.props.match.params;
        this.setState({ loading:true });
        getCheckDetail(associatedAnnotationId).then((res)=>{
            if(res.data.code===200&&res.data.data){
                const { data } = res.data;
                this.setState({
                    ...res.data.data,
                    status:res.data.data.detailStatus,
                    ah: data && data.ah && data.ah instanceof Array && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                    wsUrl: data && data.wsUrl && data.ah instanceof Array && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
                },()=>{
                    if( this.isAdmin && this.state.status!==1){
                        this.getWrongReason(associatedAnnotationId)
                    }
                })
            }else{
                message.error(res.data.message)
            }
        }).finally(()=>this.setState({ loading:false }));
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
    render() {
        const state = this.state;
        const basicDetails = {
            title: state.title,
            url: state.url,
            type:state.type,
            associatedAnnotationId:state.associatedAnnotationId,
            auctionStatus: state.auctionStatus,
            reasonForWithdrawal: state.reasonForWithdrawal,
            records:state.records
        };
        const moduleOrder = [
            <BasicDetail key={0} {...basicDetails}/>
        ];
        if (this.state.wrongData.length>0 &&this.isAdmin ) {
            const wrongData = state.wrongData.filter((item)=>{
                return item.wrongLevel!==3
            });
            moduleOrder.unshift(
                <WrongDetail wrongData={wrongData} key={1} />
            )
        }
        return (
            <div className="yc-content-container-newPage assetStructureDetail-structure">
                <SpinLoading loading={state.loading}>
                    <BreadCrumb texts={['资产结构化 /详情']}/>
                    <div className="assetStructureDetail-structure_container">
                        <div className="assetStructureDetail-structure_container_header">
                            {
                                moduleOrder[0]
                            }
                            <ButtonGroup handleClosePage={this.handleClosePage.bind(this)}/>
                        </div>
                        <div className="assetStructureDetail-structure_container_body">
                            {
                                moduleOrder.length > 0 ?
                                  moduleOrder.slice(1) : null
                            }
                            <PropertyDetail enable={true} collateral={state.collateral} buildingArea={state.buildingArea} houseType={state.houseType}/>
                            <DocumentDetail enable={true}
                                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl}
                                            ah={state.ah} wsInAttach={state.wsInAttach}>
                            </DocumentDetail>
                            <RoleDetail enable={true} obligors={state.obligors}/>
                        </div>
                    </div>
                </SpinLoading>

            </div>
        )
    }
}
export default withRouter(Other)
