import React from 'react';
import { withRouter } from 'react-router-dom';
import BreadCrumb from '@/components/common/breadCrumb'
import StructureBasicDetail from '@/components/assetStructureDetail/basicDetail'
import StructureButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import StructurePropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import StructureDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import WrongDetail from '@/components/assetStructureDetail/wrongDetail'
import { structuredById, getNumberOfTags, saveDetail } from '@api'
import { filters,clone } from '@utils/common'
import './index.scss'
import { message,Modal } from 'antd';
import icon from '@/assets/img/backPrevious.png'
import iconGrey from '@/assets/img/backPrevious-grey.png'
const { error } = Modal;

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
class StructureDetail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ah: [],
            associatedAnnotationId: "",
            auctionStatus: null,
            buildingArea: null,
            collateral: 0,
            firstExtractTime: "-",
            houseType: 0,
            obligors: [],
            reasonForWithdrawal: "",
            sign: "",
            title: "",
            type: null,
            url: "",
            wsFindStatus: 1,
            wsInAttach: 0,
            wsUrl: [],
            preId: '', //保留上一条ID
            onlyThis: 0, //仅标记本条,
            TOTAL: 0,  //数据总量,
            MARK: 0,  //当前标记数
            wrongData: [],
            isSendRequest: false, //是否已经发送了请求
            isUpdateRecord: false //判断是否修改了记录 没修改不让保存
        }
    }
    handleChange(key, value) {
        this.setState({
            [key]: value,
            isUpdateRecord: true
        }, () => {
            //console.log(this.state)
        })
    }
    handleDocumentChange(combine, value) {
        const arr_index = combine.substr(combine.length - 1, 1);
        const key = combine.substr(0, combine.length - 1);
        const arr = [...this.state[key]];
        arr[arr_index].value = value;
        this.setState({
            [key]: arr,
            isUpdateRecord: true
        }, () => {
            console.log(this.state)
        })
    }
    handleRoleChange(combine, value) {
        const arr_index = combine.substr(combine.length - 1, 1);
        const key = combine.substr(0, combine.length - 1);
        const arr = [...this.state.obligors];
        arr[arr_index][key] = value;
        this.setState({
            obligors: arr,
            isUpdateRecord: true
        }, () => {
            //console.log(this.state)
        })
    }
    handleSubmit() {
        this.saveRecordData()
    }
    handleAddClick(key) {
        const arr = (key !== 'obligors') ? [...this.state[key], { value: '' }] : [...this.state[key], { ...getObligor() }];
        this.setState({
            [key]: arr,
            isUpdateRecord: true
        }, () => {
            //console.log(this.state)
        });
    }
    handleDeleteClick(key, index = -1) {
        console.log(key, index);
        //角色对应顺序删除  文书从下往上删
        const arr = (index >= 0) ? this.state[key].slice(0) : this.state[key].slice(0, -1);
        if (index >= 0) {
            arr.splice(index, 1)
        }
        this.setState({
            [key]: arr,
            isUpdateRecord: true
        }, () => {
            //console.log(this.state)
        });
    }
    componentDidMount() {
        this.getRecordData(this.props)
    }
    async componentWillReceiveProps(newProps) {
        if (this.props.history.location.query && this.props.history.location.query.id) {
            sessionStorage.setItem('id', this.props.history.location.query.id)
        }
        this.getRecordData(newProps)
    }
    componentWillUnmount() {
        sessionStorage.clear()
    }
    saveRecordData() {
        /* 资产标注详情页存在名称里不含“银行”、“信用社”、“信用联社”且备注为空的债权人时，点击保存，
        保存无效并弹出“债权人备注待完善”非模态框提示； */
        const { id, status } = this.props.match.params;
        console.log(this.state.isUpdateRecord);
        if (!this.state.isUpdateRecord && status !== '0') {
            message.warning('当前页面未作修改，请修改后再保存');
            return false;
        }
        for (let i = 0; i < this.state.obligors.length; i++) {
            let name = this.state.obligors[i].name;
            if (this.state.obligors[i].notes === '' && this.state.obligors[i].labelType === '2'
              && name.indexOf('银行') < 0 && name.indexOf('信用社') < 0 && name.indexOf('信用联社') < 0) {
                message.warning('债权人备注待完善');
                return false;
            }
            if (this.state.obligors[i].notes === '' && this.state.obligors[i].labelType === '3') {
                message.warning('资产线索备注待完善');
                return false;
            }
            if (this.state.obligors[i].birthday && !/^\d{8}$/.test(this.state.obligors[i].birthday)) {
                message.warning('生日格式不正确');
                return false;
            }
        }
        /* 资产标注详情页存在备注为空的资产线索时，点击保存，保存无效并弹出“资产线索备注待完善”非模态框提示 */
        //去空行
        const keys = ['name', 'birthday', 'notes', 'number'];
        const state = clone(this.state);
        state.obligors = filters.blockEmptyRow(state.obligors, keys);
        // 如果是未找到文书 去掉文书链接 相关文书案号 见附件详情
        if (state.wsFindStatus === 0) {
            state.wsUrl = [];
            state.wsInAttach = 0;
            state.ah = []
        } else {
            state.ah = filters.blockEmptyRow(this.state.ah, ['value']);
            state.wsUrl = filters.blockEmptyRow(this.state.wsUrl, ['value'])
        }
        const params = {
            ah: state.ah,
            buildingArea: state.buildingArea,
            collateral: state.collateral,
            houseType: state.houseType,
            obligors: state.obligors,
            onlyThis: state.onlyThis,
            wsFindStatus: state.wsFindStatus,
            wsInAttach: state.wsInAttach,
            wsUrl: state.wsUrl
        };
        this.setState({
            isSendRequest: true
        });
        saveDetail(id, status, params).then((res) => {
            this.setState({
                isSendRequest: false
            });
            if (res.data.code === 200 && res.data.data.sign !== '1') {
                message.success('保存成功!');
                //如果是待标记或待修改并且有新id 跳转新路径 否则跳回table
                if ((status === '0' || status === '2') && res.data.data.id !== 0) {
                    sessionStorage.setItem('id', id);
                    this.setState({isUpdateRecord:false});
                    this.props.history.push({
                        pathname: `/index/structureDetail/${status}/${res.data.data.id}`
                    })
                }
                //在已标记页面下保存 有两种可能
                else if (status === '1') {
                    //如果是从已标记未检查跳来直接回table 否则继续下一条标记数据
                    let nextMarkid = sessionStorage.getItem('id');
                    if (nextMarkid) {
                        sessionStorage.setItem('id', id);
                        sessionStorage.removeItem('backTime');
                        this.props.history.push({
                            pathname: `/index/structureDetail/0/${nextMarkid}`
                        })
                    } else {
                        this.props.history.push('/index')
                    }
                }
                else {
                    this.props.history.push('/index')
                }
            }
            else if (res.data.data.sign === '1') {
                error({
                    content: '保存失败,数据已被自动标注,为您跳转至下一条',
                    onOk: () => {
                        this.props.history.push({
                            pathname: `/index/structureDetail/${status}/${res.data.data.id}`
                        })
                    },
                    okText: '我知道了'
                });
            }
            else {
                message.error('保存失败!')
            }
        })
    }
    async getRecordData(props) {
        const params = props.match.params;
        if (params.id && params.status) {
            structuredById(params.id, params.status,0).then(res => {
                for (let i = 0; i < res.data.obligors; i++) {
                    if (res.data.obligors[i].labelType === '4') {
                        //债务人和起诉人对应转换
                        res.data.obligors[i].labelType = '2'
                    }
                }
                const data = res.data;
                this.setState({
                    associatedStatus: data.associatedStatus,
                    id: data.id,
                    associatedAnnotationId: data.associatedAnnotationId,
                    auctionStatus: data.auctionStatus,
                    buildingArea: data.buildingArea,
                    collateral: data.collateral,
                    firstExtractTime: data.firstExtractTime,
                    houseType: data.houseType,
                    reasonForWithdrawal: data.reasonForWithdrawal,
                    sign: data.sign,
                    type: data.type,
                    title: data.title,
                    url: data.url,
                    wrongData: data.wrongData,
                    wsFindStatus: data.wsFindStatus,
                    wsInAttach: data.wsInAttach,
                    ah: data && data.ah && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                    wsUrl: data && data.wsUrl && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
                    obligors: data && data.obligors && data.obligors.length === 0 && params.status === '0' ? [getObligor()] : data.obligors
                }, () => {
                    console.log(this.state)
                })

            });
            getNumberOfTags().then(res => {
                this.setState({
                    ...res.data.data
                }, () => {
                    //console.log(this.state)
                })
            })
        } else {
            message.error('请求参数错误,请刷新页面或回到上一级')
        }
    }
    goPreviousRecord() {
        if (sessionStorage.getItem('id')) {
            const toStatus = sessionStorage.getItem("backTime") === "1" ? 0 : 1;
            const path = {
                pathname: `/index/structureDetail/${toStatus}/${sessionStorage.getItem('id')}`
            };
            sessionStorage.setItem('id', this.props.match.params.id);
            sessionStorage.getItem("backTime") === "1" ? sessionStorage.removeItem('backTime') : sessionStorage.setItem('backTime', 1); //返回次数 默认只能返回一层
            this.setState({
                isUpdateRecord:false
            },()=>{
                this.props.history.push(path)
            })
        }
        else {
            message.error('无法跳转')
        }
    }
    render() {
        const state = this.state;
        const { status, id } = this.props.match.params;
        const preId = sessionStorage.getItem('id');
        const tag = `${state.MARK}/${state.TOTAL}`;
        const moduleOrder = [
            <StructureBasicDetail
                associatedAnnotationId={state.associatedAnnotationId}
                associatedStatus={state.associatedStatus}
                auctionID={state.id}
                type={state.type}
                title={state.title} auctionStatus={state.auctionStatus}
                reasonForWithdrawal={state.reasonForWithdrawal} url={state.url} wsUrl={state.wsUrl}>
            </StructureBasicDetail>
        ];
        if (parseInt(status) === 2) {
            moduleOrder.unshift(<WrongDetail wrongData={state.wrongData.slice(-1)} role={'structure'}/>)
        }
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb
                  disabled={!preId}
                  texts={['资产结构化/详情']} note={tag}
                  handleClick={this.goPreviousRecord.bind(this)}
                  icon={preId ? icon : iconGrey}/>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {/* 传入不同prop 显示不同的基本信息样式 当点击链接需要一个回调函数内写路由跳转逻辑 */}
                        { moduleOrder[0] }
                        {/* 传入不同status 显示不同的button样式 返回对应参数值 根据参数值在handleClick里 去请求不同接口 */}
                        <StructureButtonGroup
                            type={state.type} role={'structure'} id={id}
                            handleSubmit={this.handleSubmit.bind(this)}
                            handleChange={this.handleChange.bind(this)}
                            isSendRequest={state.isSendRequest}
                            status={status}>
                        </StructureButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        {
                            moduleOrder.length > 1 ?
                                moduleOrder[1] : null
                        }
                        <StructurePropertyDetail
                          collateral={state.collateral} buildingArea={state.buildingArea}
                          houseType={state.houseType} handleChange={this.handleChange.bind(this)}
                        />
                        <StructureDocumentDetail
                          wsFindStatus={state.wsFindStatus} wsUrl={state.wsUrl} ah={state.ah} wsInAttach={state.wsInAttach}
                          handleDocumentChange={this.handleDocumentChange.bind(this)}
                          handleChange={this.handleChange.bind(this)}
                          handleAddClick={this.handleAddClick.bind(this)}
                          handleDeleteClick={this.handleDeleteClick.bind(this)}
                        />
                        <RoleDetail
                          obligors={state.obligors}
                          handleChange={this.handleRoleChange.bind(this)}
                          handleAddClick={this.handleAddClick.bind(this)}
                          handleDeleteClick={this.handleDeleteClick.bind(this)}
                          />
                    </div>
                </div>
            </div>
        )
    }
}
export default withRouter(StructureDetail);
