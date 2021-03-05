/** right content for Account manage* */
import React from "react";
import { Modal, Form, Button, Input } from "antd";
import "../style.scss";
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span: 3, offset: -1 },
  },
};

class AccountManage extends React.Component {
  //确定
  handleSubmit = (e) => {
    e.preventDefault();
    const { info } = this.props;
    let options = this.props.form.getFieldsValue();
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.handleSubmit(options, info.id);
      }
    });
  };
  //取消
  handleCancel = () => {
    this.props.handleCancel();
  };
  handleAutoCompletePsw() {
    const account = this.props.form.getFieldValue("mobile");
    if (/^\d{11}$/.test(account)) {
      let defautlPsw =
        account.length > 6 ? account.substring(account.length - 6) : account;
      this.props.form.setFieldsValue({ password: defautlPsw });
    }
  }
  render() {
    const { visible, action, info } = this.props;
    const { getFieldDecorator } = this.props.form;
    const footer = (
      <div className="yc-modal-footer">
        <Button onClick={this.handleCancel.bind(this)}>取消</Button>
        <Button
          type="primary"
          onMouseDown={this.handleSubmit.bind(this)}
          htmlType="submit"
        >
          确定
        </Button>
      </div>
    );
    return (
      <div>
        <Modal
          title={action === "add" ? "添加检查账号" : "编辑"}
          visible={visible}
          destroyOnClose={true}
          footer={footer}
          maskClosable
          width={500}
          className="ant-explain-change"
          onCancel={this.handleCancel.bind(this)}
        >
          <Form
            className="yc-components-accountManagement-addRoleModal"
            {...formItemLayout}
          >
            <Form.Item className="yc-form-item" label="姓名：">
              {getFieldDecorator("name", {
                rules: [
                  { required: true, message: "姓名不能为空" },
                  { max: 20, message: "姓名最大长度为20个字符" },
                  {
                    pattern: /^[\u4e00-\u9fa5a-zA-Z\d]+$/,
                    message: "姓名不可包含空格等特殊字符",
                  },
                ],
                getValueFromEvent(event) {
                  return event.target.value.replace(/\s/g, "");
                },
                validateTrigger: "onBlur",
                initialValue: action === "edit" ? info.name : "",
              })(
                <Input
                  autoComplete="off"
                  className="yc-form-input"
                  placeholder="请输入姓名"
                />
              )}
            </Form.Item>
            <Form.Item className="yc-form-item" label="账号：">
              {action === "add" ? (
                getFieldDecorator("mobile", {
                  rules: [
                    { required: true, message: "账号不能为空" },
                    {
                      pattern: /^\d{11}$/,
                      message: "账户格式不正确，需为11位手机号码",
                    },
                  ],
                  validateTrigger: "onBlur",
                  initialValue: "",
                })(
                  <Input
                    autoComplete="off"
                    onBlur={this.handleAutoCompletePsw.bind(this)}
                    className="yc-form-input"
                    placeholder="请输入手机号"
                  />
                )
              ) : (
                <div style={{ paddingLeft: 5 }}>{info.accountNo}</div>
              )}
            </Form.Item>
            {action === "add" ? (
              <Form.Item className="yc-form-item" label="密码：">
                {getFieldDecorator("password", {
                  rules: [
                    { required: true, message: "密码不可为空" },
                    { max: 20, min: 6, message: "密码长度应为6-20位" },
                  ],
                  getValueFromEvent(event) {
                    return event.target.value.replace(
                      /[\s|\u4e00-\u9fa5]/g,
                      ""
                    );
                  },
                  validateTrigger: ["onBlur", "onSubmit"],
                  initialValue: "",
                })(
                  <Input
                    className="yc-form-input"
                    type="password"
                    placeholder="密码默认为账号后六位"
                  />
                )}
              </Form.Item>
            ) : (
              ""
            )}
          </Form>
        </Modal>
      </div>
    );
  }
}
export default accountForm()(AccountManage);
