import axios from 'axios';

process.env.state === "production"
	? (axios.defaults.baseURL = "/")
	: (axios.defaults.baseURL = "/");

axios.interceptors.request.use(
	config => {
		config.headers["Content-Type"] = "application/json;charset=UTF-8";
		return config;
	},
	error => {
		//请求错误处理
		Promise.reject(error);
	}
);

/*axios.interceptors.response.use(
	response => {
		//成功请求到数据
		// app.$vux.loading.hide();
		//这里根据后端提供的数据进行对应的处理
		if (response.data.code !== 200) {
			//debugger
			if (response.data.code === 401 ) {
				router.push({
					name: "login"
				});
			} else {
				//Vue.$Message.error(response.data.message);
				return response;
			}
		}

		return response;
	},
	error => {
		//响应错误处理
		console.log("error");
		console.log(error);
		console.log(JSON.stringify(error));

		let text =
			JSON.parse(JSON.stringify(error)).response.data.code === 404
				? "404"
				: "网络异常，请重试";
		app.$vux.toast.show({
			type: "warn",
			text: text
		});

		return Promise.reject(error);
	}
);*/
// export default service;
/*/!* 获取当前token *!/
const axiosPromiseArr = []; // 储存cancel token

/!* 请求拦截前的处理 *!/

/!* 请求返回后的处理 *!/


/!* =========  常规请求   ========= *!/
const service = axios.create({
	baseURL:  process.env.BASE_URL,
	timeout: 5000 * 4,
	withCredentials: true,
	credentials: 'include',
	headers: {
		'Content-Type': 'application/json;charset=utf-8',
		'Content-Encoding': 'gzip,compress,deflate,identity',

	},
});

/!* eslint-disable no-proto *!/

/!* eslint-enable *!/

// request拦截  请求之前拦截
service.interceptors.request.use(requestMethods.onFulfilled, requestMethods.onRejected);
service.interceptors.response.use(responseMethods.onFulfilled, responseMethods.onRejected);


/!* =========  文件服务请求   ========= *!/

// request拦截  请求之前拦截*/

