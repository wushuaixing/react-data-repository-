import axios from 'axios';
axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";
// axios 应该做一些封装和拦截，统一判断接口请求是否接通，可以去参考小程序项目

//登录接口（账号-密码-下次是否自动登录）
export const login = async (params) => {
	let data = JSON.stringify(params);
	return axios.post('/api/login', data);
};

//判断是否登录过
export const isLogin = (params) => {
	let data = JSON.stringify(params);
	return axios.get("/api/isLogin", data);
};

//获取图形验证码
export function codeImage() {
    return axios.get('/api/code/image');
}

//验证图形验证码
export function validateImgCode(params) {
    return axios.post('/api/validImageCode',params)
}

//重置密码
export function resetPassword(params) {
    return axios.post('／api/resetPassword', params);
}

//获取可用侧边栏
export function getAvailableNav() {
	// return axios.get('/api/common/getAvailableNav');
	return axios.get('/api/common/getAvailableNav');
}
//
//修改密码
export function changePassword(params) {
    return axios.post('/api/changePassword', params);
}

//退出登录
export function logout() {
    return axios.get('/api/logout');
}

//查看（正常和已删除）结构化账号列表
export function userView(params) {
    let urlPlus = "";
    for (let key in params) {
        urlPlus = urlPlus + key + "=" + params[key] + "&";
    }
    urlPlus = urlPlus.substring(0, urlPlus.length - 1);
    return axios.get('/api/asset/admin/userView?'+ urlPlus);
}

// 获取资产结构化数据详情
//资产结构化列表
export function structuredList(params) {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/structured/control/structuredList?" + urlPlus);
}

//获取检察人员结构化列表详情
export function getCheckDetail(id) {
	return axios.get("/api/asset/inspector/control/getCheckDetail/" + id);
}
//资产结构化列表
export function structuredObligorTypeList() {
	return axios.get("/api/common/structuredObligorTypeList");
}

// 保存结构化对象
export function saveDetail(id, params) {
	return axios.post(
		"/api/asset/structured/control/" + id + "/saveDetail",
		params
	);
}

//获取新数据 id
export function getNewStructureData() {
	return axios.get("/api/asset/structured/control/getNewStructuredDataId")
}

//开设账号
export function userCreate(user) {
	return axios.post("/api/asset/admin/userCreate", user);
}

//结构化人员列表
export function getStructuredPersonnel(name) {
	return axios.get("/api/asset/inspector/control/getStructuredPersonnel", name);
}

/**
 检查人员*/
//获取检查人员结构化列表
export function getCheckList(params) {
	let urlPlus = "";
	for (let key in params) {
		urlPlus = urlPlus + key + "=" + params[key] + "&";
	}
	urlPlus = urlPlus.substring(0, urlPlus.length - 1);
	return axios.get("/api/asset/inspector/control/getCheckList?" + urlPlus);
}

