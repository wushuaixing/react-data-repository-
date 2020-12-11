import React, { Component } from "react";
import { HAS_TYPE, USE_TYPE } from "../../common/type";
import {
  Input,
  Select,
  Button,
  Form,
  AutoComplete,
  Icon,
  InputNumber,
} from "antd";
const { Option } = Select;
/**
 * 户详情-单个抵押物信息（可编辑页面）
 */
class Item extends Component {
  constructor() {
    super();
    this.state = {
      isChange: false,
    };
  }

  static defaultProps = {
    index: 0,
    key: "",
    isChange: "",
    id: "",
    msgsList: {},
    dynamicOwners: [],
    collateralMsg: [],
    handleRowDel: () => {},
    handleSave: () => {},
    handleRowReset: () => {},
    handleSelect: () => {},
  };

  //角色信息发生改变时 置空所有人信息
  UNSAFE_componentWillReceiveProps(props) {
    const {
      form: { setFieldsValue },
      isChange,
    } = props;
    if (isChange && this.state.isChange !== isChange) {
      this.setState({
        isChange,
      });
      setFieldsValue({ owner: [] });
      this.save();
    }
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

  //选中抵押物信息所有人后自动填充信息
  handleSelect = (val) => {
    const { collateralMsg } = this.props;
    const { index } = this.props;
    let id = "";
    collateralMsg.forEach((i) => {
      if (i.collateralName === val) {
        id = i.id;
      }
    });
    this.props.handleSelect(id, index);
  };
  render() {
    const {
      msgsList: {
        collateralName,
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
        id,
      },
      form: { getFieldDecorator },
      index,
      dynamicOwners,
      collateralMsg,
    } = this.props;
    const ownerList =
      owner && owner.map((i) => `${i.name}(${i.typeName})`).filter((i) => i);
    const collateralMsgList = (collateralMsg || []).map((i) => i.collateralName);
    return (
      <Form layout="inline" className="yc-form" key={`${id}${index}`}>
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
                {getFieldDecorator("collateralName", {
                  initialValue: collateralName,
                })(
                  <AutoComplete
                    placeholder="请输入抵押物名称"
                    size="default"
                    style={{ width: 967 }}
                    onBlur={() => this.save()}
                    dataSource={collateralMsgList}
                    onSelect={this.handleSelect}
                    filterOption={(inputValue, option) =>
                      option.props.children
                        .toUpperCase()
                        .indexOf(inputValue.toUpperCase()) !== -1
                    }
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
                    style={{ width: 150 }}
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
                    style={{ height: 32, width: 150 }}
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
                  <InputNumber
                    placeholder="请输入土地面积"
                    precision={2}
                    max={999999999999.99}
                    min={0}
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 150, marginRight: 5 }}
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
                  <InputNumber
                    placeholder="请输入建筑面积"
                    precision={2}
                    max={999999999999.99}
                    min={0}
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 150, marginRight: 5 }}
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
                    style={{ height: 32, width: 150 }}
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
                    style={{ height: 32, width: 150 }}
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
                    style={{ height: 32, width: 150, marginRight: 3 }}
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
                    style={{ height: 32, width: 150 }}
                  />
                )}
              </Form.Item>
            </div>
            <div className="part">
              <Form.Item label="评估价：" className="money-right">
                {getFieldDecorator("consultPrice", {
                  initialValue: consultPrice || "",
                })(
                  <InputNumber
                    precision={2}
                    max={999999999999.99}
                    min={0}
                    placeholder="请输入评估价"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 150, marginRight: 8 }}
                  />
                )}
                元
              </Form.Item>
              <Form.Item label="抵押金额：" className="money-right">
                {getFieldDecorator("mortgagePrice", {
                  initialValue: mortgagePrice || "",
                })(
                  <InputNumber
                    precision={2}
                    max={999999999999.99}
                    min={0}
                    placeholder="请输入抵押金额"
                    size="default"
                    autoComplete="off"
                    onBlur={() => this.save()}
                    style={{ height: 32, width: 150, marginRight: 8 }}
                  />
                )}
                元
              </Form.Item>
            </div>

            <div className="part">
              <Form.Item label="所有人：" className="owner">
                {getFieldDecorator("owner", {
                  initialValue: ownerList || [],
                })(
                  <Select
                    mode="multiple"
                    style={{ minHeight: 32, width: 484 }}
                    placeholder="请选择所有人"
                    onSelect={this.save}
                    onDeselect={this.save} //删除选中数值时调用保存
                    onMouseLeave={this.save}
                  >
                    {dynamicOwners.map((item) => (
                      <Option key={item} style={{ fontSize: 12 }}>
                        {item}
                      </Option>
                    ))}
                  </Select>
                )}
              </Form.Item>
              {index === 0 && (
                <div className="owner-tips">
                  <Icon
                    type="exclamation-circle"
                    theme="filled"
                    style={{
                      color: "#FB5A5C",
                      fontSize: 16,
                      marginRight: 5,
                      marginLeft: 5,
                    }}
                  />
                  选择抵押物所有人后，再次编辑角色信息，所有人将被全部清空！
                </div>
              )}
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
