/**
 * 检查请求字段
 * @param params
 * @param FieldArray
 * @returns {CheckParams.props|*}
 * @constructor
 */
export const CheckParams = (params,FieldArray=[])=>{
	let _params = {};
	if(FieldArray.length){
		FieldArray.forEach(i=>(params[i]!==null || params[i]!==undefined )?_params[i]=params[i]:"");
		return _params;
	}
	return params;
};



/**
 * 截取 url 里面 指定的参数
 * @param url
 * @param name
 * @returns {null}
 */
export const getQueryByName = (url, name) => {
	const reg = new RegExp(`[?&]${name}=([^&#]+)`);
	const query = url.match(reg);
	try {
		return query ? window.decodeURI(query[1]) : null;
	} catch (e) {
		return query ? query[1] : null;
	}
};

export const getHrefQuery = (name) => {
	if (name) {
		return getQueryByName(window.location.href, name);
	}
	return null;
};

/**
 * 解析查询 get参数
 * @param url
 */
export const parseQuery = (url) => {
	const _url = url || window.location.search || window.location.hash;
	const queryObj = {};
	const reg = /[?&]([^=&#]+)=([^&#]*)/g;
	const _query = _url.match(reg);
	if (_query) {
		for (let i = 0; i < _query.length; i += 1) {
			const query = _query[i].split('=');
			const key = query[0].substr(1);
			const value = query[1];
			if (queryObj[key]) {
				queryObj[key] = [].concat(queryObj[key], window.decodeURI(value));
			} else {
				queryObj[key] = window.decodeURI(value);
			}
		}
	}
	return queryObj;
};

/**
 * param 将要转为URL参数字符串的对象
 * key URL参数字符串的前缀
 * encode true/false 是否进行URL编码,默认为true
 *
 * return URL参数字符串
 */
export const urlEncode = (param, key, encode) => {
	if (param == null) return '';
	let paramStr = '';
	const t = typeof (param);
	if (t === 'string' || t === 'number' || t === 'boolean') {
		paramStr += `&${key}=${(encode == null || encode) ? encodeURIComponent(param) : param}`;
	} else {
		Object.keys(param).forEach((i) => {
			const k = key == null ? i : key + (param instanceof Array ? '' : `.${i}`);
			paramStr += urlEncode(param[i], k, encode);
		});
	}
	return paramStr;
};

/**
 * 滚动值容器顶部
 * @param eleId
 */
export const scrollTop = eleId =>{
	const ele = document.getElementById(eleId||'yc-layout-main');
	if(eleId==='no-yc-layout-main') document.documentElement.scrollTop=0;
	if(ele) ele.scrollTop = 0;
};
