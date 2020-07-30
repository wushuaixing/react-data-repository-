/**
 * created by anran on 2020-02-14.
 */
// src/history.js

import {createBrowserHistory} from 'history';
const history = createBrowserHistory();
global.navigate=history;

export default history;
