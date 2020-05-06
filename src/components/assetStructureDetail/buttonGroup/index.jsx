import React from 'react'
import { Checkbox, Button } from 'antd'
import { STRUCTURE_SAVE_BUTTON_TEXT } from '@/static/status'
import './index.scss'

class ButtonGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonDisabled: false
        }
    }
    get checkButtonTextArray() {
        const checkButtons  = this.checkButtons
        return [
            {
                status: '1',
                name: '未检查',
                btns: [checkButtons['err'], checkButtons['noErr']]
            },
            {
                status: '1',
                name: '未检查-已删除',
                texts: ['仅标记本条', '保存', '检查无误'],
                btns: [checkButtons['onlyMark'], checkButtons['save'], checkButtons['noErr']]
            },
            {
                status: '2',
                name: '未检查-已删除',
                texts: ['检查有误', '返回'],
                btns: [checkButtons['err'], checkButtons['back']]
            },
            {
                status: '3',
                name: '检查错误',
                texts: ['修改错误原因', '检查无误'],
                btns: [checkButtons['modify'], checkButtons['noErr']]
            },
            {
                status: '4',
                name: '已修改',
                texts: ['检查有误', '检查无误'],
                btns: [checkButtons['err'], checkButtons['noErr']]
            },
            {
                status: '5',
                name: '待确认',
                texts: ['检查有误', '检查无误'],
                btns: [checkButtons['err'], checkButtons['noErr']]
            },
            {
                status: '5',
                name: '待确认-检查错误',
                texts: ['确认', '检查有误', '检查无误'],
                btns: [checkButtons['confirm'], checkButtons['err'], checkButtons['noErr']]
            }
        ]
    }
    get checkButtons() {
        return {
            err: <Button onClick={this.handleErrorModal.bind(this)} key="0" style={{ marginRight: 10 }}>{'检查有误'}</Button>,
            noErr: <Button onClick={this.handleBack} key="1" style={{ marginRight: 10 }}>{'检查无误'}</Button>,
            onlyMark: <OnlyMarkButton handleChange={this.handleChange.bind(this)} key="2" ></OnlyMarkButton>,
            save: <Button onClick={this.handleBack} key="3" style={{ marginRight: 10 }}>{'保存'}</Button>,
            confirm: <Button onClick={this.handleBack} key="4">{'确认'}</Button>,
            modify: <Button onClick={this.handleBack} key="5" style={{ marginRight: 10 }}>{'修改错误原因'}</Button>,
            back: <Button onClick={this.handleBack} key="6" style={{ marginRight: 10 }}>{'返回'}</Button>
        }
    }
    //打开检查人员错误选择对话框
    handleErrorModal() {
        this.props.handleErrorModal()
    }
    //返回
    handleBack() {
        console.log(13)
    }
    //改变仅标记此栏的checkbox
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    //提交保存
    handleClick() {
        this.props.handleSubmit()
    }
    componentDidMount() {
        //如果是在未标记中的 普通数据 需要设置15s后才可以点击保存
        if (this.props.role === 'structure' && this.props.type === 0 && this.props.status === '0') {
            this.setState({
                buttonDisabled: true
            }, () => {
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
        return result;
    }
    render() {
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[this.props.status]
        return (
            <div className="yc-component-buttonGroup">
                {
                    (() => {
                        switch (this.props.role) {
                            case 'structure':
                                return (
                                    <div>
                                        <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                                        <Button onClick={this.handleClick.bind(this)} disabled={this.state.buttonDisabled}>{buttonText}</Button>
                                    </div>
                                )
                            case 'check':
                                return (
                                    <div>
                                        {
                                            this.checkButtonTextArray[0].btns
                                        }
                                    </div>
                                )
                            default:
                                return (
                                    null
                                )
                        }
                    })()
                }
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

export default ButtonGroup;