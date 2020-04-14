/**
 * created by anran on 2020-02-17.
 */
//日期转换
const dataFilter=(value)=>{
		let data = new Date(value);
		let year = data.getFullYear();
		let month = data.getMonth() + 1;
		if (month < 10) {
			month = "0" + month;
		}
		let date = data.getDate();
		if (date < 10) {
			date = "0" + date;
		}
		return year + "-" + month + "-" + date;
	};

//获取当日日期
const getToday=()=>{
	const today=new Date();
	const seperator1="-";
	let year = today.getFullYear();
	let month = today.getMonth() + 1;
	let strDate = today.getDate();
	if (month >= 1 && month <= 9) {
		month = "0" + month;
	}
	if (strDate >= 0 && strDate <= 9) {
		strDate = "0" + strDate;
	}
	return year + seperator1 + month + seperator1 + strDate
};
/**
 * created by anran on 2020-02-10.
 */
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
	dataFilter,getToday,clone
};
