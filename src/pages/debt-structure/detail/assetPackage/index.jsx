import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Popover, Icon, InputNumber, Checkbox } from "antd";

class AssetPackage extends Component {
  static defaultProps = {
    enble: true,
    unitNumber: 0,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
  };
  handleChange = (e, val) => {
    if (e && e.target) {
      this.props.handleChange(e.target.name, e.target.checked * 1);
    } else {
      //数值输入框onChange返回val
      this.props.handleChange(e, val);
    }
  };
  render() {
    const {
      unitNumber,
      creditorsRightsPrincipal,
      outstandingInterest,
      Summation,
      totalAmountCreditorsRights,
    } = this.props;
    return (
      <div className="debt-detail-components debt-asset-package">
        <div className="header">
          资产包信息
          <span>
            <Popover content="户数会根据各户信息自动计数生成">
              <Icon
                type="exclamation-circle"
                style={{
                  color: "#808387",
                  position: "relative",
                  marginLeft: 8,
                }}
              />
            </Popover>
          </span>
        </div>
        {/* <ul className="asset-package-disabled">
          <Item title="户数：" content={unitNumber} />
          <Item title="本金合计：" content={creditorsRightsPrincipal} />
          <Item title="利息合计：" content={outstandingInterest} />
          <Item title="本息合计：" content={totalAmountCreditorsRights} />
        </ul> */}
        <ul className="asset-package-edit">
          <Item title="户数：" content={unitNumber} />
          <Item title="本金合计：">
            <div>
              <InputNumber
                precision={2}
                style={{ width: 200 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                name="creditorsRightsPrincipal"
                onChange={this.handleChange.bind(
                  this,
                  "creditorsRightsPrincipal"
                )}
                value={creditorsRightsPrincipal}
              />
              &nbsp;&nbsp;元
            </div>
          </Item>
          <Item title="利息合计：">
            <div>
              <InputNumber
                precision={2}
                style={{ width: 200 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                name="outstandingInterest"
                onChange={this.handleChange.bind(this, "outstandingInterest")}
                value={outstandingInterest}
              />
              &nbsp;&nbsp;元
            </div>
          </Item>
          <Item title="本息合计：">
            <div>
              <InputNumber
                precision={2}
                style={{ width: 200 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                name="totalAmountCreditorsRights"
                onChange={this.handleChange.bind(
                  this,
                  "totalAmountCreditorsRights"
                )}
                value={totalAmountCreditorsRights}
                disabled={Boolean(Summation)}
              />
              &nbsp;&nbsp;元
              <span style={{ marginLeft: 20 }}>
                <Checkbox
                  name="Summation"
                  onChange={this.handleChange.bind(this)}
                  checked={Boolean(Summation)}
                >
                  本息自动求和
                </Checkbox>
              </span>
            </div>
          </Item>
        </ul>
      </div>
    );
  }
}

const Item = (props) => (
  <li>
    <div>{props.title}</div>
    <div>
      {props.content
        ? `${parseInt(props.content).toLocaleString()}元`
        : props.children}
    </div>
  </li>
);

export default withRouter(AssetPackage);
