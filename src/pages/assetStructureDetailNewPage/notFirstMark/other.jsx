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
import { getCheckDetail, structuredById,getWrongTypeAndLevel } from '@api'
import SpinLoading from "@/components/Spin-loading";

class Other extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false,
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
            message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面。');
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
    loadData() {
        this.setState({loading:true});
        const { associatedAnnotationId, associatedStatus } = this.props.match.params;
        if (this.role === 'admin') {
            getCheckDetail(associatedAnnotationId).then((res) => {
                if (res.data) {
                		const data = res.data.data;
                    this.setState({
                        ...res.data.data,
                        status:res.data.data.detailStatus,
												ah: data && data.ah && data.ah.length === 0 ? [{ value: '' }] : data.ah,
												wsUrl: data && data.wsUrl && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
                    },()=>{
                        if(this.role==='admin'&&this.state.status!==1){
                            this.getWrongReason(associatedAnnotationId)
                        }
                    })
                }

            }).finally(()=>this.setState({ loading:false }))
        } else {
            structuredById(associatedAnnotationId, associatedStatus,1).then(({data}) => {
                if (data) {
                    this.setState({
                        ...data,
                        ah: data && data.ah && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                        wsUrl: data && data.wsUrl && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
                    })

                }
            }).finally(()=>this.setState({ loading:false }))
        }
    }
    render() {
        const state = this.state;
        const basicDetails = {
            title: state.title,
            url: state.url,
            auctionStatus: state.auctionStatus,
            associatedStatus:state.associatedStatus,
            type: state.type,
            associatedAnnotationId:state.associatedAnnotationId,
            reasonForWithdrawal: state.reasonForWithdrawal,
            auctionID:state.id,
            role:this.role
        };
        basicDetails.records = this.role === 'admin' ? state.records : [];
        const moduleOrder = [
            <BasicDetail key={0} {...basicDetails}/>
        ];
        if (this.state.wrongData.length>0 && this.role === 'admin') {
            const wrongData = state.wrongData.filter((item)=>{
                return item.wrongLevel!==3
            });
            moduleOrder.unshift(
                <WrongDetail wrongData={wrongData} key={1} />
            )
        }
        return (
          <SpinLoading loading={state.loading}>
              <div className="yc-content-container-newPage assetStructureDetail-structure">
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
                          <PropertyDetail enable={true}
                                          collateral={state.collateral} buildingArea={state.buildingArea}
                                          houseType={state.houseType} />
                          <DocumentDetail enable
                                          wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl}
                                          ah={state.ah} wsInAttach={state.wsInAttach}>
                          </DocumentDetail>
                          <RoleDetail enable={true} obligors={state.obligors}/>
                      </div>
                  </div>
              </div>
          </SpinLoading>

        )
    }
}
export default withRouter(Other)
