import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { AUCTION_STATUS } from "@/static/status";
import { dateUtils } from "@utils/common";
/**
 * 包详情-基本信息
 */
class Basic extends Component {
  static defaultProps = {
    title: "",
    status: 0,
    withdraw: "",
    logs: [],
    role: "",
    id: "",
  };

  render() {
    const { title, status, withdraw, logs, role, id } = this.props;
    return (
      <div className="debt-detail-components debt-basic">
        <div className="header">基本信息</div>
        <ul>
          <Item title="标题：">
            <Link to={`/auctionDetail/${id}/1/0`} target="_blank">
              {title}
            </Link>
          </Item>
          <Item title="拍卖状态：" content={AUCTION_STATUS[status]} />
          {status === 11 ? (
            <Item title="撤回原因：" content={withdraw} /> //拍卖状态为撤回时，展示撤回原因。
          ) : null}
          {role !== "normal" && logs && logs.length > 0 && (
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
    item: { name, time, type, flag },
    index,
  } = props;

  // 角色 type:  0 结构化 type : 1检查
  // 检察人员操作 0结构化 1检查
  const text = () => {
    if (type === 0 && index === 0) {
      return "初次结构化";
    } else if (type === 0 && index !== 0) {
      return "修改";
    } else {
      if (flag === 0) {
        return <span style={{ color: "red" }}>修改</span>;
      } else {
        return <span style={{ color: "green" }}>检查无误</span>;
      }
    }
  };
  return (
    <p key={`recordItem${index}`}>
      {`${dateUtils.formatStandardNumberDate(time)} ${name}`} {text()}
    </p>
  );
};

export default withRouter(Basic);
