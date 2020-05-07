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
}

export const COLLATERAL = {
	1:"无抵押",
	2:"有抵押", 
	0:"未知"
}
export const HOUSE_TYPE = {
	1:"商用",
	2:"住宅",
	0:"未知"
}

export const ROLE_TYPE = {
	1:'资产所有人',
	2:'债权人',
	3:'资产线索',
	5:'竞买人'
}
export const SEX_TYPE = {
	0:'未知',
	1:'男性',
	2:'女性'
}

export const STRUCTURE_SAVE_BUTTON_TEXT = {
	0:'保存并标记下一条',  //待标记
	1:'保存',
	2:'保存并修改下一条'
}
export const WRONG_TYPE_LIST = [
	{
		type:'严重错误',
		children:[
			{
				text:'资产所有人、债权人、资产线索遗漏'
			},
			{
				text:'名字填写错误'
			},
			{
				text:'身份信息填写错误'
			}
		]
	},
	{
		type:'普通错误',
		children:[
			{
				text:'资产所有人、债权人、资产线索错误（多填)'
			},
			{
				text:'角色类别错误'
			},
			{
				text:'身份信息填写错误'
			},
			{
				text:'起诉人遗漏或名字填写错误'
			},
			{
				text:'文书链接遗漏'
			},
			{
				text:'附件抵押信息遗漏'
			}
		]
	},
	{
		type:'不计入错误率',
		children:[
			{
				text:'不能确定的身份信息'
			},
			{
				text:'文书案号遗漏或错误'
			},
			{
				text:'文书链接与标的物无关'
			},
			{
				text:'文书链接与标的物有关但缺少抵押信息'
			},
			{
				text:'备注填写错误'
			},
			{
				text:'建筑面积、房地产类型填写错误'
			}
		]
	},
]

export const REASON_LIST =[
	{
		label:0,
		value:"拍卖页文本看漏"
	},
	{
		label:1,
		value:"拍卖页图片看漏"
	},
	{
		label:2,
		value:"附件文本看漏"
	},
	{
		label:3,
		value:"附件图片看漏"
	},
	{
		label:4,
		value:"文书未找到"
	},
	{
		label:5,
		value:"文书文本看漏"
	},
	{
		label:6,
		value:"填写失误"
	},
	{
		label:7,
		value:	"其他"
	}
];