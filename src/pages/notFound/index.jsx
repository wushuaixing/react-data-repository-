import React from 'react'
import { withRouter } from 'react-router-dom';
import { Result, Button } from 'antd';
class NotFound extends React.Component {
    goBackToLoginPage() {
        this.props.history.push('/login')
    }
    goBack() {

    }
    render() {
        return (
            <Result
                status="404"
                title="404"
                subTitle="对不起,你所请求的网页地址没有找到"
                extra={
                    [
                        <Button type="primary" onClick={this.goBackToLoginPage.bind(this)} key={1}>回到登录页面</Button>,
                        <Button type="primary" onClick={this.goBack.bind(this)} key={2}>回到上一页</Button>
                    ]
                }
            />
        )
    }
}
export default withRouter(NotFound);