
import React from 'react'
import { withRouter } from 'react-router-dom';
import { Result, Button } from 'antd';
class Exception extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }
    componentDidCatch(error, info) {
        this.setState({
            hasError: true
        })
        console.log(error, info)
    }
    render() {
        const error = this.state.hasError ? <Result
            status="warning"
            title="异常情况"
            subTitle="对不起,你的操作异常或数据请求异常,您可刷新页面重试或返回上一层"
        /> : this.props.children;
        return error;
    }
}
export default Exception;