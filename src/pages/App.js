import React from 'react';
// import { Router, Route, Link } from 'react-router';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";

import history from "../history";
import Login from "./login";
import Home from "./home";
import './App.css';

class App extends React.Component {
	render(){
		return(
			<Router history={history}>
				<div>
					<Switch>
						<Route path="/" exact component={Login} />
						<Route path="/login" component={Login} />
						<Route path="/index" component={Home} />
					</Switch>
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
// export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));
// export default withRouter(App)
export default App;
// const App = () =>(

//           <Login />
// );

