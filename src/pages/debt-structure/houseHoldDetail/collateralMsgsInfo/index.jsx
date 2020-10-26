import React from 'react';
import { Title_TYPE } from '../../common/type';
class CollateralMsgsInfo extends React.Component {
  static defaultProps = {
    msgsInfo: {},
    enble: true,
  };

  render() {
    const { data } = this.props;
    console.log(data);
    return (
      <div className="debt-detail-components msgs-info">
        <div className="header">抵质押物信息</div>
        <div className="content">
          {data.map((item, index) => (
            <ItemContent msgsList={item} key={item.id} index={index} />
          ))}
        </div>
      </div>
    );
  }
}

const ItemContent = (props) => {
  const {
    msgsList: {
      collateralName,
      category,
      landArea,
      buildingArea,
      useType,
      hasSeizure,
      hasLease,
      seizureSequence,
      mortgageSequence,
      note,
    },
    index,
  } = props;
  const msgsList = [
    collateralName,
    category,
    landArea,
    buildingArea,
    useType,
    hasSeizure,
    hasLease,
    seizureSequence,
    mortgageSequence,
    "-",
    "10000",
    "2000000",
    note,
  ];
  return (
    <div className="item-container">
      <div className="item-header">抵押物{index + 1}</div>
      <ul className="item-content">
        {msgsList.map((item, indexs) => (
          <Item
            title={Title_TYPE[indexs]}
            content={item}
            key={`item${indexs}`}
          />
        ))}
      </ul>
    </div>
  );
};

const Item = (props) => (
  <li>
    <div>{props.title}：</div>
    <div>{props.content ? props.content : "-"}</div>
  </li>
);

export default CollateralMsgsInfo;
