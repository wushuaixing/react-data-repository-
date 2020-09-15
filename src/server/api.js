import axios from './index';
//////////////////
//用户登录有关接口//
//////////////////
//登录（账号-密码-下次是否自动登录）
export const login = async (params) => {
	//let data = JSON.stringify(params);
	return axios.post('/api/login', params);
};

//判断是否登录过
export const isLogin = (params) => {
	let data = JSON.stringify(params);
	return axios.get("/api/isLogin", data);
};

//退出登录
export const logout=()=> {
	return axios.get('/api/logout');
};

//获取图形验证码
export const codeImage=()=> {
    return axios.get('/api/code/image');
};

//验证图形验证码
export const validSmsCode=(params)=> {
    return axios.post('/api/validSmsCode',params)
};
//验证图形验证码
export const validateImgCode=(params)=> {
    return axios.post('/api/validImageCode',params)
};
//获取图形验证码
export const getSmsCode=(params)=> {
    return axios.post('/api/getSmsCode?username='+params.username)
};

//重置密码
export const resetPassword=(params)=> {
    return axios.post('/api/resetPassword', params);
};

//修改密码
export const changePassword=(params)=> {
	return axios.post('/api/changePassword', params);
};

//获取可用侧边栏
export const getAvailableNav= async ()=> {
	// return axios.get('/api/common/getAvailableNav');
	return axios.get('/api/common/getAvailableNav');
};
//////////////////////
//管理员-账号管理-接口//
/////////////////////
//查看（正常和已删除）结构化账号列表
export const userView=(params)=> {
    let urlPlus = "";
    for (let key in params) {
        urlPlus = urlPlus + key + "=" + params[key] + "&";
    }
    urlPlus = urlPlus.substring(0, urlPlus.length - 1);
    return axios.get('/api/asset/admin/userView?'+ urlPlus);
};

//开设账号
export const userCreate=(user)=> {
	return axios.post("/api/asset/admin/userCreate", user);
};

//编辑账号
export const userEdit=(id, user)=> {
	return axios.post("/api/asset/admin/" + id + "/userEdit", user);
};

//重置密码
export const userReset=(id)=> {
	return axios.post("/api/asset/admin/" + id + "/userReset");
};

//账号删除(针对正常账号)
export const userRemove=(id)=> {
	return axios.post("/api/asset/admin/" + id + "/userRemove");
};

//账号移除(针对已删除账号)
export const userDelete=(id)=> {
	return axios.post("/api/asset/admin/" + id + "/userDelete");
};

//检查账号列表查询
export const getCheckListCheck=(params)=> {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/admin/check/getCheckList?" + urlPlus);
};

//检查账号添加
export const userCreateCheck=(user)=> {
	return axios.post("/api/asset/admin/check/userCreate", user);
};

//检查账号编辑
export const userEditCheck=(id, user)=> {
	let params = {
		mobile: user.mobile,
		name: user.name
	};
	return axios.post("/api/asset/admin/check/userEdit/" + id, params);
};

//重置检查账号密码
export const userResetCheck=(id)=> {
	return axios.get("/api/asset/admin/check/userReset/" + id);
};

//删除检查账号
export const userRemoveCheck=(id)=> {
	return axios.get("/api/asset/admin/check/userRemove/" + id);
};

//////////////////////////////
//管理员-资产结构化接口//
/////////////////////////////
//管理员资产结构化列表-
export const adminStructuredList=(params)=> {
	return axios.post("/api/asset/admin/structured/structuredList",params);
};
//检查人员列表(仅管理员)
export const getCheckPersonnel=(params)=> {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/inspector/control/getCheckPersonnel?" + urlPlus);
};
//////////////////////////////
//结构化人员-资产结构化数据接口//
/////////////////////////////
//资产结构化列表
export const structuredList=(params)=> {
	return axios.post("/api/asset/structured/control/structuredList",params);
};

//源链接提取页
export function htmlDetailInfo(id) {
	return axios.get("/api/asset/auction/" + id + "/htmlDetailInfo");
}

//获取检察人员结构化列表详情
export const getCheckDetail=(id)=> {
	return axios.get("/api/asset/inspector/control/getCheckDetail/" + id);
};

//资产结构化列表
export const structuredObligorTypeList=()=> {
	return axios.get("/api/common/structuredObligorTypeList");
};

//已标记数/总数
export const getNumberOfTags=()=> {
	return axios.get("/api/asset/structured/control/getNumberOfTags");
};
//获取新数据 id
export const getNewStructureData=()=> {
	return axios.get("/api/asset/structured/control/getNewStructuredDataId")
};
//////////////////////////////
//检查人员-资产结构化检查接口//
/////////////////////////////
//获取检查人员结构化列表
export const getCheckList=(params)=> {
	return axios.post("/api/asset/inspector/control/getCheckList",params);
};

//结构化人员列表
export const getStructuredPersonnel=(name)=> {
	return axios.get("/api/asset/inspector/control/getStructuredPersonnel", name);
};


//结构化确认
export const beConfirmed=(id)=> {
	return axios.get("/api/asset/inspector/control/beConfirmed/" + id);
};

export const updateBackStatus=(params)=> {
	return axios.get("/api/asset/inspector/control/updateBackStatus",{params});
};

//修改错误原因
export const changeWrongType=(id,params)=> {
	return axios.post("/api/asset/inspector/control/updateErrorReason/"+id,params);
};

//检查确认
export const inspectorCheck=(params,status)=> {
	return axios.post("/api/asset/inspector/control/inspectorCheck/"+status, params);
};

//已删除&自动标注的检查保存
export const notEnableSave=(id, params)=> {
	return axios.post(
		"/api/asset/inspector/control/" + id + "/@", params
	);
};
////////////
//文书搜索//
//////////
//文书搜索
export const wenshuSearch=(params)=> {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);

	return axios.get("/api/asset/wenshu/search?" + urlPlus);
};

//文书搜索详情
export const wenshuDetail=(id,params,wid)=> {
	return axios.post("/api/asset/structured/control/wenshu/detail/" + id+'/'+wid,params);
};
////////////////////
//数据抓取与同步监控//
///////////////////
//数据源分布
export const dataSourceData=()=> {
	return axios.get("/api/statistical/assetDataCrawlingDetails");
};

//源网站增量与数据抓取量，差值
export const detailsByDate=(type,dataSourceType)=> {
	return axios.get("/api/statistical/assetDataCrawlingDetailsByDate?type="+ type +"&dataSourceType=" +dataSourceType);
};

//SQL同步情况
export const sqlMonitorText=()=> {
	return axios.get("/api/statistical/assetDataSQLSynchronmentDetails4TextVO");
};

export const sqlMonitorChart=(type)=> {
	return axios.get("/api/statistical/assetDataSQLSynchronmentDetails4PicVO?method="+type);
};

//规则监控
export const ruleMonitor=()=> {
	return axios.get("/api/statistical/assetDataRuleStateDetails");
};
////////////////////
//结构化情况监控/////
///////////////////
//每日资产数据新增与标记
export const addedAndStructured=(type)=> {
	return axios.get("/api/statistical/assetDataIncrementAndSignDetails?type="+type);
};

//昨日新增与标记
export const newAndStruc=(type)=> {
	return axios.get("/api/statistical/recentNewAndStructured?type="+type);
};

//数据抓取与标记差值
export const pythonAndTag=()=> {
	return axios.get("/api/statistical/diffBetweenGrabAndStructured");
};

//数据类型占比变动趋势
export const dataTypeChange=()=> {
	return axios.get("/api/statistical/assetDataTypeRatio");
};

//资产数据抓取时间段
export const structurePython=(type,date)=> {
	return axios.get("/api/statistical/assetDataCrawlingTimeDistributeDetailsVO?type="+ type +"&date=" +date);
};

//资产数据抓取时间段,31天）内的抓取总量总体分布情况
export const pythonAmountIn31=(type)=> {
	return axios.get("/api/statistical/assetDataCrawlingTimeDistributeAssistDetailsVO?type="+ type);
};


export const  getNewStructuredData = ()=>{
	return axios.get("/api/asset/structured/control/getNewStructuredData");
};
export const  structuredCheckErrorNum = ()=>{
	return axios.get("/api/asset/structured/control/structuredCheckErrorNum");
};

export const  structuredById = (id,approveStatus,flag)=>{
	return axios.get("/api/asset/structured/control/structuredById?id="+id+'&approveStatus='+approveStatus+'&flag='+flag);
};

export const  getLastSaveById = (id)=>{
	return axios.get("/api/asset/structured/control/getLastSaveById?id="+id);
};

export const saveDetail =(id,approveStatus,params)=>{
	return axios.post(`/api/asset/structured/control/${id}/${approveStatus}/saveDetail`,params);
};

export const saveInspectorStructureDetail =(id,params)=>{
	return axios.post(`/api/asset/inspector/control/${id}/saveDetail`,params);
};

export const getWrongTypeAndLevel = (id)=>{
	return axios.get(`/api/getWrongTypeAndLevel?id=${id}`);
};

export const getFeedBackRemark = (id)=>{
	return axios.get(`/api/asset/inspector/control/getFeedBackRemark?id=${id}`);
};

export const getAutoBidding = (id)=>{
	return axios.get(`/api/asset/structured/control/getAutoBidding?id=${id}`);
};

export const getAutoPrompt = (name,flag)=>{
	return axios.get('/api/asset/structured/control/getAutoPrompt?name='+name+'&flag='+flag);
};
