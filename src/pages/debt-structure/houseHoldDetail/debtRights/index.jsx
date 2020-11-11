import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { InputNumber, Checkbox } from "antd";

class DebtRights extends Component {
  constructor(props) {
    super(props);
    this.state = {
      creditorsRightsPrincipal: props.creditorsRightsPrincipal,
      outstandingInterest: props.outstandingInterest,
      totalAmountCreditorsRights: props.totalAmountCreditorsRights,
      Summation: props.Summation,
    };
  }

  static defaultProps = {
    isEdit: true,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
    Summation: 0,
  };

  handleChange = (e, key) => {
    if (e && e.target) {
      this.handleDebtRightsChange(e.target.checked * 1, key);
    } else {
      this.handleDebtRightsChange(e, key);
    }
  };

  handleDebtRightsChange = (value, key) => {
    this.setState(
      {
        [key]: value,
      },
      () => {
        const {
          Summation,
          creditorsRightsPrincipal,
          outstandingInterest,
          totalAmountCreditorsRights,
        } = this.state;
        const obj = {
          creditorsRightsPrincipal,
          outstandingInterest,
          totalAmountCreditorsRights,
        };
        if (key !== "totalAmountCreditorsRights") {
          Summation &&
            this.setState(
              {
                totalAmountCreditorsRights:
                  creditorsRightsPrincipal + outstandingInterest,
              },
              () => {
                this.props.handleChange("debtRights", obj);
              }
            );
        }
        this.props.handleChange("debtRights", obj);
      }
    );
  };

  render() {
    const {
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      Summation,
    } = this.state;
    const { isEdit } = this.props;
    return (
      <div className="debt-detail-components debt-rights" id="DebtRights">
        <div className="header">债权信息</div>
        {isEdit ? (
          <ul className="rights-edit">
            <Item title="债权本金：" classNames="creditorsRightsPrincipal">
              <InputNumber
                precision={2}
                style={{ width: 143 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                onChange={(e) =>
                  this.handleChange(e, "creditorsRightsPrincipal")
                }
                value={creditorsRightsPrincipal}
              />
              &nbsp;&nbsp;元
            </Item>
            <Item title="利息：">
              <InputNumber
                precision={2}
                style={{ width: 143 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                onChange={(e) => this.handleChange(e, "outstandingInterest")}
                value={outstandingInterest}
              />
              &nbsp;&nbsp;元
            </Item>
            <Item title="本息合计：">
              <InputNumber
                precision={2}
                style={{ width: 143 }}
                max={999999999.99}
                min={0}
                placeholder="请输入金额"
                onChange={(e) =>
                  this.handleChange(e, "totalAmountCreditorsRights")
                }
                value={totalAmountCreditorsRights}
                disabled={Boolean(Summation)}
              />
              &nbsp;&nbsp;元
              <span style={{ marginLeft: 20 }}>
                <Checkbox
                  name="Summation"
                  onChange={(e) => {
                    this.handleChange(e, "Summation");
                  }}
                  checked={Boolean(Summation)}
                >
                  本息自动求和
                </Checkbox>
              </span>
            </Item>
          </ul>
        ) : (
          <ul className="rights-disabled">
            <Item title="债权本金：" content={creditorsRightsPrincipal} />
            <Item title="利息：" content={outstandingInterest} />
            <Item title="本息合计：" content={totalAmountCreditorsRights} />
          </ul>
        )}
      </div>
    );
  }
}

const Item = (props) => {
  const { title, classNames, children, content } = props;
  return (
    <li>
      <div className={classNames}>{title}</div>
      <div>
        {children
          ? children
          : `${parseInt(content).toLocaleString()} 元` || `- 元`}
      </div>
    </li>
  );
};

export default withRouter(DebtRights);
