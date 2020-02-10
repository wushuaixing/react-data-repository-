import axios from 'axios';
const apiUrl="http://data.java.yczcjk.com";
axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";


export function login(params) {
    let data = JSON.stringify(params);
    return axios.post(`${apiUrl}/api/login`, data);
}

//获取图形验证码
export function codeImage() {
    return axios.get(`${apiUrl}/api/code/image`);
}

//验证图形验证码
export function validateImgCode(params) {
    return axios.post(`${apiUrl}/api/validImageCode`,params)
}

//重置密码
export function resetPassword(params) {
    return axios.post(`${apiUrl}／api/resetPassword`, params);
}

//获取可用侧边栏
export function getAvailableNav() {
	return axios.get(`${apiUrl}/api/common/getAvailableNav`);
}
//
//修改密码
export function changePassword(params) {
    return axios.post(`${apiUrl}/api/changePassword`, params);
}

//退出登录
export function logout() {
    return axios.get(`${apiUrl}/api/logout`);
}

//查看（正常和已删除）结构化账号列表
export function userView(params) {
    let urlPlus = "";
    for (let key in params) {
        urlPlus = urlPlus + key + "=" + params[key] + "&";
    }
    urlPlus = urlPlus.substring(0, urlPlus.length - 1);
    return axios.get(`${apiUrl}/api/asset/admin/userView?`+ urlPlus);
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

