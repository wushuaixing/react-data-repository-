import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import ErrorBoundary from './pages/errorPage/exceptionPage';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import './assets/css/antd.less';
import './assets/css/font-family.css';

import './index.css';

moment.locale('zh-cn');

const Version = 'v1.3';
const BetaNumber = '.2';
const info = `Version：${Version}${BetaNumber ? `-beta${BetaNumber}` : ''}`;
global.CurrentVersions = info;
if (global.location.protocol === 'http:') {
	console.info(info);
} else {
	console.info('The version information field is CurrentVersions.');
}

ReactDOM.render(
	// eslint-disable-next-line react/jsx-filename-extension
	<ConfigProvider locale={zh_CN} getPopupContainer={(node) => (node ? node.parentElement : document.body)}>
		<ErrorBoundary><App /></ErrorBoundary>
	</ConfigProvider>,
	document.getElementById('root'),
);

serviceWorker.unregister();
