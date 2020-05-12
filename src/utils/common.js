//保存公共函数 如过滤器 日期处理等
import moment from 'moment'

const filters = {
	//判断输入是否为空  为空返回--
	blockNullData(input, returnVal = '') {
		if (input === '' || input === undefined || input === null) {
			return returnVal;
		} else {
			return input;
		}
	},
	filterNullKey(input) {
		if (input !== '' && input !== undefined && input !== null) {
			return true
		} else {
			return false
		}
	},
	//去掉空行  参数1是对象数组  参数2是判断的键名数组
	blockEmptyRow(rows = [], keys = []) {
		let records = [] //记录处理后的数组
		for (let i = 0; i < rows.length; i++) {
			let rowObj = rows[i]
			//let flag = true//标记用 如果字段全为空则设置为true是空行 默认是空行
			for (let j = 0; j < keys.length; j++) {
				let value = rowObj[keys[j]]
				if (value !== '' && value !== undefined && value !== null) {
					records.push(rowObj); break;
				}
			}
		}
		return records;
	},
}
const dateUtils = {
	//时间戳转换为标准日期	
	formatStandardDate(timeStamp) {
		return (timeStamp === '' || timeStamp === '--' || timeStamp === undefined || timeStamp === null) ? timeStamp : moment(timeStamp).format('YYYY-MM-DD');
	},
	//获取当日日期
	getTodayDate(ifmoment = false) {
		return (ifmoment) ? moment() : moment().format('YYYY-MM-DD');
	},
	formatMomentToStandardDate(moment) {
		return moment.format('YYYY-MM-DD')
	},
	//补全日期 arr
	formatDateComplete(arr) {
		//如果是纯数字
		if (typeof arr.join('') === 'number' && !isNaN(arr.join(''))) {
			return arr.join('').substring(0,8)
		} else {
			let temp = arr.map((text,i)=>{
				console.log(text,text.length,i)
				if (text.length === 1 && i !== 0) {
					return '0' + text
				}
				if (text.length > 2 && i > 0) {
					return text.substring(0, 2)
				} else {
					return text
				}
			})
			return temp.join('').substring(0,8)
		}
	}

}

const clone = obj => {
	var o;
	// 如果  他是对象object的话  , 因为null,object,array  也是'object';
	if (typeof obj === "object") {
		// 如果  他是空的话
		if (obj === null) {
			o = null;
		} else {
			// 如果  他是数组arr的话
			if (obj instanceof Array) {
				o = [];
				for (var i = 0, len = obj.length; i < len; i++) {
					o.push(clone(obj[i]));
				}
			}
			// 如果  他是对象object的话
			else {
				o = {};
				for (var j in obj) {
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
	clone, filters, dateUtils
};
