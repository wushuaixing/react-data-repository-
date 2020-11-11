import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { Popover, Icon, InputNumber, Checkbox } from "antd";

class AssetPackage extends Component {
  static defaultProps = {
    isEdit: false,
    unitNumber: 0,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
  };

  handleChange = (e, val) => {
    if (e && e.target) {
      this.props.handleChange(e.target.name, e.target.checked * 1);
    } else {
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
      isEdit,
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
        {isEdit ? (
          <ul className="asset-package-edit">
            <Item title="户数：" content={unitNumber} unit="户" />
            <Item title="本金合计：">
              <div>
                <InputNumber
                  precision={2}
                  style={{ width: 200 }}
                  max={999999999.99}
                  e
                  min={0}
                  placeholder="请输入金额"
                  name="creditorsRightsPrincipal"
                  onChange={(e) =>
                    this.handleChange("creditorsRightsPrincipal", e)
                  }
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
                  onChange={(e) => this.handleChange("outstandingInterest", e)}
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
                  onChange={(e) =>
                    this.handleChange("totalAmountCreditorsRights", e)
                  }
                  value={totalAmountCreditorsRights}
                  disabled={Boolean(Summation)}
                />
                &nbsp;&nbsp;元
                <span style={{ marginLeft: 20 }}>
                  <Checkbox
                    name="Summation"
                    onChange={(e) => this.handleChange(e)}
                    checked={Boolean(Summation)}
                  >
                    本息自动求和
                  </Checkbox>
                </span>
              </div>
            </Item>
          </ul>
        ) : (
          <ul className="asset-package-disabled">
            <Item title="户数：" content={unitNumber} index={true} unit="元" />
            <Item
              title="本金合计："
              content={creditorsRightsPrincipal}
              unit="元"
            />
            <Item title="利息合计：" content={outstandingInterest} unit="元" />
            <Item
              title="本息合计："
              content={totalAmountCreditorsRights}
              unit="元"
            />
          </ul>
        )}
      </div>
    );
  }
}

const Item = (props) => {
  const { title, children, content, unit } = props;
  return (
    <li>
      <div>{title}</div>
      <div>
        {children
          ? children
          : `${parseInt(content).toLocaleString()} ${unit}` || `- ${unit}`}
      </div>
    </li>
  );
};

export default withRouter(AssetPackage);
