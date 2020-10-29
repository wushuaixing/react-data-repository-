import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { InputNumber, Checkbox } from "antd";

class DebtRights extends Component {
  static defaultProps = {
    enble: true,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
    Summation: 0,
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
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
      Summation,
    } = this.props;
    return (
      <div className="debt-detail-components debt-rights">
        <div className="header">债权信息</div>
        {/* <ul className="rights-disabled">
          <Item title="债权本金：" content={creditorsRightsPrincipal} />
          <Item title="利息：" content={outstandingInterest} />
          <Item title="本息合计：" content={totalAmountCreditorsRights} />
        </ul> */}
        <ul className="rights-edit">
          <Item title="债权本金：" classNames="creditorsRightsPrincipal">
            <InputNumber
              precision={2}
              style={{ width: 143 }}
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
          </Item>
          <Item title="利息：">
            <InputNumber
              precision={2}
              style={{ width: 143 }}
              max={999999999.99}
              min={0}
              placeholder="请输入金额"
              name="outstandingInterest"
              onChange={this.handleChange.bind(this, "outstandingInterest")}
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
          </Item>
        </ul>
      </div>
    );
  }
}

const Item = (props) => (
  <li>
    <div className={props.classNames}>{props.title}</div>
    <div>
      {props.content
        ? `${parseInt(props.content).toLocaleString()}元`
        : props.children}
    </div>
  </li>
);

export default withRouter(DebtRights);
