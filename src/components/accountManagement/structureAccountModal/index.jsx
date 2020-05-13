/** right content for Account manage* */
import React from 'react';
import { Modal, Form, Button, Select, Checkbox, Radio, Input } from "antd";
import { HotDotBeforeFormItem } from '@commonComponents'
import { ADD_CHARACTER_LIST, AUCTION_DATA_TYPE } from '@/static/status'
import '../style.scss'
const { Option } = Select;
const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span: 3, offset: -1 },
  },
};
const structureList = ["资产", /* "破产重组结构化" */]
class AccountManage extends React.Component {
  //确定
  modalOk = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const { info, action } = this.props;
        let options = this.props.form.getFieldsValue();
        if (action === 'add') {
          options.structuredObject = [8];
        }
        else {
          options.functionId = [8];
          options.username = info.username;
        }
        this.props.handleSubmit(options, info.id);
      }
    });
  };
  //取消
  modalCancel = () => {
    this.props.handleCancel();
  };
  findKeyByValue(obj, value) {
    let i = null;
    Object.keys(obj).forEach((key, index) => {
      if (obj[key] === value) {
        i = parseInt(key)
      }
    })
    return i;
  }
  handleAutoCompletePsw() {
    const account = this.props.form.getFieldValue('username')
    if (/^\d{11}$/.test(account)) {
      let defautlPsw = (account.length > 6) ? account.substring(account.length - 6) : account
      this.props.form.setFieldsValue({ password: defautlPsw });
    }
  }
  render() {
    const { visible, info, action } = this.props
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          style={{ width: 387 }}
          title="添加结构化账号"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          onCancel={this.modalCancel.bind(this)}
          maskClosable
        >
          <Form className="yc-components-accountManagement-addRoleModal" {...formItemLayout} onSubmit={this.modalOk.bind(this)}>
            <Form.Item className="yc-form-item" label="角色：" >
              {getFieldDecorator('roleId', {
                rules: [
                  { required: true, message: "请选择角色", },
                ],
                initialValue: action === 'add' ? 0 : this.findKeyByValue(ADD_CHARACTER_LIST, info.role)
              })(
                <Select style={{ width: 70, marginLeft: 4 }} transfer>
                  {
                    Object.keys(ADD_CHARACTER_LIST).map((key) => {
                      return (
                        <Option value={parseInt(key)} key={key}>
                          {ADD_CHARACTER_LIST[key]}
                        </Option>
                      )
                    })
                  }
                </Select>
              )}
            </Form.Item>
            <Form.Item className="yc-form-item" label="姓名：">
              {getFieldDecorator('name', {
                rules: [
                  { required: true, message: "名字不可为空" },
                  { max: 20, message: '姓名最大长度为20个字符' }
                ],
                validateTrigger: 'onBlur',
                initialValue: action === 'add' ? '' : info.name
              })(
                <Input
                  className="yc-form-input"
                  placeholder="请输入姓名"
                />,
              )}
            </Form.Item>
            {
              action === 'add' ?
                <Form.Item className="yc-form-item" label="账号:">
                  {
                    getFieldDecorator('username', {
                      rules: [
                        { required: true, message: "账号不能为空", },
                        { pattern: /^\d{11}$/, message: '账户格式不正确，需为11位手机号码' }
                      ],
                      validateTrigger: 'onBlur',
                      initialValue: ''
                    })(
                      <Input
                        onBlur={this.handleAutoCompletePsw.bind(this)}
                        className="yc-form-input"
                        placeholder="请输入手机号"
                      />
                    )}
                </Form.Item> :
                <Form.Item className="yc-form-item" label="账号:" required={true}>
                  <p
                    style={{ lineHeight: 3, fontSize: 12, marginLeft: 6, marginTop: 2, color: 'rgba(0, 0, 0, 0.85)' }}>
                    {info.username}</p>
                </Form.Item>
            }
            {action === 'add' ?
              <Form.Item className="yc-form-item" label="密码：">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: '密码不可为空', },
                    { max: 20, min: 6, message: '密码长度应为6-20位' }
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
            <div>
              <p style={{ marginLeft: 18, color: 'rgba(0, 0, 0, 0.85)' }}>结构化对象:</p>
              <div className="structureObject" style={{ marginLeft: 18 }}>
                <div>
                  <Checkbox.Group
                    options={structureList}
                    defaultValue={["资产"]}
                    disabled
                  >
                  </Checkbox.Group>
                  <p className="structureObject-dataType" style={{ marginLeft: 6, color: 'rgba(0, 0, 0, 0.85)' }}>数据类型:</p>
                  <HotDotBeforeFormItem left={20} top={55} />
                </div>
                <Form.Item>
                  {getFieldDecorator('auctionDataType', {
                    rules: [
                      { required: true, message: '数据类型不能为空' }
                    ],
                    initialValue: action === 'add' ? '' : this.findKeyByValue(AUCTION_DATA_TYPE, info.dataType)
                  })(
                    <Radio.Group style={{ marginLeft: 5, display: 'inline-block' }}>
                      {
                        Object.keys(AUCTION_DATA_TYPE).map(key => {
                          return (
                            <Radio value={parseInt(key)} key={key}>
                              {AUCTION_DATA_TYPE[key]}
                            </Radio>
                          )
                        })
                      }
                    </Radio.Group>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="yc-modal-footer">
              <Button type="primary" htmlType="submit">确定</Button>
              <Button onClick={this.modalCancel.bind(this)}>取消</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default accountForm()(AccountManage)
