import './index';
import axios from "axios";
axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
//////////////////
//用户登录有关接口//
//////////////////
//登录（账号-密码-下次是否自动登录）
export const login = async (params) => {
	let data = JSON.stringify(params);
	return axios.post('/api/login', data);
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
export const validateImgCode=(params)=> {
    return axios.post('/api/validImageCode',params)
};

//重置密码
export const resetPassword=(params)=> {
    return axios.post('／api/resetPassword', params);
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
}

//开设账号
export const userCreate=(user)=> {
	return axios.post("/api/asset/admin/userCreate", user);
};

//结构化人员列表
export const getStructuredPersonnel=(name)=> {
	return axios.get("/api/asset/inspector/control/getStructuredPersonnel", name);
};
//////////////////////////////
//结构化人员-资产结构化数据接口//
/////////////////////////////
//资产结构化列表
export const structuredList=(params)=> {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/structured/control/structuredList?" + urlPlus);
};

//获取检察人员结构化列表详情
export const getCheckDetail=(id)=> {
	return axios.get("/api/asset/inspector/control/getCheckDetail/" + id);
};

//资产结构化列表
export const structuredObligorTypeList=()=> {
	return axios.get("/api/common/structuredObligorTypeList");
};

// 保存结构化对象
export const saveDetail=(id, params)=> {
	return axios.post(
		"/api/asset/structured/control/" + id + "/saveDetail",
		params
	);
};

//获取新数据 id
export const getNewStructureData=()=> {
	return axios.get("/api/asset/structured/control/getNewStructuredDataId")
};
//////////////////////////////
//检查人员-资产结构化数据接口//
/////////////////////////////
//获取检查人员结构化列表
export const getCheckList=(params)=> {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/inspector/control/getCheckList?" + urlPlus);
};

