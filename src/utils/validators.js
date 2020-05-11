//验证账号密码-输入框格式
export const handleValidator = (rule, val, callback) => {
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
		if(!(/^\d{11}$/.test(val))){
			callback('账户格式不正确，需为11位手机数字号码')
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
	//console.log(val)
	if(rule.field === 'mobile'){
		if(!val){
			callback('');
		}
		if(!(/^\d{11}$/.test(val))){
			callback('账户格式不正确，需为11位手机数字号码')
		}
	}
};
export const validatorLogin = (rule, val, callback) => {
	if(val.toString().indexOf(' ')>=0){
		callback('账号密码不能含有空格')
	}
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
		if(!val.match(/[0-9a-zA-Z]{6,20}/)){
			callback('密码格式错误,需为6-20位的数字,字母或下划线');
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