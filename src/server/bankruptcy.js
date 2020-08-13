import { CheckParams } from '@utils/tools';
import { service } from '@/server/index';


const bankruptcy = {
	// 破产数据结构化列表
	bankruptcyList(params) {
		const FieldArray = ['approveStatus', 'companyName', 'num', 'page', 'publishEndTime', 'publishStartTime', 'title', 'uid', 'updateEndTime', 'updateStartTime', 'userType'];
		return service.post('/api/asset/bankruptcy/control/bankruptcyList', CheckParams(params, FieldArray)).then(res => res.data);
	},

	// 请求数据当前状态返回
	getStatus: id => service.get(`/api/asset/bankruptcy/control/bankruptcyStatusById/${id}`).then(res => res.data),
	// 获取破产数据结构化详情信息
	getDetail: id => service.get(`/api/asset/bankruptcy/control/bankruptcyById/${id}`).then(res => res.data),
	// 获取下一条数据id
	getNext: flag => service.get(`/api/asset/bankruptcy/control/getNextId/${flag}`).then(res => res.data),
	// 保存结构化对象
	saveDetail: (id, params) => service.post(`/api/asset/bankruptcy/control/saveDetail/${id}`, params).then(res => res.data),
	// 保存结构化对象并获取下一条id
	saveDetailNext: (id, params) => service.post(`/api/asset/bankruptcy/control/saveDetailRetId/${id}`, params).then(res => res.data),

	// 信息无误按钮接口
	updateStatus: id => service.get(`/api/asset/bankruptcy/control/updateStatus/${id}`).then(res => res.data),
};

export default bankruptcy;
