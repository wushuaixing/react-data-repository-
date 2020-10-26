import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class AssetPackage extends Component {
  static defaultProps = {
    enble: true,
    unitNumber: 0,
    creditorsRightsPrincipal: 0,
    outstandingInterest: 0,
    totalAmountCreditorsRights: 0,
  };

  render() {
    const {
      unitNumber,
      creditorsRightsPrincipal,
      outstandingInterest,
      totalAmountCreditorsRights,
    } = this.props;
    return (
      <div className="debt-detail-components debt-asset-package">
        <div className="header">资产包信息</div>
        <ul className="asset-package-disabled">
          <Item title="户数：" content={unitNumber} />
          <Item title="本金合计：" content={creditorsRightsPrincipal} />
          <Item title="利息合计：" content={outstandingInterest} />
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

export default withRouter(AssetPackage);
