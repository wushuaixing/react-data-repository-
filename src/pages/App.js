import React from 'react';
import { BrowserRouter as Router, Route, Switch, } from "react-router-dom";
import history from "../history";
import Login from "./login";
import Home from "./home";
import DocumentDetail from "./documentDetail";
import SourcePage from "./sourcePage";
import NotFound from './notFound'

class App extends React.Component {
	render(){
		return(
			<Router history={history}>
				<div>
					<Switch>
						<Route path="/" exact component={Login} />
						<Route path="/login" component={Login} />
						<Route path="/index" component={Home} />
						<Route path="/documentDetail/:Id" component={DocumentDetail} />
						<Route path="/sourcePage/:Id" component={SourcePage} />
						<Route path="*" component={NotFound} />
					</Switch>
				</div>
			</Router>
		)
	}
}
export default App;