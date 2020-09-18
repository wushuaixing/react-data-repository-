import { service } from '@/server/index';

export const a = 1;
export const userToken = () => service.get('/api/userToken').then((res) => res.data);
