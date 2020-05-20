// 管理员和资产结构化人员共用此页面
import React from 'react'
import { withRouter,Route,Switch } from 'react-router-dom'
import Check from './check'
import Admin from './admin'
class index extends React.Component {
    render() {
        return (
            <div className="yc-right-content">
                <Switch>
                    <Route path="/autoMark/check/:associatedAnnotationId" component={Check} />
				    <Route path="/autoMark/admin/:associatedAnnotationId"  component={Admin} />
                </Switch>
            </div>
        );
    }
}
export default withRouter(index)