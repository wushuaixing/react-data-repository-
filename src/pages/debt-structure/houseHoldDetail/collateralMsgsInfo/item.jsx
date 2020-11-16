import React, { Component } from "react";
import { HAS_TYPE, USE_TYPE } from "../../common/type";
import { Input, Select, Button, Form } from "antd";
const { Option } = Select;
class Item extends Component {
  constructor() {
    super();
    this.state = {
      isRoleChange: false,
    };
  }

  //删除
  handleDel = (index) => {
    this.props.handleRowDel(index);
  };

  //失焦后保存信息
  save = () => {
    const {
      form: { validateFields },
      index,
    } = this.props;
    validateFields((error, values) => {
      if (error) return;
      this.props.handleSave(values, index);
    });
  };

  //重置内容
  handleReset = (index) => {
    this.props.handleRowReset(index);
    this.props.form.resetFields();
  };

  //置空所有人信息
  UNSAFE_componentWillReceiveProps(props) {
    const {
      form: { setFieldsValue },
      isChange,
    } = props;
    if (this.state.isChange !== isChange) {
      this.setState({
        isChange,
      });
      setFieldsValue({ owner: [] });
    }
  }

  render() {
    const {
      msgsList: {
        name,
        type,
        useType,
        landArea,
        buildingArea,
        hasLease,
        hasSeizure,
        seizureSequence,
        mortgageSequence,
        consultPrice,
        mortgagePrice,
        note,
        owner,
      },
      form: { getFieldDecorator },
      index,
      dynamicOwners,
    } = this.props;
    const ownerList = (owner && owner.map((i) => i.name)) || [];
    return (
      <Form layout="inline" className="yc-form" key={`${name}${index}`}>
        <div className="item-container-edit">
          <div className="item-header">
            <div className="title">抵押物 {index + 1}</div>
            <div className="btn-group">
              <Button
                onClick={() => this.handleReset(index)}
                size="small"
                type="primary"
                ghost
                style={{ minWidth: 88, height: 32, marginRight: 10 }}
              >
                重置内容
              </Button>
              <Button
                onClick={() => this.handleDel(index)}
                size="small"
                type="primary"
                ghost
                style={{ minWidth: 88, height: 32 }}
              >
                删除
              </Button>
            </div>
          </div>
          <div className="item-content">
            <div className="part">
              <Form.Item label="名称">
                {getFieldDecorator("name", {
                  initialValue: name,
                })(
                  <Input
                    placeholder="请输入抵押物名称"
                    size="default"
                    autoComplete="off"
                    style={{ width: 967 }}
                    onBlur={() => this.save()}
                  />
                )}
              </Form.Item>
            </div>
            <div className="part">
              <Form.Item label="类别">
                {getFieldDecorator("type", {
                  initialValue: type,
                })(
                  <Input
                    placeholder="请输入抵押物类别"
                    size="default"
                    autoComplete="off"
                    style={{ width: 126 }}
                    onBlur={() => this.save()}
                  />
                )}
              </Form.Item>
              <Form.Item label="房地用途">
                {getFieldDecorator("useType", {
                  initialValue: USE_TYPE[useType],
                })(
                  <Select
                    placeholder="房地用途"
                    style={{ height: 32, width: 126 }}
                    onBlur={() => this.save()}
                  >
                    {Object.keys(USE_TYPE).map((key) => (
                      <Option key={USE_TYPE[key]} style={{ fontSize: 12 }}>
                        {USE_TYPE[key]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="土地面积：" className="area-right">
                {getFieldDecorator("landArea", {
                  initialValue: landArea || "",
                })(
                  <Input
                    type="text"
                    placeholder="请输入土地面积"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126, marginRight: 5 }}
                  />
                )}
                <span>
                  m<sup>2</sup>
                </span>
              </Form.Item>
              <Form.Item label="建筑面积：">
                {getFieldDecorator("buildingArea", {
                  initialValue: buildingArea || "",
                })(
                  <Input
                    type="text"
                    placeholder="请输入建筑面积"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126, marginRight: 5 }}
                  />
                )}
                <span>
                  m<sup>2</sup>
                </span>
              </Form.Item>
            </div>
            <div className="part">
              <Form.Item label="有无租赁：">
                {getFieldDecorator("hasLease", {
                  initialValue: HAS_TYPE[hasLease],
                })(
                  <Select
                    style={{ height: 32, width: 126 }}
                    onBlur={() => this.save()}
                  >
                    {Object.keys(HAS_TYPE).map((key) => (
                      <Option key={HAS_TYPE[key]} style={{ fontSize: 12 }}>
                        {HAS_TYPE[key]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>

              <Form.Item label="有无查封：">
                {getFieldDecorator("hasSeizure", {
                  initialValue: HAS_TYPE[hasSeizure],
                })(
                  <Select
                    style={{ height: 32, width: 126 }}
                    onBlur={() => this.save()}
                  >
                    {Object.keys(HAS_TYPE).map((key) => (
                      <Option key={HAS_TYPE[key]} style={{ fontSize: 12 }}>
                        {HAS_TYPE[key]}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              <Form.Item label="查封顺位：">
                {getFieldDecorator("seizureSequence", {
                  initialValue: seizureSequence,
                })(
                  <Input
                    type="text"
                    placeholder="第X顺位"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126, marginRight: 3 }}
                  />
                )}
              </Form.Item>
              <Form.Item label="抵押顺位：">
                {getFieldDecorator("mortgageSequence", {
                  initialValue: mortgageSequence,
                })(
                  <Input
                    type="text"
                    placeholder="第X顺位"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126 }}
                  />
                )}
              </Form.Item>
            </div>
            <div className="part">
              <Form.Item label="评估价：" className="money-right">
                {getFieldDecorator("consultPrice", {
                  initialValue: consultPrice || "",
                })(
                  <Input
                    type="text"
                    placeholder="请输入评估价"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126, marginRight: 8 }}
                  />
                )}
                元
              </Form.Item>
              <Form.Item label="抵押金额：" className="money-right">
                {getFieldDecorator("mortgagePrice", {
                  initialValue: mortgagePrice || "",
                })(
                  <Input
                    type="text"
                    placeholder="请输入抵押金额"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 126, marginRight: 8 }}
                  />
                )}
                元
              </Form.Item>
              <Form.Item label="所有人：">
                {getFieldDecorator("owner", {
                  initialValue: ownerList,
                })(
                  <Select
                    mode="tags"
                    style={{ height: 32, width: 421 }}
                    onBlur={() => this.save()}
                    placeholder="请选择所有人"
                  >
                    {dynamicOwners.map((item) => (
                      <Option key={item} style={{ fontSize: 12 }}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
            </div>
            <div className="part">
              <Form.Item label="备注：">
                {getFieldDecorator("note", {
                  initialValue: note,
                })(
                  <Input.TextArea
                    type="text"
                    placeholder="请输入抵押物补充描述内容或抵押物备注"
                    size="default"
                    autoComplete="off"
                    style={{ width: 967, minHeight: 112 }}
                    onBlur={() => this.save()}
                  />
                )}
              </Form.Item>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}
export default Form.create()(Item);
