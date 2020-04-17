//保存公共函数 如过滤器 日期处理等
import moment from 'moment'

const filters = {
	//判断输入是否为空  为空返回--
	blockNullByBar(input) {
		if (input === '' || input === undefined || input === null) {
			return '--';
		} else {
			return input;
		}
	}
}
const dateUtils = {
	//时间戳转换为标准日期	
	formatStandardDate(timeStamp) {
		return (timeStamp === '' || timeStamp === '--' || timeStamp === undefined || timeStamp === null) ? timeStamp : moment(timeStamp).format('YYYY-MM-DD');
	},
	//获取当日日期
	getTodayDate() {
		return moment().format('YYYY-MM-DD');
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
