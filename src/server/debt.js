import axios from './index';

// 债权结构化列表
export const creditorsList = (params) => axios.post('/api/asset/creditors/control/creditorsList', params);

// 标注人员列表
export const getStructuredPersonnels = (name) => axios.get('/api/asset/creditors/control/getStructuredPersonnel', name);

// 获取新债权结构化数据
export const getNewCreditorsData = () => axios.get('/api/asset/creditors/control/getNewCreditorsData');