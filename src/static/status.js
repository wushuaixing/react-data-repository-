/**
 * created by anran on 2020-02-27.
 */
export const codeMessage={
	assetUser:199,
	adminUser:203,
	checkUser:205,
};

export const AUCTION_STATUS = {
	1:'即将开始',
	3:'进行中',
	5:'已成交',
	7:'已流拍',
	9:'中止',
	11:'撤回'
};

export const COLLATERAL = {
	1:"无抵押",
	2:"有抵押",
	0:"未知"
};
export const HOUSE_TYPE = {
	0:"未知",
	1:"商用",
	2:"住宅",
	3:"工业"
};

export const ROLE_TYPE = {
	1:'资产所有人',
	2:'债权人',
	3:'资产线索',
	5:'竞买人'
};
export const SEX_TYPE = {
	0:'未知',
	1:'男性',
	2:'女性'
};

export const STRUCTURE_SAVE_BUTTON_TEXT = {
	0:'保存并标记下一条',  //待标记
	1:'保存',
	2:'保存并修改下一条'
};
export const WRONG_TYPE_LIST = [
	'所有人遗漏',
	'所有人错误',
	'多填所有人',
	'债权人遗漏',
	'债权人错误',
	'身份信息遗漏',
	'身份信息错误',
	'资产线索遗漏',
	'资产线索错误',
	'抵押文书遗漏',
	'抵押文书错误',
	'角色类别选择错误',
	'没有优先填身份证号',
	'勾选见附件错误',
	'勾选无抵押错误',
	'案号遗漏',
	'案号错误',
	'面积遗漏',
	'面积错误',
	'备注遗漏',
	'备注错误',
	'房产类型遗漏',
	'房产类型错误',
	'多填债权人/资产线索/抵押文书'	
];

export const REASON_LIST =[
	{
		label:0,
		value:"见拍卖页"
	},
	{
		label:1,
		value:"见附件"
	},
	{
		label:2,
		value:"见授权书"
	},
	{
		label:3,
		value:"见抵押文书"
	},
	{
		label:4,
		value:"文书搜\"\""
	}
];

export const WRONG_LEVEL = {
	// 0:'检查无误',
	// 1:'严重',
	// 4:'普通',
	// 7:'不计入错误'
	0:'不计入错误',
	1:'普通',
	2:'严重',
	3:'无误',
};

export const CHARACTER_LIST = [
	{
		value: '',
		label: "全部"
	},
	{
		value: 1,
		label: "正式"
	},
	{
		value: 0,
		label: "试用"
	}
];

export const ADD_CHARACTER_LIST = {
	0:'试用',
	1:'正式'
};

export const AUCTION_DATA_TYPE = {
	0:'普通数据',
	2:'相似数据',
	3:'非初标数据'
};
