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
					<Route exact path="/" component={Login} />
					<Route path="/adminList" component={AdminList} />
					<Route path="/check" component={CheckList} />
					{/*<Route path="/Page3" component={Page3} />*/}
				</div>
			</Router>
		)
	}
}

export default App;

// const App = () =>(
//           <Login />
// );

