import React from 'react';
import ReactDOM from 'react-dom';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/es/locale-provider/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import App from './pages/App';
import * as serviceWorker from './serviceWorker';
import './index.css';

moment.locale('zh-cn');

ReactDOM.render(
	<LocaleProvider locale={zh_CN}><App /></LocaleProvider>,
	document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
