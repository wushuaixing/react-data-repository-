import React from 'react';
import ReactDOM from 'react-dom';
import { Locale,ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import './index.css';

moment.locale('zh-cn');

ReactDOM.render(
	<ConfigProvider locale={zh_CN}><App /></ConfigProvider>,
	document.getElementById('root'));

serviceWorker.unregister();
