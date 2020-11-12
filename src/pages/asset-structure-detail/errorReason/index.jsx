import React, { Component, Fragment } from "react";
import { Item } from "../common";
import { WRONG_LEVEL } from "@/static/status";
import { dateUtils } from "@utils/common";

class ErrorReason extends Component {
  static defaultProps = {
    wrongData: [],
  };

  render() {
    const { wrongData, role } = this.props;
    return (
      <div className="yc-component-assetStructureDetail error-reason_info">
        <div className="yc-component-assetStructureDetail_header">错误原因</div>
        <div className="yc-component-assetStructureDetail_body">
          <ul>
            {wrongData.map((item, index) => {
              return (
                <Fragment key={`wrongdata${index}`}>
                  {(role === "admin" || role === "newpage-other") && (
                    <li>
                      <p className="wrong-data">{`${dateUtils.formatStandardNumberDate(
                        item.time
                      )} ${item.name} 检查`}</p>
                      <span className="danger-error" style={{ marginLeft: 16 }}>
                        有误
                      </span>
                    </li>
                  )}
                  <Item
                    title="错误等级："
                    content={WRONG_LEVEL[item.wrongLevel] || "-"}
                    color="danger"
                  />
                  <Item title="错误详情：" color="danger">
                    <div className="wrong-detail">
                      {item.remark && item.remark.length > 0
                        ? item.remark.map((items, indexs) => {
                            return <p key={`wrongdata${indexs}`}>{items} </p>;
                          })
                        : "-"}
                    </div>
                  </Item>
                </Fragment>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

export default ErrorReason;
