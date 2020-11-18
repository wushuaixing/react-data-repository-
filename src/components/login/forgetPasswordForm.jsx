import React from "react";
import { Form, Input, Button, Tooltip, message, Modal } from "antd";
import {
  codeImage,
  validateImgCode,
  validSmsCode,
  resetPassword,
  getSmsCode,
} from "@api";
import { twoNewPasswordValidator, validPhoneNumber } from "@/utils/validators";
import iconUserName from "../../assets/img/icon_username.png";
import iconCode from "../../assets/img/icon_verificationcode.png";
import iconTel from "../../assets/img/tel.png";

import "./style.scss";
const forgetPasswordForm = Form.create;
const { info } = Modal;
class ForgetPasswordForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      wait: 0,
      countDown: 0,
      timer: null,
      isSendPhoneCode: false,
      usernameValid: false, //手机号是否合法
      username: "", //验证的手机号
      codeImgSrc: "", //图片验证码
    };
  }
  get phoneDisableTextVisible() {
    return this.state.step === 1;
  }
  get getPhoneCodeButtonDisabled() {
    return !(this.state.usernameValid && this.state.step === 1);
  }
  get formTitle() {
    switch (this.state.step) {
      case 0:
        return "账号验证";
      case 1:
        return "手机号验证";
      case 2:
        return "重置密码";
      default:
        return null;
    }
  }
  componentDidMount() {
    this.toRefreshImg();
  }
  refreshTime() {
    let coutnDown = this.state.countDown;
    if (coutnDown > 0) {
      this.setState({
        countDown: --coutnDown,
      });
    } else {
      clearInterval(this.state.timer);
      this.setState({
        timer: null,
        isSendPhoneCode: false,
      });
    }
  }
  componentWillUnmount() {
    this.state.timer && clearInterval(this.state.timer);
  }
  toRefreshImg = () => {
    codeImage().then((res) => {
      if (res.data.code === 200) {
        this.setState({
          codeImgSrc: res.data.data,
        });
      } else {
        message.error(res.data.message);
      }
    });
  };
  toRefreshPhoneCode() {
    getSmsCode({ username: this.state.username }).then(() => {
      this.setState({
        isSendPhoneCode: true,
        timer: setInterval(this.refreshTime.bind(this), 1000),
        countDown: 60,
      });
    });
  }
  handleSubmit() {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const step = this.state.step;
        this.handleRequest(step, values);
      }
    });
  }
  handleRequest(step, formValues) {
    if (step === 0) {
      validateImgCode(formValues).then((res) => {
        if (res.data.code === 200) {
          message.success("验证成功");
          const usernameValid = validPhoneNumber(formValues.username);
          setTimeout(() => {
            this.setState(
              {
                step: ++step,
                username: formValues.username,
                usernameValid,
              },
              () => {
                this.props.form.resetFields(); //重置表格
                this.props.form.setFields({
                  username: {
                    value: this.state.username,
                    errors: this.state.usernameValid
                      ? null
                      : [new Error("手机号格式不正确,手机号不可用?")],
                  },
                });
                /* this.toRefreshPhoneCode() */
              }
            );
          }, 1000);
        } else {
          message.error(res.data.message);
          this.toRefreshImg();
        }
      });
    } else if (step === 1) {
      validSmsCode(formValues).then((res) => {
        if (res.data.code === 200) {
          message.success("验证成功");
          this.state.timer && clearInterval(this.state.timer);
          setTimeout(() => {
            this.setState(
              {
                step: ++step,
                isSendPhoneCode: false,
                timer: null,
              },
              () => {
                this.props.form.resetFields();
              }
            );
          }, 1000);
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      formValues.username = this.state.username;
      resetPassword(formValues).then((res) => {
        if (res.data.code === 200) {
          message.success("重置成功");
          setTimeout(() => {
            this.props.resetPasswordSuccess();
          }, 1000);
        } else {
          message.error(res.data.message);
        }
      });
    }
  }
  openDisabledPhoneModal() {
    info({
      content: "请在钉钉群内联系管理员，告知需要重置密码的账户的账号和姓名",
      okText: "我知道了",
    });
  }
  handlePasswordTipVisible(status) {
    this.setState({
      passwordTipVisible: status,
    });
  }
  handleBackForm() {
    let { step } = this.state;
    this.props.form.resetFields();
    this.setState(
      {
        step: --step,
        usernameValid: false,
        isSendPhoneCode: false,
        countDown: 0,
      },
      () => {
        this.toRefreshImg();
      }
    );
  }
  render() {
    const { codeImgSrc, step } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="yc-right-login-noCode" style={{ height: 360 }}>
        <div className="yc-form-title">{this.formTitle}</div>
        <Form className="login-form">
          {step === 0 && (
            <div>
              <Form.Item>
                {getFieldDecorator("username", {
                  rules: [
                    { required: true, whitespace: true, message: "请输入账号" },
                    { len: 11, message: "账号小于11位" },
                  ],
                  getValueFromEvent(event) {
                    return event.target.value.replace(/\D/g, "");
                  },
                  validateTrigger: ["onSubmit", "onBlur"],
                })(
                  <Input
                    maxLength={11}
                    className="yc-input"
                    autoComplete="off"
                    // prefix={<Icon type="user" style={{ color: this.state.iconColor }} />}
                    prefix={
                      <img
                        src={iconUserName}
                        style={{ marginRight: 10 }}
                        alt=""
                      />
                    }
                    placeholder="请输入11位账号"
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("code", {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入图片验证码",
                    },
                  ],
                  getValueFromEvent(event) {
                    return event.target.value.replace(/\s/g, "");
                  },
                  validateTrigger: ["onSubmit", "onBlur"],
                })(
                  <Input
                    style={{ position: "relative" }}
                    className="yc-input"
                    autoComplete="off"
                    // prefix={<Icon type="check-circle" style={{ color: this.state.iconColor }} />}
                    prefix={
                      <img src={iconCode} style={{ marginRight: 10 }} alt="" />
                    }
                    placeholder="请输入图片验证码"
                  />
                )}
                <span onClick={this.toRefreshImg.bind(this)}>
                  <img
                    src={codeImgSrc}
                    style={{
                      width: 140,
                      height: 40,
                      marginLeft: 5,
                      position: "absolute",
                      right: 0,
                      top: -10,
                    }}
                    alt=""
                  />
                </span>
              </Form.Item>
            </div>
          )}
          {step === 1 && (
            <div>
              <Form.Item>
                {/*  <Icon type="mobile" style={{ marginLeft: 9 }} />
                                <span style={{ marginLeft: 6, display: 'inline-block', width: 164 }}>{this.state.username}</span> */}
                {getFieldDecorator("username", {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入验证码",
                    },
                  ],
                  validateTrigger: ["onSubmit", "onBlur"],
                })(
                  <Input
                    disabled
                    suffix={
                      <span>
                        {this.state.isSendPhoneCode ? (
                          <Button
                            type="primary"
                            disabled
                            className="login-getCode_Button without-extra-node "
                          >{`${this.state.countDown}s后可再次获取`}</Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={this.toRefreshPhoneCode.bind(this)}
                            className="login-getCode_Button"
                            disabled={this.getPhoneCodeButtonDisabled}
                          >
                            获取验证码
                          </Button>
                        )}
                      </span>
                    }
                    autoComplete="off"
                    className="yc-input yc-input-noborder"
                    prefix={
                      <img src={iconTel} style={{ marginRight: 10 }} alt="" />
                    }
                  />
                )}
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("code", {
                  rules: [
                    {
                      required: true,
                      whitespace: true,
                      message: "请输入验证码",
                    },
                  ],
                  getValueFromEvent(event) {
                    return event.target.value.replace(/\s/g, "");
                  },
                  validateTrigger: ["onSubmit", "onBlur"],
                })(
                  <Input
                    autoComplete="off"
                    className="yc-input"
                    prefix={
                      <img src={iconCode} style={{ marginRight: 10 }} alt="" />
                    }
                    placeholder="请输入手机验证码"
                  />
                )}
              </Form.Item>
            </div>
          )}
          {step === 2 && (
            <div>
              <Form.Item>
                <Tooltip
                  placement="top"
                  title={"长度6-20位字符，不支持空格"}
                  visible={this.state.passwordTipVisible}
                >
                  <span
                    onMouseOver={this.handlePasswordTipVisible.bind(this, true)}
                    onMouseLeave={this.handlePasswordTipVisible.bind(
                      this,
                      false
                    )}
                  >
                    {getFieldDecorator("password", {
                      rules: [
                        {
                          required: true,
                          whitespace: true,
                          message: "新密码不能为空",
                        },
                        { min: 6, message: "密码小于6位" },
                      ],
                      getValueFromEvent(event) {
                        return event.target.value.replace(
                          /[\s|\u4e00-\u9fa5]/g,
                          ""
                        );
                      },
                      validateFirst: true,
                      validateTrigger: ["onSubmit", "onBlur", "onChange"],
                    })(
                      <Input
                        maxLength={20}
                        onFocus={this.handlePasswordTipVisible.bind(
                          this,
                          false
                        )}
                        className="yc-input"
                        placeholder="请输入新密码"
                      />
                    )}
                  </span>
                </Tooltip>
              </Form.Item>
              <Form.Item>
                {getFieldDecorator("confirmPassword", {
                  rules: [{ validator: twoNewPasswordValidator.bind(this) }],
                  getValueFromEvent(event) {
                    return event.target.value.replace(
                      /[\s|\u4e00-\u9fa5]/g,
                      ""
                    );
                  },
                  validateFirst: true,
                  validateTrigger: ["onSubmit", "onBlur", "onChange"],
                })(
                  <Input
                    maxLength={20}
                    className="yc-input"
                    placeholder="再次输入新密码"
                    autoComplete="new-password"
                  />
                )}
              </Form.Item>
            </div>
          )}
          <Form.Item style={{ marginTop: -25 }}>
            <a
              className="yc-forget"
              onClick={this.openDisabledPhoneModal}
              style={{
                marginLeft: 240,
                marginBottom: 8,
                visibility: this.phoneDisableTextVisible ? "visible" : "hidden",
              }}
            >
              手机号不可用?
            </a>
            <Button
              disabled={!this.state.usernameValid && step === 1}
              type="primary"
              htmlType="submit"
              className="yc-login-button"
              style={{ marginTop: -20 }}
              onMouseDown={this.handleSubmit.bind(this)}
            >
              {this.state.step !== 2 ? "下一步" : "确定"}
            </Button>
            {step === 1 ? (
              <a
                className="yc-forget"
                onClick={this.handleBackForm.bind(this)}
                style={{ marginLeft: 5 }}
              >
                上一页
              </a>
            ) : null}
            <a
              className="yc-forget"
              onClick={this.props.handleSwitchBack}
              style={{ marginLeft: step === 1 ? 225 : 265 }}
            >
              返回登录
            </a>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default forgetPasswordForm()(ForgetPasswordForm);
