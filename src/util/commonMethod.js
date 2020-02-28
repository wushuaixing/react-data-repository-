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

//验证账号密码-输入框格式
const handleValidator = (rule, val, callback) => {
	if (rule.field === "name") {
		if(!val){
			callback('');
		}
		else if (val.length > 20) {
			callback("姓名最大长度为20个字符");
		}
	}
	if (rule.field === "username") {
		if(!val){
			callback('');
		}
		else if (!val.match(/^\d{11}$/)) {
			callback("请输入11位数字");
		}
		else{
			this.setPwd(val);
		}
	}
	if (rule.field === "password") {
		if(!val){
			callback('');
		}
		else if (val.length > 20 || val.length < 6) {
			callback('密码长度为6-20位');
		}
	}
	//修改密码
	if (rule.field === "newPassword") {
		if(!val){
			callback('请输入新密码');
		}
		else if (val.length > 20 || val.length < 6) {
			let pattern = new RegExp(/\s+/g);
			if(pattern.test(val)){
				callback('不允许有空格');
			}else{
				callback('长度为6-20位');
			}
		}
	}
	if (rule.field === "confirmNewPassword") {
		if(!val){
			callback('请确认新密码');
		}
		else if (val.length > 20 || val.length < 6) {
			let pattern = new RegExp(/\s+/g);
			if(pattern.test(val)){
				callback('不允许有空格');
			}else{
				callback('长度为6-20位');
			}
		}
	}
};
const validatorLogin = (rule, val, callback) => {
	if(rule.field === "username"){
		if(!val){
			callback('账号不能为空');
		}
		else if(!val.match(/[0-9]{11}/)){
			callback('账号长度为11位数字');
		}
	}
	if(rule.field === "password"){
		if(!val){
			callback('密码不能为空');
		}
		else if(val.length>20 || val.length<6){
			callback('密码长度为6-20位');
		}
	}
	//找回密码的格式验证
	if(rule.field === "psw"){
		if(!val){
			callback('密码不能为空');
		}
		else if(val.length>20 || val.length<6){
			callback('密码长度为6-20位');
		}
	}
};

export {
	dataFilter,getToday,handleValidator,validatorLogin
};
