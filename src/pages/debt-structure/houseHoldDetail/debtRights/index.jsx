import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class DebtRights extends Component {
  static defaultProps = {
    enble: true,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
  };

  render() {
    const {
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
    } = this.props;
    return (
      <div className="debt-detail-components debt-rights">
        <div className="header">债权信息</div>
        <ul className="rights-disabled">
          <Item title="债权本金：" content={creditorsRightsPrincipal} />
          <Item title="利息：" content={outstandingInterest} />
          <Item title="本息合计：" content={totalAmountCreditorsRights} />
        </ul>
      </div>
    );
  }
}

const Item = (props) => (
  <li>
    <div>{props.title}</div>
    <div>{props.content}</div>
  </li>
);

export default withRouter(DebtRights);
