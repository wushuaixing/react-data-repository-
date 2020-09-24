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
import BreadCrumb from '@/components/common/breadCrumb'
import icon from '@/assets/img/backPrevious.png'
import iconGrey from '@/assets/img/backPrevious-grey.png'
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
            isBack:false,              //是否为退回数据
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
        this.getAuctionDetailData(this.props);
    }
    getAuctionDetailData(props){
        const params = props.match.params;
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
                        structPersonnelEnable:data.structPersonnelEnable,
                        isBack:data.isBack
                    },()=>{
                        document.title=data.title
                        const oldData=JSON.stringify(this.state);
                        sessionStorage.setItem('oldData',oldData)
                    })
              }
            }).finally(()=> this.setState({loading:false}));
            if(this.getRole()==='structure'){
                getNumberOfTags().then(res => {
                    this.setState({
                        ...res.data.data
                    })
                })
            }
        }else{
            message.error('请求参数错误,请刷新页面或回到上一级')
        }
    }
    handleChange=(key,value)=>{             //抵押情况/房产土地类型/建筑面积/文书信息查找情况/仅标记本条改变时
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
        const isdetailNewpage=window.location.href.includes('defaultDetail');
        isdetailNewpage?this.handleClosePage():this.props.history.push(flag?'/index/assetList':'/index'); 
    }
     
    handleConfirm(){                        //检查人员确认按钮
        const { id } = this.props.match.params;
		updateBackStatus({ id }).then((res) => {
			if (res.data.code === 200) {
                message.success('操作成功');
                localStorage.setItem('tonewdetail',Math.random())
				this.handleBack();
			} else {
				message.error('操作失败');
			}
		});
    }
    isUpdateRecord(){
        const OldData=JSON.parse(sessionStorage.getItem("oldData"));    //取页面刚进入时的数据
        const {buildingArea,houseType,collateral,wsFindStatus,wsInAttach,onlyThis,ah,wsUrl,obligors}=OldData;
        //基本数据类型
        const Changeparams={buildingArea,houseType,collateral,wsFindStatus,wsInAttach,onlyThis};
        const changeParamskey=Object.getOwnPropertyNames(Changeparams);//取对象的key
        for(let i=0;i<changeParamskey.length;i++){
           let item=changeParamskey[i];
           if(this.state[item]!==Changeparams[item]){    //仅标记本条 抵押情况 房产土地类型 建筑面积 查找情况 详情见拍卖附件  发生改变时
               return true;
           }
        }
        //引用数据类型
        const arrparams={ah,wsUrl,obligors};//引用数据类型的数据   文书链接 文案号 角色信息
        const arrparamskey=Object.getOwnPropertyNames(arrparams);//取对象的key
        for(let i=0;i<arrparamskey.length;i++){
            let item=arrparamskey[i];
            let arrItem=arrparams[item];
            let stateItem=this.state[item];
            if(item==='obligors'){
                stateItem = filters.blockEmptyRow(stateItem, ['name', 'birthday', 'notes', 'number']);//去空行
                arrItem=filters.blockEmptyRow(arrItem, ['name', 'birthday', 'notes', 'number']);
            }else {
                stateItem= filters.blockEmptyRow(stateItem, ['value']);//去空行
                arrItem= filters.blockEmptyRow(arrItem, ['value']);
            }
            if(stateItem.length!==arrItem.length){    //判断是否增加删除数据
                return true
            }
            for(let j=0;j<arrItem.length;j++){
                let arrItemKey=Object.getOwnPropertyNames(arrItem[j]);
                for(let k=0;k<arrItemKey.length;k++){
                    let item=arrItemKey[k];
                    if(arrItem[j][item]!==stateItem[j][item]){    //判断 案号 文书链接 角色信息发生改变
                        return true;
                    }
                }
            }
         }
    }
    handleSubmit(){                          //保存
        const role=this.getRole();
        const isdetailNewpage=window.location.href.includes('defaultDetail');
        const {id,status}=this.props.match.params;
        const flag = this.state.isBack?1:0;
        if(!this.isUpdateRecord()) return message.warning('当前页面未作修改，请修改后再保存');
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
                if (res.data.code === 200) {
                    message.success('保存成功!',1);
                    sessionStorage.setItem('id', id);
                    sessionStorage.removeItem('backTime');
                    localStorage.setItem('tonewdetail',Math.random())
                    isdetailNewpage ? setTimeout(this.handleClosePage, 1000) : this.props.history.push({pathname: '/index',});
                } else {
                    message.error('保存失败!');
                }
            });
        }else{
            saveAndGetNext(id,params).then((res)=>{
                const toIndex = () => this.props.history.push('/index');
                const toNext = (_status,id)=> {
                    this.setState({ isUpdateRecord: false },() => {
                       localStorage.setItem('tonewdetail',Math.random())
                       this.props.history.push({ pathname: isdetailNewpage ? `/defaultDetail/${_status}/${id}`: `/index/structureDetail/${_status}/${id}`})
                    })
                };
                if(res.data.code===200){
                    const {data}=res.data;
                    if(data>0){
                        sessionStorage.setItem('id', id);
                        message.success('保存成功!');
                        toNext(status,data);
                    }else if(data===-1){
                        message.error('有待修改数据，暂时无法获取新数据', 2,toIndex);
                    }else{
                        message.success('已修改完全部数据，2s后回到待标记列表',2,toIndex);
                    }
                }else{
                    message.error(res.data.message)
                }
            })
        }

    }
    handleNoErr(){                             //确认无误
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
	submitWrongRecord(data, checkError = true) {     //修改错误原因  检查有误  检查无误
        const {id} = this.props.match.params;
        const role=this.getRole();
		const params = {
				checkWrongLog: Object.assign({}, data),
				checkError,
                id,
                flag:0
            };
			if (this.state.isBack) params.flag = 1;
			inspectorCheck(params).then((res) => {
				if (res.data.code === 200) {
                    if(role==='newpage-check'||role==='newpage-other'){
                        message.success('操作成功,2秒后为您关闭页面');
                        localStorage.setItem('tonewdetail',Math.random())
                        setTimeout(this.handleClosePage, 2000);
                    }else{
                        message.success('操作成功');
                        localStorage.setItem('tonewdetail',Math.random())
                        this.handleBack();
                    }
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
	handleClosePage = () =>{
		if (window.opener) {
			window.opener = null;
			window.open('', '_self');
			window.close();
		} else {
			message.warning('由于浏览器限制,无法自动关闭,将为您导航到空白页,请您手动关闭页面');
			setTimeout(() => {
				window.location.href = 'about:blank';
			}, 1500);
		}
    };
    goPreviousRecord() {
        const isdetailNewpage=window.location.href.includes('defaultDetail');
        if (sessionStorage.getItem('id')) {
            const toStatus = sessionStorage.getItem("backTime") === "1" ? 0 : 1;
            const path = {
                pathname: isdetailNewpage ? `/defaultDetail/${toStatus}/${sessionStorage.getItem('id')}`:`/index/structureDetail/${toStatus}/${sessionStorage.getItem('id')}`
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
    getRole(){ 
        const role=localStorage.getItem('userState');
        const path=window.location.href;
        if(path.includes('notFirstMark')||path.includes('autoMark')){
            if(role==='检查人员'){
                return 'newpage-check'
            }else{
                return 'newpage-other'
            }
        }
        if(role==='管理员'){
            return 'admin'
        }else if(role==="检查人员"){
            return 'check';
        }else{
            return 'structure'
        }
    }
    get enable() {
        return localStorage.getItem('userState')==='管理员'|| (localStorage.getItem('userState')==='检查人员'&&this.state.structPersonnelEnable===1);
    }
    getErrReasonVisible(){
        const role=this.getRole();
        const {status}=this.props.match.params;
        if((role==='structure'&&status==="2")||(role==='check'&&parseInt(status)>3)||(role==="newpage-check"&&parseInt(status)>2)||((role==='admin'||role==='newpage-other')&&parseInt(status)>2)){
            return true; 
        }
    }
    get wrongData(){
        if(this.getRole()==='admin'){
            return this.state.wrongData.filter((item)=>{
                return item.wrongLevel!==3
            });
        }else{
            return this.state.wrongData.slice(0, 1)
        }
    }
    async UNSAFE_componentWillReceiveProps(newProps) {
        this.getAuctionDetailData(newProps)

    }
    componentWillUnmount() {
        sessionStorage.clear()
    }
    render() {
        const {loading,id,title,auctionStatus,reasonForWithdrawal,associatedAnnotationId,associatedStatus,records,url,
              collateral, houseType, buildingArea,
              wsFindStatus,ah,wsUrl,wsInAttach,
              backRemark,
              obligors,
              onlyThis,type,visible,isBack
            }=this.state;
            console.log(this.props)
        const { match:{ params:{status} } } = this.props;
        const wrongData=this.wrongData;
        const preId = sessionStorage.getItem('id');
        const tag = `${this.state.MARK}/${this.state.TOTAL}`;
        return (
            <SpinLoading loading={loading}>
                <div className="assetstructure-detail"> 
                   {
                       this.getRole()==='structure'&&parseInt(status)===0?    
                       <BreadCrumb
                            disabled={!preId}
                            texts={['资产结构化/详情']} note={tag}
                            handleClick={this.goPreviousRecord.bind(this)}
                            icon={preId ? icon : iconGrey}/>:
                            <div className="assetstructure-detail_header">
                                资产结构化/详情
                                    {
                                        this.getRole()==='admin'&&<Button type="primary" ghost  className='buttonGroup-back' onClick={this.handleBack.bind(this,true)} style={{width:90}}>返回</Button>
                                    }
                            </div>
                   } 
                    <div className="assetstructure-detail_container">
                        {
                            backRemark&&backRemark.length>0&&isBack&&
                            <ReturnMark
                            backRemark={backRemark}
                            />
                        }
                        {   
                            wrongData&&wrongData.length>0&&this.getErrReasonVisible()&&
                            <ErrorReason
                                wrongData={wrongData}
                                role={this.getRole()}
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
                            status={status}
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
                            key={id}
                        />
                        {
                            this.getRole() !=='admin'&&
                            <ButtonGroup
                                role={this.getRole()}
                                id={id}
                                enable={this.enable}
                                onlyThis={onlyThis}
                                type={type}
                                isBack={isBack}
                                status={parseInt(status)}
                                associatedStatus={associatedStatus}
                                handleSubmit={this.handleSubmit.bind(this)}
                                handleChange={this.handleChange}
                                handleConfirm={this.handleConfirm.bind(this)}
                                handleBack={this.handleBack.bind(this)}
                                handleNoErr={this.handleNoErr.bind(this)}
                                handleErrorModal={()=>this.setState({visible:true})}
                                handleClosePage={this.handleClosePage.bind(this)}
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