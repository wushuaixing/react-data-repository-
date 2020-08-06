import { service } from '@/server/index';

export const userToken =() => service.get(`/api/userToken`).then(res => res.data);
