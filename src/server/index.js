
// axios 应该做一些封装和拦截，统一判断接口请求是否接通，可以去参考小程序项目
import axios from "axios";

axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

// 请求前拦截
axios.interceptors.request.use(
	config => {
		return config;
	},
	err => {
		console.log("请求超时");
		return Promise.reject(err);
	}
);

// 返回后拦截
axios.interceptors.response.use(
	response => {
		//这里根据后端提供的数据进行对应的处理
		if (response.data.code !== 200) {
			// debugger
			if (response.data.code === 401 ) {
				window.location.href = '/login';
			} else {
				return response;
			}
		}
		// debugger
		//成功请求到数据
		return response;
	},
	err => {
		if (err.response.status === 504 || err.response.status === 404) {
			console.log("请求出错");
		} else if (err.response.status === 401) {
			console.log("请重新登录");
		} else if (err.response.status === 500) {
			console.log("服务器遇到错误，无法完成请求");
		}
		return Promise.reject(err);
	}
);

let http={
	post:"",
	get:""
};

http.post=function (api,data) {
	return new Promise((resolve,reject)=>{
		axios.post(api,data).then((res)=>{
			resolve(res)
		})
	})
};

http.get=function (api,data) {
	return new Promise((resolve,reject)=>{
		axios.get(api,data).then((res)=>{
			resolve(res)
		})
	})
};



export default http
