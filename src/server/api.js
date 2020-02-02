import axios from 'axios';
const apiUrl="http://data.java.yczcjk.com";
axios.processData = false;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json;charset=UTF-8";

export function login(params) {
    let data = JSON.stringify(params);
    return axios.post(`${apiUrl}/api/login`, data);
}
