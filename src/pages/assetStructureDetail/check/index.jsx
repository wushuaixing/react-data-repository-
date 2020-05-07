import React from 'react'
import CheckBasicDetail from '@/components/assetStructureDetail/basicDetail'
import CheckButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import CheckPropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import CheckDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'
import './index.scss'
import {
    getCheckDetail, inspectorCheck, changeWrongType
} from '@api';
import CheckModal from "@/components/assetStructureDetail/checkErrorModal";
import { message } from "antd";
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

    }
    componentDidMount() {
        const { id } = this.props.match.params
        if (!sessionStorage.getItem('structPersonnelEnable') && this.props.location.query && this.props.location.query.enable !== undefined) {
            //console.log(this.props.location.query.enable)
            sessionStorage.setItem('structPersonnelEnable', this.props.location.query.enable)
        }
        getCheckDetail(id).then((res) => {
            this.setState({
                ...res.data.data
            }, () => {
                /* console.log(this.state) */
            })
        })
    }
    componentWillUnmount() {
        sessionStorage.removeItem('structPersonnelEnable')
    }
    handleSubmit() {

    }
    handleChange() {

    }

    onClickToTable() {
        this.props.history.push('/index');
    }
    //检查错误弹窗按钮接口
    handleModalSubmit = (data) => {
        const { id } = this.props.match.params
        let params = {
            checkWrongLog: Object.assign({}, data),
            checkError: true,
            id
        }
        inspectorCheck(params).then(res => {
            if (res.data.code === 200) {
                message.success("操作成功");
                this.onClickToTable()
            } else {
                message.error("操作失败");
            }
        });
        /* const { dataId, dataStatus, dataPage, tabStatus } = this.state;
        if (dataStatus === 5 || dataStatus === 4 || dataStatus === 1) {
            let params = {
                checkError: true,
                checkWrongLog: {
                    auctionExtractWrongTypes: data.reason,
                    remark: data.remark,
                    wrongLevel: data.wrongLevel
                },
                id: dataId
            };
            inspectorCheck(params).then(res => {
                if (res.data.code === 200) {
                    this.onClickToTable(dataStatus, dataPage, tabStatus);
                    message.info("操作成功");

                } else {
                    message.error("操作失败");
                }
            });
        }
        else if (dataStatus === 2) {
            let params = {
                auctionExtractWrongTypes: data.reason,
                desc: data.remark,
                level: data.wrongLevel
            };
            changeWrongType(dataId, params).then(res => {
                if (res.data.code === 200) {
                    this.onClickToTable(dataStatus, dataPage, tabStatus);
                    message.info("操作成功");

                } else {
                    message.error(res.data.message);
                }
            });
        }
        if (dataStatus === 3) {
            let params = {
                auctionExtractWrongTypes: data.reason,
                desc: data.remark,
                level: data.wrongLevel
            };
            changeWrongType(dataId, params).then(res => {
                if (res.data.code === 200) {
                    this.onClickToTable(dataStatus, dataPage, tabStatus);
                    message.info("操作成功");
                } else {
                    message.error(res.data.message);
                }
            });
        } */
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
    handleNoErr(){
        const { id } = this.props.match.params
        let params = {
            checkWrongLog: {},
            checkError: false,
            id
        }
        inspectorCheck(params).then(res => {
            if (res.data.code === 200) {
                message.success("操作成功");
                this.onClickToTable()
            } else {
                message.error("操作失败");
            }
        });
    }
    render() {
        const state = this.state
        const { status } = this.props.match.params
        const enable = JSON.parse(sessionStorage.getItem('structPersonnelEnable'))
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
                            role={'check'} enable={enable}
                            handleErrorModal={this.handleErrorModal.bind(this)}
                            type={state.type}
                            handleNoErr={this.handleNoErr.bind(this)}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            status={status}>
                        </CheckButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        <CheckPropertyDetail
                            enable={enable}
                            collateral={state.collateral} buildingArea={state.buildingArea}
                            houseType={state.houseType} handleChange={this.handleChange.bind(this)}
                        ></CheckPropertyDetail>
                        <CheckDocumentDetail
                            enable={enable}
                            wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl} ah={state.ah} wsInAttach={state.wsInAttach}
                            handleDocumentChange={this.handleChange.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            handleAddClick={this.handleChange.bind(this)}
                            handleDeleteClick={this.handleChange.bind(this)}
                        ></CheckDocumentDetail>
                        <RoleDetail
                            obligors={state.obligors}
                            enable={enable}
                            handleChange={this.handleChange.bind(this)}
                            handleAddClick={this.handleChange.bind(this)}
                            handleDeleteClick={this.handleChange.bind(this)}
                        ></RoleDetail>
                    </div>

                </div>
                <CheckModal visible={state.visible}
                    handleModalSubmit={this.handleModalSubmit.bind(this)}
                    handleModalCancel={this.handleModalCancel.bind(this)}
                    style={{ width: 430 }}
                />
            </div>
        )
    }
}

export default Check;