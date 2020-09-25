import React,{Component,Fragment} from 'react'
import { Checkbox, Button } from 'antd'
import { STRUCTURE_SAVE_BUTTON_TEXT } from '@/static/status'
import { withRouter } from 'react-router-dom';
class ButtonGroup extends Component {
    constructor() {
        super();
        this.state = {
            buttonDisabled: true,
            timer: null
        };
    }
    static defaultProps = {
        type: '',
        role: '',     
        id: '',   
        isSendRequest: '',
        status: 0,               
        url: '',
        onlyThis:false,
        enble:true,
        handleSubmit:()=>{},
        handleErrorModal:()=>{},
        handleStructureUpdate:()=>{},
        handleNoErr:()=>{},
        handleChange:()=>{},
        handleConfirm:()=>{},
        handleBack:()=>{},
    };
    get checkButtons() {
        const { onlyThis } = this.props;
        return {
            err: <Button onClick={this.handleErrorModal.bind(this,'err')} key="0" style={{ marginLeft: 10 }}>{'检查有误'}</Button>,
            noErr: <Button onClick={this.handleNoErr.bind(this)} key="1" style={{ marginLeft: 10 }}>{'检查无误'}</Button>,
            onlyMark: <OnlyMarkButton handleChange={this.handleChange.bind(this)} key="2" style={{ marginLeft: 10 }} value={onlyThis} />,
            save: <Button onClick={this.handleSubmit.bind(this)} key="3" style={{ marginLeft: 10 }}>{'保存'}</Button>,
            confirm: <Button onClick={this.handleConfirm.bind(this)} key="4" style={{ marginLeft: 10 }} >{'确认'}</Button>,
            modify: <Button onClick={this.handleErrorModal.bind(this,'modify')} key="5" style={{ marginLeft: 10 }}>{'修改错误原因'}</Button>,
            back: <Button onClick={this.handleBack.bind(this)} key="6" style={{ marginLeft: 10 }}>{'返回'}</Button>,
            close:<Button onClick={this.handleClosePage.bind(this)} key="7" style={{ marginLeft: 10 }}>{'关闭'}</Button>,
        }
    }
    get checkButtonTextArray() {
        const checkButtons = this.checkButtons;
        const {isBack} = this.props;
        const toAffirm =isBack?checkButtons['confirm']:null;
        return [
            {
                btns: [checkButtons['onlyMark'],toAffirm, checkButtons['save'], checkButtons['noErr']]
            },
            {
                btns: [toAffirm,checkButtons['err'], checkButtons['noErr']]
            },
            {
                btns: [toAffirm,checkButtons['err'], !toAffirm ? checkButtons['back'] : null]
            },
            {
                btns: [toAffirm,checkButtons['modify'], checkButtons['noErr']]
            },
            {
                btns: [toAffirm,checkButtons['err'], checkButtons['noErr']]
            },
            {
                btns: [toAffirm,checkButtons['confirm'], checkButtons['err'], checkButtons['noErr']]
            }
        ];
    }
    //仅标记本条
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    //确认按钮
    handleConfirm() {
        this.props.handleConfirm()
    }
    //检查有误/修改错误原因弹框
    handleErrorModal(key) {
        this.props.handleErrorModal(key)
    }
    //检查无误
    handleNoErr() {
        this.props.handleNoErr()
    }
    //返回
    handleBack() {
        this.props.handleBack()
    }
    //保存
    handleSubmit() {
        this.props.handleSubmit()
    }
    //关闭
    handleClosePage() {
        this.props.handleClosePage()
    }
    //待标记页面 结构化人员标注普通数据保存并修改下一条按钮有15秒的等待时间
    handleCountDown() {
        if (this.state.countDown > 0) {
            const countDown = this.state.countDown - 1;
            this.setState({
                countDown
            })
        } else {
            clearInterval(this.state.timer);
            this.setState({
                buttonDisabled: false,
                timer: 0 
            })
        }
    }
    UNSAFE_componentWillReceiveProps(newProps) {
        //如果切换了id 则设置计时器可重新刷新
        if (newProps.id !== this.props.id) {
            clearInterval(this.state.timer);
            this.setState({
                timer: null,
                countDown: null
            })
        }
        //如果收到了type数据且现在计时器可更新则进入判断
        if (this.props.type !== null && (this.state.timer === null)) {

            //如果是在未标记中的 普通数据 需要设置15s后才可以点击保存
            if (this.props.role === 'structure' && this.props.type === 0 && this.props.status === 0) {
                this.setState({
                    buttonDisabled: true,
                    countDown: 15,
                    timer: setInterval(() => {
                        this.handleCountDown()
                    }, 1000)
                },()=>{
                    console.log(this.state)
                })
            }
            //在待标记的初标数据类型时或不在待标记时候 不需要计时
            if ((this.props.type !== 0 && this.props.status === 0) || this.props.status !== 0) {
                this.setState({
                    buttonDisabled: false,
                    countDown: null
                });
            }
        }
    }
    componentWillUnmount(){
        this.setState=()=>false   //不能在组件销毁后设置state，防止出现内存泄漏  (防抖设置定时器)
    }
    render() {
        const { enable, status,associatedStatus,isSendRequest,onlyThis,role} = this.props;
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[status];
        const { countDown } = this.state;
        const disabled = this.state.buttonDisabled || isSendRequest; //当已经发送了请求或特殊处理情况下 按钮不可点击
        const checkButtons = this.checkButtons;
        return (
            <div className="detail-buttonGroup">
                {
                    (() => {
                        switch (role) {
                            case 'structure':
                                return (
                                    <Fragment>
                                        <OnlyMarkButton handleChange={this.handleChange.bind(this)} value={onlyThis}/>
                                        <Button onClick={this.handleSubmit.bind(this)} disabled={disabled}>
                                            {`${buttonText}${(countDown > 0) ? '(' + countDown + 's)' : ''}`}
                                        </Button>
                                    </Fragment>
                                );
                            case 'check':
                                if (enable) {
                                    switch (status) {
                                        case 2:
                                            return <Fragment>{this.checkButtonTextArray[1].btns}</Fragment>;//未检查
                                        case 3:
                                            return <Fragment>{this.checkButtonTextArray[2].btns}</Fragment>;//检查无误
                                        case 4:
                                            return <Fragment>{this.checkButtonTextArray[3].btns}</Fragment>;//检查有误
                                        case 5:
                                            return <Fragment>{this.checkButtonTextArray[4].btns}</Fragment>;//已修改
                                        default:
                                            return null;
                                    }
                                } else {
                                    return (
                                        <Fragment>{this.checkButtonTextArray[0].btns}</Fragment>
                                    )
                                }
                            case 'newpage-check':
                                if (enable) {
                                    switch (associatedStatus) {
                                        case 2:
                                            return <Fragment>{checkButtons['err']} {checkButtons['noErr']}</Fragment>;//未检查
                                        case 3:
                                            return <Fragment>{checkButtons['err']} {checkButtons['close']}</Fragment>;//检查无误
                                        case 4:
                                            return <Fragment>{checkButtons['modify']} {checkButtons['noErr']}</Fragment>;//检查有误
                                        case 5:
                                            return <Fragment>{checkButtons['err']} {checkButtons['noErr']}</Fragment>;//已修改
                                        default:
                                            return null;
                                    }
                                } else {
                                    return (
                                        <Fragment>{this.checkButtonTextArray[0].btns}</Fragment>
                                    )
                                }
                            case 'newpage-other':
                                return (
                                    <Fragment>
                                        {checkButtons['close']}
                                    </Fragment>
                                );
                            default:
                                return (
                                    <Fragment>
                                        {checkButtons['close']}
                                    </Fragment>
                                )
                        }
                    })()
                }
            </div>
        )
    }
}

const OnlyMarkButton = ({handleChange,value}) => {
    const _value  = Boolean(value||false);
    return (
        <div className="buttonGroup-onlyMark">
            <Checkbox onChange={handleChange} name="onlyThis" checked={_value}>仅标记本条</Checkbox>
        </div>
    )
};
export default withRouter(ButtonGroup);
