import React from 'react';
// import { Router, Route, Link } from 'react-router';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import Login from "./login";
import AdminList from './admin/index';
import CheckList from './check/index';

import './App.css';

class App extends React.Component {
	browserHistory;
	render(){
		return(
			<Router  history={this.browserHistory} >
				<div>
					{/*<IndexRoute component={Login} />*/}
					<Route exact path="/" component={Login} />
					<Route path="/adminList" component={AdminList} />
					<Route path="/check" component={CheckList} />
					{/*<Route path="/Page3" component={Page3} />*/}
				</div>
			</Router>
		)
	}
}
/*替换的配置方式
因为 route 一般被嵌套使用，
所以使用 JSX 这种天然具有简洁嵌套型语法的结构来描述它们的关系非常方便。
然而，如果你不想使用 JSX，也可以直接使用原生 route 数组对象。

const routeConfig = [
	{ path: '/',
		component: App,
		indexRoute: { component: Dashboard },
		childRoutes: [
			{ path: 'about', component: About },
			{ path: 'inbox',
				component: Inbox,
				childRoutes: [
					{ path: '/messages/:id', component: Message },
					{ path: 'messages/:id',
						onEnter: function (nextState, replaceState) {
							replaceState(null, '/messages/' + nextState.params.id)
						}
					}
				]
			}
		]
	}
]

React.render(<Router routes={routeConfig} />, document.body)*/

export default App;

// const App = () =>(
//           <Login />
// );

