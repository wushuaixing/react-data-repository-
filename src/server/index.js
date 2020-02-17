/**
 * created by anran on 2020-02-17.
 */
// axios 应该做一些封装和拦截，统一判断接口请求是否接通，可以去参考小程序项目

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
				this.props.history.push("/login");
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
