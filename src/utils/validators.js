export const validatorLogin = (rule, val, callback) => {
	if (val.toString().indexOf(' ') >= 0) {
		callback('账号密码不能含有空格');
	}
	if (rule.field === 'username') {
		if (!val) {
			callback('账号不能为空');
		} else if (!val.match(/[0-9]{11}/)) {
			callback('账号长度为11位数字');
		}
	}
	if (rule.field === 'password') {
		if (!val) {
			callback('密码不能为空');
		}
		if (!val.match(/[0-9a-zA-Z]{6,20}/)) {
			callback('密码格式错误,需为6-20位的数字,字母或下划线');
		}
	}
	// 找回密码的格式验证
	if (rule.field === 'psw') {
		if (!val) {
			callback('密码不能为空');
		} else if (val.length > 20 || val.length < 6) {
			callback('密码长度为6-20位');
		}
	}
};

export function twoNewPasswordValidator(rule, val, callback) {
	const newPassword = this.props.form.getFieldValue('newPassword') || this.props.form.getFieldValue('password');
	if (newPassword && val !== newPassword) {
		callback(new Error('两次新密码不一致'));
	} else {
		callback();
	}
}

export function oldAndNewPasswordValidator(rule, val, callback) {
	const oldPassword = this.props.form.getFieldValue('oldPassword');
	if (oldPassword && val === oldPassword) {
		callback(new Error('新密码不能与原密码一致'));
	} else {
		callback();
	}
}

export function validPhoneNumber(string) {
	const reg = /^[1][3,4,5,7,8][0-9]{9}$/;
	return reg.test(string);
}
