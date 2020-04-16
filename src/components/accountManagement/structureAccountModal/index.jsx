/** right content for Account manage* */
import React from 'react';
import { Modal, Form, Button, Select, Checkbox, Radio, Input } from "antd";
import { handleValidator } from "../../../utils/validators";
import {HotDotBeforeFormItem} from '../../common'
import '../style.scss'
const { Option } = Select;
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
      characterList: [
        {
          value: 1,
          label: "正式"
        },
        {
          value: 0,
          label: "试用"
        }
      ],
      structureList: ["资产结构化", "破产重组结构化"],
      auctionDataTypeList: ["非初标数据", "普通数据", "相似数据"],
      auctionDataTypeData: {
        '非初标数据': 3,
        '普通数据': 1,
        '相似数据': 2
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible, action, info } = nextProps;
    // console.log(nextProps,'next');
    this.setState({
      visible: visible,
      action: action,
      info: info,
    });
  }
  //确定
  modalOk = () => {
    const { info, action } = this.state;
    let options = this.props.form.getFieldsValue();
    console.log(options, 'options');
    if (action === 'add') {
      options.structuredObject = [8];
    }
    else {
      options.functionId = [8];
      options.username = info.username;
    }
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

  //编辑账号-返回信息是字符串
  filterRoleId = (label) => {
    if (label === "试用") {
      return 0
    }
    else { return 1 }
  };
  filterDataType = (label) => {
    if (label === "非初标数据") {
      return 0
    } else if (label === "普通数据") {
      return 1
    }
    else { return 2 }
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
    const { visible, characterList, structureList, initialPsw, action, info } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Modal
          style={{ width: 387 }}
          title="添加结构化账号"
          visible={visible}
          destroyOnClose={true}
          footer={null}
          onCancel={this.modalCancel}
          maskClosable
        >
          <Form className="yc-components-accountManagement-addRoleModal" {...formItemLayout}>
            <Form.Item className="yc-form-item" label="角色：" >
              {getFieldDecorator('roleId', {
                rules: [
                  { required: true, message: "请选择角色", },
                ],
                initialValue: action === 'add' ? 0 : this.filterRoleId(info.role)
              })(
                <Select style={{ width: 70, marginLeft: 4 }} transfer>
                  {
                    characterList && characterList.map((item) => {
                      return (
                        <Option
                          value={item.value}
                          key={item.value}
                        >
                          {item.label}
                        </Option>
                      );
                    })
                  }
                </Select>
              )}
            </Form.Item>
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
                getFieldDecorator('username', {
                  rules: [
                    { required: true, message: "手机号不能为空", },
                    { validator: handleValidator }
                  ],
                  validateTrigger: 'onBlur',
                  initialValue: ''
                })(
                  action === 'add'
                    ?
                    <Input
                      className="yc-form-input"
                      placeholder="请输入手机号"
                    />
                    : <p
                      style={{ lineHeight: 3, fontSize: 12, marginLeft: 6, marginTop: 2, color: 'rgba(0, 0, 0, 0.85)' }}>
                      {info.username}</p>
                )}
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
                    initialvalue={initialPsw}
                    type="password"
                    placeholder="密码默认为账号后六位"
                    autoComplete="new-password"
                  />,
                )}
              </Form.Item> : ''}
            <div>
              <div className="yc-form-item" >
                <HotDotBeforeFormItem left={0} />
              </div>
              <p style={{ marginLeft: 18, color: 'rgba(0, 0, 0, 0.85)' }}>结构化对象:</p>
              <div className="structureObject" style={{ marginLeft: 18 }}>
                <div>
                  <Checkbox.Group
                    options={structureList}
                    defaultValue={["资产结构化"]}
                    disabled
                  >
                  </Checkbox.Group>
                  <p className="structureObject-dataType" style={{ marginLeft: 6, color: 'rgba(0, 0, 0, 0.85)' }}>数据类型:</p>
                  <HotDotBeforeFormItem left={20} top={75} />
                </div>
                <Form.Item>
                  {getFieldDecorator('auctionDataType', {
                    rules: [
                      { required: true },
                    ],
                    initialValue: action === 'add' ? '' : this.filterDataType(info.dataType)
                  })(
                    <Radio.Group
                      style={{ marginLeft: 5, display: 'inline-block' }}
                    >
                      <Radio value={0}>非初标数据</Radio>
                      <Radio value={1}>普通数据</Radio>
                      <Radio value={2}>相似数据</Radio>
                    </Radio.Group>,
                  )}
                </Form.Item>
              </div>
            </div>
            <div className="yc-modal-footer">
              <Button type="primary" onClick={this.modalOk}>确定</Button>
              <Button onClick={this.modalCancel}>取消</Button>
            </div>
          </Form>
        </Modal>
      </div>
    );
  }
}
export default accountForm()(AccountManage)
