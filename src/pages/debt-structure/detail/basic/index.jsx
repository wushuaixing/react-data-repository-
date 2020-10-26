import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AUCTION_STATUS } from '@/static/status';
import { dateUtils } from '@utils/common';

class Basic extends Component {
  static defaultProps = {
    title: "",
    status: 0,
    withdraw: "",
    logs: [],
  };

  render() {
    const { title, status, withdraw, logs } = this.props;
    return (
      <div className="debt-detail-components debt-basic">
        <div className="header">基本信息</div>
        <ul>
          <Item title="标题：">
            <Link to={`/auctionDetail/${10181734}`} target="_blank">
              {title}
            </Link>
          </Item>
          <Item title="拍卖状态：" content={AUCTION_STATUS[status]} />
          <Item title="撤回原因：" content={withdraw} />
          {logs && logs.length > 0 && (
            <Item title="标注记录：">
              {logs.map((item, index) => (
                <RecordItem item={item} index={index} key={`records${index}`} />
              ))}
            </Item>
          )}
        </ul>
      </div>
    );
  }
}

const Item = (props) =>
  props.hide ? null : (
    <li>
      <div>{props.title}</div>
      <div>{props.content || props.children}</div>
    </li>
  );

const RecordItem = (props) => {
  const {
    item: { name, time, type },
    index,
  } = props;
  return (
    <p key={`recordItem${index}`}>
      {`${dateUtils.formatStandardNumberDate(time)} ${name} ${
        type === 1 ? "检查" : "结构化"
      }`}{" "}
    </p>
  );
};

export default withRouter(Basic);
