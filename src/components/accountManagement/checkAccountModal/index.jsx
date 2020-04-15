/** right content for Account manage* */
import React from 'react';
import { Modal, Form, Button, Input } from "antd";
import { handleValidator } from "../../../utils/validators";
import '../style.scss'
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span: 3, offset: -1 },
  },
};

class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action: 'add',
      visible: false,
      initialPsw: '',
      info: {},
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, action, info } = nextProps;
    this.setState({
      visible: visible,
      action: action,
      info: info,
    });
  }
  //确定
  modalOk = () => {
    const { info } = this.state;
    let options = this.props.form.getFieldsValue();
    this.setState({
      visible: false,
    });
    this.props.ok(options, info.id);
  };
  //取消
  modalCancel = () => {
    this.setState({
      visible: false,
    });
    this.props.cancel(false);
  };

  setPwd = (val) => {
    let password = val.substring(
      5,
      val.length
    );
    this.setState({
      initialPsw: password
    });
  };

  render() {
    const { visible, initialPsw, action, info } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="添加检查账号"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          maskClosable
          onCancel={this.modalCancel}
        >
          <Form className="add-userView-modal" {...formItemLayout}>
            <Form.Item className="yc-form-item" label="姓名：">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: "姓名不能为空", },
                  { validator: handleValidator }
                ],
                validateTrigger: 'onBlur',
                initialValue: action === 'edit' ? info.name : ''
              })(
                <Input
                  className="yc-form-input"
                  placeholder="请输入姓名"
                />,
              )}
            </Form.Item>
            <Form.Item className="yc-form-item" label="账号:">
              {
                getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: "手机号不能为空", },
                    { validator: handleValidator }
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: ''
                })(
                  action === 'add' ?
                    <Input
                      className="yc-form-input"
                      placeholder="请输入手机号"
                    />
                    : <p>{info.accountNo}</p>
                )}
            </Form.Item>
            {action === 'add' ?
              <Form.Item className="yc-form-item" label="密码：">
                {getFieldDecorator('passwd', {
                  rules: [
                    { required: true, message: '请输入密码', },
                    { validator: handleValidator }
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: ''
                })(
                  <Input
                    className="yc-form-input"
                    initialvalue={initialPsw}
                    type="password"
                    placeholder="密码默认为账号后六位"
                    autoComplete="new-password"
                  />,
                )}
              </Form.Item> : ''}

            <div className="yc-modal-footer">
              <Button type="primary" onClick={this.modalOk}>确定</Button>
              <Button  onClick={this.modalCancel}>取消</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default accountForm()(AccountManage)
