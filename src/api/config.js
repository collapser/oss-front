import axios from 'axios';
import { message } from 'antd';
import { getToken, removeAll } from '../util/auth';

axios.defaults.baseURL = 'https://www.hicooper.cn:8077';
// axios.defaults.baseURL = 'http://127.0.0.1:8077';
// axios.defaults.baseURL = 'http://10.50.5.28:8077';
// axios.defaults.baseURL = 'http://192.168.2.195:8077';
axios.defaults.timeout = 6000;

const blankTokenUrl = new Set(['/auth/login']);

axios.interceptors.request.use((config) => {
  const token = getToken();
  if (!token && !blankTokenUrl.has(config.url)) {
    removeAll();
    localStorage.clear();
    window.location.replace('/#/user/login');
    return;
  }
  config.headers.authorization = token;
  return config;
}, (error) => {
  return Promise.reject(error);
});

axios.interceptors.response.use((response) => {
  const { code, msg } = response.data;
  if (response.data.size) {
    return Promise.resolve(response);
  }
  if (code && code !== '200') {
    message.info(msg);
    if (code === 'TOKEN_EXPIRED') {
      removeAll();
      localStorage.clear();
      window.location.replace(`/#/user/login?fallback=${encodeURIComponent(window.location.href)}`);
    }
    return Promise.reject(code);
  }
  return Promise.resolve(response);
}, (error) => {
  let content = '系统连接超时';
  if (error.response) {
    content = `${error.response.status},${error.response.statusText}`;
  }
  message.error(content);
  return Promise.reject(error);
});

export default axios;
