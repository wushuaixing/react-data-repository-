/** right content for Account manage* */

import React from "react";
import {
  Modal,
  Form,
  Button,
  Select,
  Checkbox,
  Radio,
  Input,
  message,
} from "antd";
import {
  ADD_CHARACTER_LIST,
  AUCTION_DATA_TYPE,
  AUCTION_DEBT_DATA_TYPE,
} from "@/static/status";
import "../style.scss";
const { Option } = Select;
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span: 3, offset: -1 },
  },
};

class AccountManage extends React.Component {
  //确定
  modalOk = (e) => {
    e.preventDefault();
    if (!this.IsNull) {
      message.warning("结构化对象不能为空");
    } else {
      this.props.form.validateFields((err) => {
        if (!err) {
          const { info, action } = this.props;
          let options = this.props.form.getFieldsValue();
          const {
            username,
            password,
            name,
            roleId,
            auctionDataType,
            creditorDataType,
          } = options;
          const params = {
            username,
            password,
            name,
            roleId,
            auctionDataType,
            creditorDataType,
          };
          if (action !== "add") {
            params.username = info.username;
          }
          const structuredObject = [
            options.structure ? "8" : "",
            options.debt ? "26" : "",
            options.backrupt ? "11" : "",
          ];
          params.structuredObject = structuredObject.filter((i) => i);
          params.functionId = structuredObject.filter((i) => i);
          this.props.handleSubmit(params, info.id);
        }
      });
    }
  };
  //取消
  modalCancel = () => {
    this.props.handleCancel();
  };
  findKeyByValue(obj, value) {
    let i = null;
    Object.keys(obj).forEach((key) => {
      if (obj[key] === value) {
        i = parseInt(key);
      }
    });
    return i;
  }
  handleAutoCompletePsw() {
    const account = this.props.form.getFieldValue("username");
    if (/^\d{11}$/.test(account)) {
      let defautlPsw =
        account.length > 6 ? account.substring(account.length - 6) : account;
      this.props.form.setFieldsValue({ password: defautlPsw });
    }
  }

  get IsNull() {
    const {
      form: { getFieldsValue },
    } = this.props;
    let options = getFieldsValue(["structure", "debt", "backrupt"]);
    const isChecked = Object.keys(options).some((i) => options[i]);
    return isChecked;
  }

  render() {
    const { visible, info, action } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const deFunctionId = [
      /资产拍卖数据/.test(info.structuredObject),
      /拍卖债权数据/.test(info.structuredObject),
      /破产重组数据/.test(info.structuredObject),
    ];
    const footer = (
      <div className="yc-modal-footer">
        <Button onClick={this.modalCancel.bind(this)}>取消</Button>
        <Button
          type="primary"
          htmlType="submit"
          onMouseDown={this.modalOk.bind(this)}
        >
          确定
        </Button>
      </div>
    );
    return (
      <div>
        <Modal
          width={524}
          title={action === "add" ? "添加结构化账号" : "编辑"}
          visible={visible}
          destroyOnClose={true}
          footer={footer}
          onCancel={this.modalCancel.bind(this)}
          maskClosable
          className="yc-accountManagement-addRoleModal"
        >
          <Form
            className="yc-components-accountManagement-addRoleModal"
            {...formItemLayout}
          >
            <Form.Item className="yc-form-item" label="角色：">
              {getFieldDecorator("roleId", {
                rules: [{ required: true, message: "请选择角色" }],
                initialValue:
                  action === "add"
                    ? 0
                    : this.findKeyByValue(ADD_CHARACTER_LIST, info.role),
              })(
                <Select style={{ width: 121 }} transfer>
                  {Object.keys(ADD_CHARACTER_LIST).map((key) => {
                    return (
                      <Option value={parseInt(key)} key={key}>
                        {ADD_CHARACTER_LIST[key]}
                      </Option>
                    );
                  })}
                </Select>
              )}
            </Form.Item>
            <Form.Item className="yc-form-item" label="姓名：">
              {getFieldDecorator("name", {
                rules: [
                  { required: true, message: "名字不可为空" },
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
                initialValue: action === "add" ? "" : info.name,
              })(
                <Input
                  className="yc-form-input"
                  placeholder="请输入姓名"
                  autoComplete="off"
                />
              )}
            </Form.Item>
            {action === "add" ? (
              <Form.Item className="yc-form-item" label="账号：">
                {getFieldDecorator("username", {
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
                    onBlur={this.handleAutoCompletePsw.bind(this)}
                    className="yc-form-input"
                    placeholder="请输入手机号"
                    autoComplete="off"
                  />
                )}
              </Form.Item>
            ) : (
              <Form.Item
                className=" yc-form-item-edit yc-form-item "
                label="账号："
                required={true}
              >
                <p
                  style={{
                    lineHeight: 3,
                    fontSize: 12,
                    marginTop: 2,
                    color: "rgba(0, 0, 0, 0.85)",
                  }}
                >
                  {info.username}
                </p>
              </Form.Item>
            )}
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
                  validateTrigger: "onBlur",
                  initialValue: "",
                })(
                  <Input
                    className="yc-form-input"
                    placeholder="密码默认为账号后六位"
                    autoComplete="new-password"
                  />
                )}
              </Form.Item>
            ) : (
              ""
            )}
            <div className="object-content">
              <p style={{ marginLeft: 3, color: "rgba(0, 0, 0, 0.85)" }}>
                结构化对象:
              </p>
              <div className="structureObject">
                <Form.Item className="structure-object-checkbox">
                  {getFieldDecorator("structure", {
                    valuePropName: "checked",
                    initialValue: action === "add" ? false : deFunctionId[0], //添加时checked为false  编辑时代入值 deFunctionId数组为三个复选框的值
                  })(<Checkbox>资产拍卖数据</Checkbox>)}
                </Form.Item>
                {getFieldValue("structure") ? (
                  <Form.Item label="数据类型:" className="form-col-temp">
                    {getFieldDecorator("auctionDataType", {
                      rules: [{ required: true, message: "数据类型不能为空" }],
                      initialValue:
                        action === "add" || info.auctionDataType === -1
                          ? 0
                          : info.auctionDataType, //添加时radio 为false  编辑时代入值
                    })(
                      <Radio.Group
                        style={{ marginLeft: 5, display: "inline-block" }}
                      >
                        {Object.keys(AUCTION_DATA_TYPE).map((key) => (
                          <Radio value={parseInt(key)} key={key}>
                            {AUCTION_DATA_TYPE[key]}
                          </Radio>
                        ))}
                      </Radio.Group>
                    )}
                  </Form.Item>
                ) : null}

                <Form.Item className="structure-object-checkbox">
                  {getFieldDecorator("debt", {
                    valuePropName: "checked",
                    initialValue: action === "add" ? false : deFunctionId[1],
                  })(<Checkbox>拍卖债权数据</Checkbox>)}
                </Form.Item>
                {getFieldValue("debt") ? (
                  <Form.Item label="数据类型:" className="form-col-temp">
                    {getFieldDecorator("creditorDataType", {
                      rules: [{ required: true, message: "数据类型不能为空" }],
                      initialValue:
                        action === "add" || info.creditorDataType === -1
                          ? 0
                          : info.creditorDataType,
                    })(
                      <Radio.Group
                        style={{ marginLeft: 5, display: "inline-block" }}
                      >
                        {Object.keys(AUCTION_DEBT_DATA_TYPE).map((key) => (
                          <Radio value={parseInt(key)} key={key}>
                            {AUCTION_DEBT_DATA_TYPE[key]}
                          </Radio>
                        ))}
                      </Radio.Group>
                    )}
                  </Form.Item>
                ) : null}
                <Form.Item className="structure-object-checkbox">
                  {getFieldDecorator("backrupt", {
                    valuePropName: "checked",
                    initialValue: action === "add" ? false : deFunctionId[2],
                  })(<Checkbox>破产重组数据</Checkbox>)}
                </Form.Item>
              </div>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}

export default accountForm()(AccountManage);
