import React, { Component, Fragment } from "react";
import { Item } from "../common";
import { AUCTION_STATUS } from "@/static/status";
import { Link, withRouter } from "react-router-dom";
import { dateUtils } from "@utils/common";

class BasicInfo extends Component {
  static defaultProps = {
    title: "",
    auctionStatus: 1, //拍卖状态1:即将开始 3进行中 5已成交 7已流拍 9中止 11撤回
    reasonForWithdrawal: "", //撤回原因
    associatedAnnotationId: "", //关联标注
    records: [], //结构化/检查记录
    status: 0,
    url: "",
    id: "",
  };

  render() {
    const {
      title,
      auctionStatus,
      reasonForWithdrawal,
      associatedAnnotationId,
      records,
      id,
      status,
      type,
    } = this.props;
    const hasAuto = (records || []).some((i) => i.msg === "自动标注");
    return (
      <div className="yc-component-assetStructureDetail basic_info">
        <div className="yc-component-assetStructureDetail_header">基本信息</div>
        <div className="yc-component-assetStructureDetail_body">
          <ul>
            <Item title="标题：">
              <div>
                <Link to={`/auctionDetail/${id}/0/${type}`} target="_blank">
                  {title}
                </Link>
              </div>
            </Item>
            <Item title="拍卖状态：">
              <div>{AUCTION_STATUS[auctionStatus]}</div>
            </Item>
            {(auctionStatus === 9 || auctionStatus === 11) && ( //拍卖状态为中止或者撤回时 显示撤回原因
              <Item title="撤回原因：">
                <div>{reasonForWithdrawal || "-"}</div>
              </Item>
            )}
            {!hasAuto &&
            associatedAnnotationId && ( //如果结构化检查记录存在有自动标注的数据，关联标注不显示
                <Item title="关联标注：">
                  <Link
                    to={`/notFirstMark/${status}/${associatedAnnotationId}`}
                    target="_blank"
                  >
                    链接
                  </Link>
                </Item>
              )}
            {records && records.length > 0 && (
              <Item title="结构化/检查记录：">
                <div className="records">
                  {records.map((item, index) => {
                    return (
                      <p key={`record${index}`}>
                        <RecordsItem
                          record={item}
                          index={index}
                          id={associatedAnnotationId}
                          status={status}
                        />
                      </p>
                    );
                  })}
                </div>
              </Item>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

const RecordsItem = (props) => {
  const { record, index, id, status } = props;
  let temp = null;
  let classType = "record-noEr";
  if (record.msg === "结构化") {
    temp = index === 0 ? "初次结构化" : "修改";
  } else if (record.msg === "自动标注") {
    temp = "自动标注";
  } else {
    temp = record.error ? "检查有误" : "检查无误";
    classType = record.error ? "danger-error" : "record-noErr";
  }
  return (
    <Fragment>
      {`${dateUtils.formatStandardNumberDate(record.time)} ${record.name}`}{' '}
      <span className={classType}>{temp}</span>
      {record.msg === "自动标注" ? (
        <span style={{ marginLeft: 20 }}>
          <Link target="_blank" to={`/autoMark/${status}/${id}`}>
            {"查看详情"}
          </Link>
        </span>
      ) : null}
    </Fragment>
  );
};
export default withRouter(BasicInfo);
