import React from 'react'
import { Checkbox, Button } from 'antd'
import { STRUCTURE_SAVE_BUTTON_TEXT } from '@/static/status'
import { withRouter } from 'react-router-dom';
import './index.scss'

class ButtonGroup extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            buttonDisabled: true,
            timer: null
        }
    }
    get checkButtonTextArray() {
        const checkButtons = this.checkButtons
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
            noErr: <Button onClick={this.handleNoErr.bind(this)} key="1" style={{ marginRight: 10 }}>{'检查无误'}</Button>,
            onlyMark: <OnlyMarkButton handleChange={this.handleChange.bind(this)} key="2" ></OnlyMarkButton>,
            save: <Button onClick={this.handleStructureUpdate.bind(this)} key="3" style={{ marginRight: 10 }}>{'保存'}</Button>,
            confirm: <Button onClick={this.handleConfirm.bind(this)} key="4">{'确认'}</Button>,
            modify: <Button onClick={this.handleErrorModal.bind(this)} key="5" style={{ marginRight: 10 }}>{'修改错误原因'}</Button>,
            back: <Button onClick={this.handleBack} key="6" style={{ marginRight: 10 }}>{'返回'}</Button>
        }
    }
    handleConfirm() {
        this.props.handleConfirm()
    }
    //打开检查人员错误选择对话框
    handleErrorModal() {
        this.props.handleErrorModal()
    }
    //检查无误
    handleNoErr() {
        this.props.handleNoErr()
    }
    //返回
    handleBack() {
        this.props.handleBack()
    }
    //改变仅标记此栏的checkbox
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    //提交保存
    handleClick() {
        this.props.handleSubmit()
    }
    handleCountDown() {
        if (this.state.countDown > 0) {
            const countDown = this.state.countDown - 1
            this.setState({
                countDown
            })
        } else {
            clearInterval(this.state.timer)
            this.setState({
                buttonDisabled: false,
                timer: 0 //已经计时过了
            })
        }

    }
    handleStructureUpdate() {
        this.props.handleStructureUpdate()
    }
    componentWillReceiveProps(newProps) {
        //如果切换了id 则设置计时器可重新刷新
        if(newProps.id!==this.props.id){
            clearInterval(this.state.timer)
            this.setState({
                timer:null,
                countDown:null
            })
        }
        //如果收到了type数据且现在计时器可更新则进入判断
        if (this.props.type !== null &&  (this.state.timer === null)) {
            //如果是在未标记中的 普通数据 需要设置15s后才可以点击保存
            if (this.props.role === 'structure' && this.props.type === 0 && this.props.status === '0') {
                this.setState({
                    buttonDisabled: true,
                    countDown: 5,
                    timer: setInterval(() => {
                        this.handleCountDown()
                    }, 1000)
                })
            }
            //在待标记的初标数据类型时或不在待标记时候 不需要计时  
            if ((this.props.type !== 0 && this.props.status === '0') || this.props.status !== '0') {
                this.setState({
                    buttonDisabled: false,
                    countDown:null 
                });
            }
        }
    }
    render() {
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[this.props.status]
        const { countDown } = this.state
        const { enable, status } = this.props
        return (
            <div className="yc-component-buttonGroup">
                {
                    (() => {
                        switch (this.props.role) {
                            case 'structure':
                                return (
                                    <div className="yc-component-buttonGroup-structure">
                                        <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                                        <Button onClick={this.handleClick.bind(this)} disabled={this.state.buttonDisabled}>{`${buttonText}${(countDown > 0) ? '(' + countDown + 's)' : ''}`}</Button>
                                    </div>
                                )
                            case 'check':
                                if (enable) {
                                    switch (status) {
                                        case "1":
                                            return <div>{this.checkButtonTextArray[0].btns}</div>
                                        case "2":
                                            return <div>{this.checkButtonTextArray[2].btns}</div>
                                        case "3":
                                            return <div>{this.checkButtonTextArray[3].btns}</div>
                                        case "4":
                                            return <div>{this.checkButtonTextArray[4].btns}</div>
                                        default:
                                            return null;
                                    }
                                } else {
                                    return (
                                        <div className="btnText_1">
                                            {
                                                this.checkButtonTextArray[1].btns
                                            }
                                        </div>
                                    )
                                }
                            case 'admin':
                                return (
                                    <div className="yc-component-buttonGroup-structure">
                                        <Button onClick={this.handleBack.bind(this)}>返回</Button>
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

export default withRouter(ButtonGroup);