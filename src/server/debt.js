import axios from './index';

const debtApi = {

    // 获取新债权结构化数据
    getNewCreditorsData: () => axios.get('/api/asset/creditors/control/getNewCreditorsData'),

    // 标注人员列表
    getStructuredPersonnels: (name) => axios.get('/api/asset/creditors/control/getStructuredPersonnel', name),

    // 债权结构化列表
    creditorsList: (params) => axios.post('/api/asset/creditors/control/creditorsList', params),

    //债权结构化(包)详情
    getcreditorsDetail: (id) => axios.get(`/api/asset/creditors/control/creditorsDetail/${id}`),

    //债权结构化(包)详情 各户信息列表
    getcreditorsUnitsList: (id, page) => axios.get(`/api/asset/creditors/control/creditorsUnitsList/${id}/${page}`),

    //债权户(未知)信息详情
    getcreditorsUnitDetail: (id) => axios.get(`/api/asset/creditors/control/creditorsUnitDetail/${id}`),

    //债权户(未知)信息详情
    unitSaveDetail: (params) => axios.post('/api/asset/creditors/control/unitSaveDetail', params),

    //债权结构化源网站提取页HTML
    htmlDetail: (id,isDebt) => {
        return isDebt==="1"?axios.get(`/api/asset/auction/htmlDetail/${id}`):axios.get(`/api/asset/auction/${id}/htmlDetailInfo`);
    }
}
export default debtApi;