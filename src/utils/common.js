// 保存公共函数 如过滤器 日期处理等
import moment from 'moment';

const filters = {
	// 判断输入是否为空  为空返回--
	blockNullData(input, returnVal = '') {
		if (input === '' || input === undefined || input === null) {
			return returnVal;
		}
		return input;
	},
	filterNullKey(input) {
		return input !== '' && input !== undefined && input !== null;
	},
	// 去掉空行  参数1是对象数组  参数2是判断的键名数组
	blockEmptyRow(rows = [], keys = []) {
		const records = []; // 记录处理后的数组
		for (let i = 0; i < rows.length; i += 1) {
			const rowObj = rows[i];
			// let flag = true//标记用 如果字段全为空则设置为true是空行 默认是空行
			for (let j = 0; j < keys.length; j += 1) {
				const value = rowObj[keys[j]];
				if (value !== '' && value !== undefined && value !== null) {
					records.push(rowObj); break;
				}
			}
		}
		return records;
	},
};
const dateUtils = {
	// 时间戳转换为标准日期
	formatStandardDate(timeStamp) {
		return (timeStamp === '' || timeStamp === '--' || timeStamp === undefined || timeStamp === null) ? timeStamp : moment(timeStamp).format('YYYY-MM-DD');
	},
	formatStandardNumberDate(timeStamp, secondsVisible) {
		return (timeStamp === '' || timeStamp === '--' || timeStamp === undefined || timeStamp === null) ? timeStamp : secondsVisible ? moment.unix(timeStamp).format('YYYY-MM-DD HH:mm') : moment.unix(timeStamp).format('YYYY-MM-DD HH:mm:ss');
	},
	// 获取当日日期
	getTodayDate(ifmoment = false) {
		return (ifmoment) ? moment() : moment().format('YYYY-MM-DD');
	},
	formatMomentToStandardDate(m) {
		return m.format('YYYY-MM-DD');
	},
	// 补全日期 arr
	formatDateComplete(arr) {
		// 如果是纯数字
		if (typeof arr.join('') === 'number' && !Number.isNaN(arr.join(''))) {
			return arr.join('').substring(0, 8);
		}
		const temp = arr.map((text, i) => {
			if (text.length === 1 && i !== 0) {
				return `0${text}`;
			}
			if (text.length > 2 && i > 0) {
				return text.substring(0, 2);
			}
			return text;
		});
		return temp.join('').substring(0, 8);
	},

};

const formUtils = {
	// array输入数组  default默认值
	processEmptyArray(array, defaultArray = []) {
		if (array && (array instanceof Array) && array.length > 0) {
			return array;
		}

		return defaultArray;
	},
	// 将null和undefined值统一改为''
	replaceEmptyValue(data) {
		if (typeof data === 'string') {
			const dataString = JSON.stringify(data).replace(/null|undefined/g, '""');
			return JSON.parse(dataString);
		}
		return data;
	},
	// 去掉空行  参数1是对象数组  参数2是判断的键名数组
	blockEmptyRow(rows = [], keys = []) {
		const records = []; // 记录处理后的数组
		for (let i = 0; i < rows.length; i += 1) {
			const rowObj = rows[i];
			// let flag = true//标记用 如果字段全为空则设置为true是空行 默认是空行
			for (let j = 0; j < keys.length; j += 1) {
				const value = rowObj[keys[j]];
				if (value !== '' && value !== undefined && value !== null) {
					records.push(rowObj); break;
				}
			}
		}
		return records;
	},
	// 过滤对象中的空属性
	removeObjectNullVal(obj) {
		const newObj = {};
		Object.keys(obj).forEach((key) => {
			const value = obj[key];
			if (value !== '' && value !== undefined && value !== null) {
				newObj[key] = value;
			}
		});
		return newObj;
	},
};

const clone = (obj) => {
	let o;
	// 如果  他是对象object的话  , 因为null,object,array  也是'object';
	if (typeof obj === 'object') {
		// 如果  他是空的话
		if (obj === null) {
			o = null;
		} else {
			// 如果  他是数组arr的话
			// eslint-disable-next-line no-lonely-if
			if (obj instanceof Array) {
				o = [];
				for (let i = 0, len = obj.length; i < len; i += 1) {
					o.push(clone(obj[i]));
				}
			} else {
				// 如果  他是对象object的话
				o = {};
				for (const j in obj) {
					o[j] = clone(obj[j]);
				}
			}
		}
	} else {
		o = obj;
	}
	return o;
};

export {
	clone, filters, dateUtils, formUtils,
};
/* 获取随机字符串 */
export const ranStr = (l = 4) => {
	const len = l || 32;
	const $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'; /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
	const maxPos = $chars.length;
	let pwd = '';
	for (let i = 0; i < len; i += 1) {
		pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
	}
	return `_${pwd}`;
};

/**
 * 去除对象中空值
 * @param obj
 * @returns {*}
 */
export const clearEmpty = (obj) => {
	if (typeof obj === 'object') {
		const l = Object.keys(obj);
		const _obj = { ...obj };
		l.forEach((item) => {
			if (_obj[item] === '' || _obj[item] === undefined || _obj[item] === null) delete _obj[item];
			else if (typeof _obj[item] === 'string')_obj[item] = _obj[item].replace(/^\s+|\s+$/g, '');
		});
		return _obj;
	}
	return obj;
};
