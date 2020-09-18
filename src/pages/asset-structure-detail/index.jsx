import React from 'react';
import {message,Button,Modal,Icon} from 'antd';
import SpinLoading from "@/components/Spin-loading";
import BasicInfo from './basicInfo';
import PropertyInfo from './propertyInfo';
import ErrorReason from './errorReason';
import DocumentInfo from './documentInfo';
import ReturnMark from './returnMark';
import RoleInfo from './roleInfo';
import ButtonGroup from './buttonGroup';
import CheckModal from './checkErrorModal';
import {
    getAuctionDetail,
    getNumberOfTags,
    inspectorCheck,
    saveAndGetNext,
    updateBackStatus,
    saveDetail
} from '@api';
import { filters,clone } from '@utils/common';
import './style.scss';
const getObligors = ()=> ({
	birthday: '',
	gender: '0',
	label_type: '1',
	name: '',
	notes: '',
	number: '',
    type: '1',
    system:null
});
class StructureDetail extends React.Component {
    constructor(){
        super();
        this.state = {
            loading:false,
            //基本信息  
            title: "",                 //标题
            auctionStatus: null,       //拍卖状态1:即将开始 3进行中 5已成交 7已流拍 9中止 11撤回
            reasonForWithdrawal: "",   //撤回原因
            associatedAnnotationId: "",//关联标注
            associatedStatus:'',
            records:[],                //结构化/检查记录 

            //房产/土地信息
            buildingArea: null,        //建筑面积
            houseType: 0,              //房产土地类型 0未知 1商用 2住宅 3工业
            collateral: 0,             //抵押情况 1无抵押 0未知

            //文书信息
            wsFindStatus: 0,           //查找情况0未找到文书 1找到文书
            ah: [],                    //相关文书案号
            wsUrl: [],                 //文书链接地址
            wsInAttach: 0,             //详情见资产拍卖附件 文书是否在附件中 1:是 0:否

            obligors: [],              //角色信息
            wrongData: [],             //错误信息
            backRemark:'',             //退回备注
            url: "",                   //链接
            onlyThis: 0,               //仅标记本条,1 true 0 false
            structPersonnelEnable:'',  //结构化人员是否删除 0:删除账号 1:正常账号 2:该条未被结构化
            type:'',                   //数据类型 0普通数据 1相似数据 2已标记拍卖数据
            id:'',
            isUpdateRecord: false,     //判断是否修改了记录 没修改不让保存,
            TOTAL: 0,                  //数据总量,
            MARK: 0,                   //当前标记数
            visible:false
        };
    }
    componentDidMount(){
        const {params}=this.props.match;
        this.getAuctionDetailData(params);
    }
    getAuctionDetailData(params){
        this.setState({loading:true});
        if(params.id){
            getAuctionDetail(params.id).then(result=>{
               const res=result.data;
              if(res.code === 200){
                    const data=res.data;
                    this.setState({
                        id: data.id,
                        title: data.title,
                        auctionStatus: data.auctionStatus,
                        reasonForWithdrawal: data.reasonForWithdrawal,
                        associatedStatus: data.associatedStatus,
                        associatedAnnotationId: data.associatedAnnotationId,
                        records:data.records,
                        buildingArea: data.buildingArea,
                        collateral: data.collateral,
                        houseType: data.houseType,
                        wsFindStatus: data.wsFindStatus,
                        wsInAttach: data.wsInAttach,
                        ah: data && data.ah && data.ah.length === 0 ? [{ value: '' }] : data.ah,
                        wsUrl: data && data.wsUrl && data.wsUrl.length === 0 ? [{ value: '' }] : data.wsUrl,
                        obligors: data && data.obligors && data.obligors.length === 0 && params.status === '0' ? [getObligors()] : data.obligors,
                        wrongData:data.wrongData && data.wrongData.length > 0 ? data.wrongData : [],
                        backRemark:data.backRemark,
                        type:data.type,
                        onlyThis: data.onlyThis,
                        url: data.url,
                        structPersonnelEnable:data.structPersonnelEnable
                    })
              }
            }).finally(()=> this.setState({loading:false}));
        }
    }
    handleChange=(key,value)=>{                 //抵押情况/房产土地类型/建筑面积/文书信息查找情况/仅标记本条改变时
		this.setState({
			[key]: value,
			isUpdateRecord: true,
		});
    }
    handleDocumentChange(combine, value) {      //案号  文书链接地址改变时
		const arr_index = combine.substr(combine.length - 1, 1);
		const key = combine.substr(0, combine.length - 1);
		const arr = [...this.state[key]];
		arr[arr_index].value = value;
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		});
    }
    handleRoleChange(combine, value) {         //角色信息改变时
        const arr_index = combine.substr(combine.length - 1, 1);
        const key = combine.substr(0, combine.length - 1);
        const arr = [...this.state.obligors];
        arr[arr_index][key] = value;
        this.setState({
            obligors: arr,
            isUpdateRecord: true
        })
    }
    handleAddClick(key) {                      //角色信息，文书链接，文书案号增加时
		const arr = (key !== 'obligors') ? [...this.state[key], { value: '' }] : [...this.state[key], { ...getObligors() }];
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		});
    }
    handleDeleteClick(key, index = -1) {      //角色信息，文书链接，文书案号删除时
		const arr = (index >= 0) ? this.state[key].slice(0) : this.state[key].slice(0, -1);
		if (index >= 0) {
			arr.splice(index, 1);
		}
		this.setState({
			[key]: arr,
			isUpdateRecord: true,
		});
    }
    //以上为页面的基本显示


    handleBack(flag){                             
        this.props.history.push(flag?'/index/assetList':'/index'); 
    }
     
    handleConfirm(){                        //检查人员确认按钮
        const { id } = this.props.match.params;
		updateBackStatus({ id }).then((res) => {
			if (res.data.code === 200) {
				message.success('操作成功');
				this.handleBack();
			} else {
				message.error('操作失败');
			}
		});
    }
    
    handleSubmit(){                          //保存
        const role=this.role;
        const {id,status,tabIndex}=this.props.match.params;
        const flag = tabIndex==='5'?1:0;
        // if(isUpdateRecord) return message.warning('当前页面未作修改，请修改后再保存');
        for (let i = 0; i < this.state.obligors.length; i++) {
            let item = this.state.obligors[i];
            if ( item.notes === '') {
                if( item.label_type === '3' ) return message.warning('资产线索备注待完善');
                if( item.label_type === '2' && !/银行|信用联?社|合作联?社/.test(item.name)) return message.warning('债权人备注待完善');
			}
            if ( item.birthday && !/^\d{8}$/.test(item.birthday))  return message.warning('生日格式不正确');
        }
        const keys = ['name', 'birthday', 'notes', 'number'];
        const state = clone(this.state);
        state.obligors = filters.blockEmptyRow(state.obligors, keys);
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
            wsUrl: state.wsUrl,
            status:parseInt(status),
            flag,
        };
        if(role==='check'||(role==='structure'&&parseInt(status)===1)){//检查人员标注和结构化人员修改已标注数据
            saveDetail(id, params).then((res) => {
                console.log(res);
                if (res.data.code === 200) {
                    message.success('保存成功!');
                    this.props.history.push({
                        pathname: '/index',
                    });
                } else {
                    message.error('保存失败!');
                }
            });
        }else{
            saveAndGetNext(id,params).then((res)=>{
                // console.log(res);  //接口报500
            })
        }
    }
    handleNoErr(){
		const { status } = this.props.match.params;
		if (status === '4') {
			Modal.confirm({
				icon: <Icon type="info-circle" theme="filled" style={{ color: '#fa930c' }} />,
				title: '确认将本次错误修改为无误吗？',
				content: '点击确定，本条结构化信息本次错误记录将被删除',
				okText: '确认',
				cancelText: '取消',
				onOk: () => this.submitWrongRecord({}, false),
			});
		} else {
			this.submitWrongRecord({}, false);
		}
    };
	submitWrongRecord(data, checkError = true) {
		const {id,tabIndex} = this.props.match.params;
			const params = {
				checkWrongLog: Object.assign({}, data),
				checkError,
                id,
                flag:0
			};
			if (tabIndex==='6') params.flag = 1;
			inspectorCheck(params).then((res) => {
				if (res.data.code === 200) {
					message.success('操作成功');
					this.handleBack();
				} else {
					message.error('操作失败');
				}
			});
	}
	handleModalCancel(){
		this.setState({
			visible: false,
		});
    };
    handleModalSubmit(data){
        this.submitWrongRecord(data, true);
    }
    get enable() {
        const enable=localStorage.getItem('userState')==='管理员'|| (localStorage.getItem('userState')==='检查人员'&&this.state.structPersonnelEnable===1);
		return enable;
    }
    get updateOrSubmitCheck() {
		const { length } = this.state.records;
		const { desc } = this.state.records[length - 1];
		return (['结构化', '自动标注'].indexOf(desc) >= 0 || length === 0) ? 'submit' : 'update';
	}
    get role(){
        const role=localStorage.getItem('userState')
        if(role==='管理员'){
            return 'admin'
        }else if(role==="检查人员"){
            return 'check';
        }else{
            return 'structure'
        }
    }
    get errReasonVisible(){
        const role=localStorage.getItem('userState')
        const {status}=this.props.match.params;
        if(role!=='结构化人员'||(role==='结构化人员'&&status=="2")){
            return true; 
        }
    }
    render() {
        const {loading,id,title,auctionStatus,reasonForWithdrawal,associatedAnnotationId,associatedStatus,records,url,
              collateral, houseType, buildingArea,
              wsFindStatus,ah,wsUrl,wsInAttach,
              backRemark,
              wrongData,
              obligors,
              onlyThis,type,visible
            }=this.state;
        const { match:{ params:{status,tabIndex} } } = this.props;
        console.log(this.errReasonVisible);
        return (
            <SpinLoading loading={loading}>
                <div className="assetstructure-detail"> 
                    <div className="assetstructure-detail_header">
                        资产结构化/详情
                        {
                            this.role==='admin'&&<Button type="primary" ghost  className='buttonGroup-back' onClick={this.handleBack.bind(this,true)} style={{width:90}}>返回</Button>
                        }
                    </div>
                    <div className="assetstructure-detail_container">
                        {
                            backRemark&&backRemark.length>0&&
                            <ReturnMark
                            backRemark={backRemark}
                            />
                        }
                        {   
                            wrongData&&wrongData.length>0&&this.errReasonVisible&&
                            <ErrorReason
                                wrongData={this.role==='admin'?wrongData:wrongData.slice(0,1)}
                        />
                        }
                        <BasicInfo
                            title={title}
                            auctionStatus={auctionStatus}
                            reasonForWithdrawal={reasonForWithdrawal}
                            associatedAnnotationId={associatedAnnotationId}
                            associatedStatus={associatedStatus}
                            records={records}
                            url={url}
                            id={id}
                        />
                        <PropertyInfo
                            collateral={collateral}
                            houseType={houseType}
                            buildingArea={buildingArea}
                            handleChange={this.handleChange.bind(this)}
                            enable={this.enable}

                        />
                        <DocumentInfo
                            wsFindStatus={wsFindStatus}
                            ah={ah}
                            wsUrl={wsUrl}
                            wsInAttach={wsInAttach}
                            handleChange={this.handleChange.bind(this)}
                            handleDocumentChange={this.handleDocumentChange.bind(this)}
                            enable={this.enable}
                            handleAddClick={this.handleAddClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                        />
                        <RoleInfo
                            obligors={obligors}
                            enable={this.enable}
                            handleChange={this.handleRoleChange.bind(this)}
                            handleAddClick={this.handleAddClick.bind(this)}
                            handleDeleteClick={this.handleDeleteClick.bind(this)}
                        />
                        {
                            this.role !=='admin'&&
                            <ButtonGroup
                                role={this.role}
                                id={id}
                                enable={this.enable}
                                onlyThis={onlyThis}
                                type={type}
                                status={status}
                                tabIndex={tabIndex}
                                handleSubmit={this.handleSubmit.bind(this)}
                                handleChange={this.handleChange}
                                handleConfirm={this.handleConfirm.bind(this)}
                                handleBack={this.handleBack.bind(this)}
                                handleNoErr={this.handleNoErr.bind(this)}
                                handleErrorModal={()=>this.setState({visible:true})}
                                // handleStructureUpdate={this.handleStructureUpdate}
                                
                            />
                        }
                    	<CheckModal
                            visible={visible}
                            returnRemarks={backRemark}
                            wrongReasons={wrongData.slice(0, 1)}
                            handleModalSubmit={this.handleModalSubmit.bind(this)}
                            handleModalCancel={()=>{this.setState({visible:false})}}
                            style={{ width: 430 }}
					    />
                    </div>
                </div>
            </SpinLoading>
        )
    }
}

export default StructureDetail;