/** right content for Account manage* */
import React from 'react';
import { Modal, Form, Button, Input } from "antd";
import { handleValidator } from "@/utils/validators";
import '../style.scss'
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span: 3, offset: -1 },
  },
};

class AccountManage extends React.Component {
  //确定
  handleSubmit = () => {
    const { info } = this.props;
    let options = this.props.form.getFieldsValue();
    console.log(info,options)
    this.props.handleSubmit(options, info.id);
  };
  //取消
  handleCancel = () => {
    this.props.handleCancel();
  };
  handleAutoCompletePsw(){
    const account = this.props.form.getFieldValue('mobile')
    let defautlPsw = (account.length>6)?account.substring(account.length-6):account
    this.props.form.setFieldsValue({ password:defautlPsw });
  }
  render() {
    const { visible, action, info } = this.props;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          title="添加检查账号"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          maskClosable
          onCancel={this.handleCancel.bind(this)}
        >
          <Form className="yc-components-accountManagement-addRoleModal" {...formItemLayout}>
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
                action==='add'?
                getFieldDecorator('mobile', {
                  rules: [
                    { required: true, message: "账号不能为空", },
                    { validator: handleValidator }
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: ''
                })(
                  
                    <Input
                      onBlur={this.handleAutoCompletePsw.bind(this)}
                      className="yc-form-input"
                      placeholder="请输入手机号"
                    />
                ):
                <div style={{paddingLeft:5}}>{info.accountNo}</div>
              }
            </Form.Item>
            {action === 'add' ?
              <Form.Item className="yc-form-item" label="密码：">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '请输入密码', },
                    { validator: handleValidator }
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: ''
                })(
                  <Input
                    className="yc-form-input"
                    type="password"
                    placeholder="密码默认为账号后六位"
                    autoComplete="new-password"
                  />,
                )}
              </Form.Item> : ''}

            <div className="yc-modal-footer">
              <Button type="primary" onClick={this.handleSubmit.bind(this)}>确定</Button>
              <Button  onClick={this.handleCancel.bind(this)}>取消</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default accountForm()(AccountManage)
