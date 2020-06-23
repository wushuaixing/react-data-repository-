import React from 'react'
import { withRouter,Route,Switch } from 'react-router-dom'
import Check from './check'
import Other from './other'
class index extends React.Component {
    render() {
        return (
            <div className="yc-right-content">
                <Switch>
                    <Route path="/notFirstMark/check/:associatedAnnotationId" component={Check} />
                    <Route path="/notFirstMark/admin/:associatedAnnotationId"  component={Other} />
                    <Route path="/notFirstMark/structure/:associatedAnnotationId/:associatedStatus"  component={Other} />
                </Switch>
            </div>
        );
    }
}
export default withRouter(index)
