import React, { Component, Fragment } from "react";
import { withRouter } from "react-router-dom";
import { Popover, Icon, InputNumber, Checkbox } from "antd";

class AssetPackage extends Component {
  static defaultProps = {
    isEdit: false,
    unitNumber: 0,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
    role: "",
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
      summation,
      totalAmountCreditorsRights,
      isEdit,
      role,
    } = this.props;
    return (
      <div className="debt-detail-components debt-asset-package" id={role}>
        <div className="header">
          {role === "assetPackage" ? (
            <Fragment>
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
            </Fragment>
          ) : (
            <Fragment>债权信息</Fragment>
          )}
        </div>
        {isEdit ? (
          <ul className="asset-package-edit">
            {role === "assetPackage" && (
              <Item title="户数：" content={unitNumber} unit="户" />
            )}
            <Item title={role==='assetPackage'?"本金合计：":'债权本金：'} classNames="creditorsRightsPrincipal">
              <div>
                <InputNumber
                  precision={2}
                  style={{ width: 200 }}
                  max={999999999.99}
                  e
                  min={0}
                  placeholder="请输入金额"
                  onChange={(e) =>
                    this.handleChange("creditorsRightsPrincipal", e)
                  }
                  value={creditorsRightsPrincipal}
                />
                <span style={{marginLeft:19}}>元</span>
              </div>
            </Item>
            <Item title={role==='assetPackage'?"利息合计：":'利息：'}>
              <div>
                <InputNumber
                  precision={2}
                  style={{ width: 200 }}
                  max={999999999.99}
                  min={0}
                  placeholder="请输入金额"
                  onChange={(e) => this.handleChange("outstandingInterest", e)}
                  value={outstandingInterest}
                />
                <span style={{marginLeft:19}}>元</span>
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
                  onChange={(e) =>
                    this.handleChange("totalAmountCreditorsRights", e)
                  }
                  value={totalAmountCreditorsRights}
                  disabled={Boolean(summation)}
                />
                <span style={{marginLeft:19}}>元</span>
                <span style={{ marginLeft: 24 }}>
                  <Checkbox
                    name="summation"
                    onChange={(e) => this.handleChange(e)}
                    checked={Boolean(summation)}
                  >
                    本息自动求和
                  </Checkbox>
                </span>
              </div>
            </Item>
          </ul>
        ) : (
          <ul className="asset-package-disabled">
            <Item title="户数：" content={unitNumber} index={true} unit="户" />
            <Item
              title={role==='assetPackage'?"本金合计：":'债权本金：'}
              content={creditorsRightsPrincipal}
              unit="元"
            />
            <Item title={role==='assetPackage'?"利息合计：":'利息：'} content={outstandingInterest} unit="元" />
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
  const { title, children, content, unit,classNames } = props;
  return (
    <li>
      <div className={classNames}>{title}</div>
      <div>
        {children
          ? children
          : content
          ? `${parseInt(content).toLocaleString()} ${unit}`
          : "-"}
      </div>
    </li>
  );
};

export default withRouter(AssetPackage);
