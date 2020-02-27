/** right content for Account manage* */
import React from 'react';
import { Modal, Form, } from "antd";
import Button from "antd/es/button";
import Input from "antd/es/input";
import 'antd/dist/antd.css';
import './style.scss';

const accountForm = Form.create;
const formItemLayout = {
  labelCol: {
    sm: { span:3,offset:-1 },
  },
};

class AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      action:'add',
      visible:false,
      initialPsw:'',
      info:{},
		};
  }

  componentWillReceiveProps(nextProps){
    const {visible,action,info}=nextProps;
    this.setState({
      visible:visible,
      action:action,
      info:info,
    });
  }
//确定
  modalOk=()=>{
    const {info}=this.state;
    let options=this.props.form.getFieldsValue();
    this.setState({
      visible: false,
    });
    this.props.ok(options,info.id);
  };
//取消
  modalCancel=()=>{
    this.setState({
      visible: false,
    });
    this.props.cancel(false);
  };

  //验证账号密码-输入框格式
  handleValidator = (rule, val, callback) => {
    if (rule.field === "name") {
      if(!val){
        callback('');
      }
      else if (val.length > 20) {
        callback("姓名最大长度为20个字符");
      }
    }
    if (rule.field === "username") {
      if(!val){
        callback('');
      }
      else if (!val.match(/^\d{11}$/)) {
        callback("请输入11位数字");
      }
      else{
        this.setPwd(val);
      }
    }
    if (rule.field === "password") {
      if(!val){
        callback('');
      }
      else if (val.length > 20 || val.length < 6) {
        callback('密码长度为6-20位');
      }
    }
  };

  setPwd=(val)=> {
    let password=val.substring(
      5,
      val.length
    );
    this.setState({
      initialPsw:password
    });
  };

  render() {
      const {visible,initialPsw,action,info}=this.state;
      const { getFieldDecorator } = this.props.form;
    return(
          <div>
              <Modal
                style={{width:387}}
                title="添加检查账号"
                visible={visible}
                destroyOnClose={true}
                footer={null}
                maskClosable
                onCancel={this.modalCancel}
              >
                <Form className="add-userView-modal" style={{width:387}} {...formItemLayout}>
                  <Form.Item className="part" label="姓名：">
                    {getFieldDecorator('name', {
                      rules:[
                        { required: true, message: "姓名不能为空", },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                      initialValue: action==='edit' ? info.name : ''
                    })(
                      <Input
                        style={{marginLeft: 4,width: 260,height: 32 }}
                        className="yc-input"
                        placeholder="请输入姓名"
                      />,
                    )}
                  </Form.Item>
                  <Form.Item className="part" label="账号:">
                    {
                      getFieldDecorator('mobile', {
                      rules:[
                        { required: true, message: "手机号不能为空", },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                      initialValue:''
                    })(
                        action==='add'
                          ?
                            <Input
                              style={{marginLeft: 4,width: 260,height: 32 }}
                              className="yc-input"
                              placeholder="请输入手机号"
                            />
                          : <p
                            style={{lineHeight: 3,fontSize:12,marginLeft:6,marginTop:2,color:'rgba(0, 0, 0, 0.85)'}}>
                            {info.accountNo}</p>
                    )}
                  </Form.Item>
                  {action==='add' ?
                    <Form.Item className="part" label="密码：">
                    {getFieldDecorator('passwd', {
                      rules:[
                        { required: true, message: '请输入密码', },
                        { validator: this.handleValidator }
                      ],
                      validateTrigger:'onBlur',
                      initialValue:''
                    })(
                      <Input
                        className="yc-input"
                        initialvalue={initialPsw}
                        type="password"
                        style={{marginLeft: 4,width: 260,height: 32}}
                        placeholder="密码默认为账号后六位"
                        autoComplete="new-password"
                      />,
                    )}
                  </Form.Item> :''}

                  <div className="footer" style={{marginLeft:-45}}>
                    <Button type="primary" style={{backgroundColor:'#0099CC',fontSize:16}} onClick={this.modalOk}>确定</Button>
                    <Button style={{color:'#293038',fontSize:16}} onClick={this.modalCancel}>取消</Button>
                  </div>
                </Form>
              </Modal>
          </div>
        );
    }
}
export default accountForm()(AccountManage)
