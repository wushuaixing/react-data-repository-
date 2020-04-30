import React from 'react'
import { Checkbox, Button } from 'antd'
import { STRUCTURE_SAVE_BUTTON_TEXT } from '@/static/status'
import './index.scss'

class StructureButtonGroup extends React.Component {
    state = {
        buttonDisabled: false
    }
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    handleClick() {
        this.props.handleSubmit()
    }
    componentDidMount() {
        //如果是在未标记中的 普通数据 需要设置15s后才可以点击保存
        if (this.props.type === 0 && this.props.status === '0') {
            this.setState({
                buttonDisabled:true
            },()=>{
                this.timeId = setTimeout(() => {
                    this.setState({
                        buttonDisabled: false
                    })
                }, 15000)
            })
        }
    }
    componentWillUnmount() {
        const result = this.timeId ? clearInterval(this.timeId) : null
    }
    render() {
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[this.props.status]
        return (
            <div className="yc-component-buttonGroup">
                <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                <Button onClick={this.handleClick.bind(this)} disabled={this.state.buttonDisabled}>{buttonText}</Button>
            </div>
        )
    }
}

const OnlyMarkButton = (props) => {
    return (
        <div className="yc-component-buttonGroup-onlyMark">
            <Checkbox onChange={props.handleChange} name="onlyThis">仅标记本条</Checkbox>
        </div>
    )
}

export default StructureButtonGroup;