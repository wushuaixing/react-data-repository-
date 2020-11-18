import axios from './index';

const debtApi = {

    // 获取新债权结构化数据
    getNewCreditorsData: () => axios.get('/api/asset/creditors/control/getNewCreditorsData'),

    // 标注人员列表
    getStructuredPersonnels: (name) => axios.get('/api/asset/creditors/control/getStructuredPersonnel',name),

    // 债权结构化列表
    creditorsList: (params) => axios.post('/api/asset/creditors/control/creditorsList',params),

    //债权结构化(包)详情
    getCreditorsDetail: (id) => axios.get(`/api/asset/creditors/control/creditorsDetail/${id}`),

    //债权结构化(包)详情 各户信息列表
    getCreditorsUnitsList: (id, page) => axios.get(`/api/asset/creditors/control/creditorsUnitsList/${id}/${page}`),

    //获取保证人数信息
    getGuarantorMsg: (params) => axios.post('/api/asset/creditors/control/getGuarantorMsg',params),

    //获取抵质押人数信息
    getCreditorsMsg: (params) => axios.post('/api/asset/creditors/control/getCreditorsMsg',params),

    //获取抵押物数信息
    getCollateralMsg: (params) => axios.post('/api/asset/creditors/control/getCollateralMsg',params),

    //爬虫爬取抵押物名称信息
    getCollateralMsgList: (id) => axios.get(`/api/asset/creditors/control/getCollateralMsgList/${id}`),

    //获取抵押物信息
    getCollateralDetail: (id) => axios.get(`/api/asset/creditors/control/getCollateralDetail/${id}`),

    //户_删除
    deleteUnitByID: (id) => axios.post(`/api/asset/creditors/control/deleteUnitByID/${id}`),

    //保存并标注下一条
    saveAndGetNext: (params) => axios.post('/api/asset/creditors/control/saveAndGetNext',params),
    
    //保存
    saveDetail: (params) => axios.post('/api/asset/creditors/control/saveDetail',params),

    //检查无误
    checkAndSave: (id) => axios.get(`/api/asset/creditors/control/checkAndSave/${id}`),

    //债权户(未知)信息详情
    getCreditorsUnitDetail: (id) => axios.get(`/api/asset/creditors/control/creditorsUnitDetail/${id}`),

    //债权户(未知)信息详情
    unitSaveDetail: (params) => axios.post('/api/asset/creditors/control/unitSaveDetail',params),

    //债权结构化源网站提取页HTML
    htmlDetail: (id,isDebt) => {
        return isDebt==="1"?axios.get(`/api/asset/auction/htmlDetail/${id}`):axios.get(`/api/asset/auction/${id}/htmlDetailInfo`);
    }
}
export default debtApi;