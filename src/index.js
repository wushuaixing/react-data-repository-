import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ErrorBoundary from './pages/errorPage/exceptionPage'
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import './assets/css/antd.less';
// import './assets/css/font-family.css';

import './index.css';

moment.locale('zh-cn');

const Version = 'v1.2.1';
const BetaNumber = '.1';
const info = `Version：${Version}${BetaNumber ? `-beta${BetaNumber}` : ''}`;
window.CurrentVersions = info;
if (window.location.protocol === 'http:') {
	console.info(info);
}else{
	console.info('The version information field is CurrentVersions.');
}


ReactDOM.render(
	<ConfigProvider locale={zh_CN} getPopupContainer={node=>node ? node.parentElement : document.body } >
		<ErrorBoundary><App /></ErrorBoundary>
	</ConfigProvider>,
	document.getElementById('root')
);

serviceWorker.unregister();
