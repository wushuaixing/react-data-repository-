// 管理员和资产结构化人员共用此页面
import React from 'react'
import { withRouter,Route,Switch } from 'react-router-dom'
import Check from './check'
import Other from './other'
class index extends React.Component {
    render() {
        return (
            <div className="yc-right-content">
                <Switch>
                    <Route path="/notFirstMark/check" component={Check} />
				    <Route path="/notFirstMark/admin"  component={Other} />
                    <Route path="/notFirstMark/structure"  component={Other} />
                </Switch>
            </div>
        );
    }
}
export default withRouter(index)