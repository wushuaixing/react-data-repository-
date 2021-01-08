import React, { Component, Fragment } from "react";
import { Item } from "../common";
import { Input, Radio, Checkbox } from "antd";
import ICONADD from "../../../assets/img/add_wenshu.png";
import ICONDEL from "../../../assets/img/icon_delete.png";
import "../style.scss";

class DocumentInfo extends Component {
  static defaultProps = {
    wsFindStatus: "",
    ah: [],
    wsUrl: "",
    wsInAttach: "",
    enable: false,
    handleDeleteClick: () => {},
    handleDocumentChange: () => {},
    handleAddClick: () => {},
    handleChange: () => {},
  };
  handleChange = (e) => {
    if (e.target.type === "checkbox") {
      this.props.handleChange(e.target.name, e.target.checked * 1);
    } else if (e.target.type === "text") {
      this.props.handleDocumentChange(e.target.name, e.target.value);
    } else {
      this.props.handleChange(e.target.name, e.target.value);
    }
  };

  handleDeleteClick(i, attr) {
    this.props.handleDeleteClick(attr, i);
  }

  get documentInputNumber() {
    return this.props.ah.length;
  }

  get linkInputNumber() {
    return this.props.wsUrl.length;
  }

  get wsInAttach() {
    return Boolean(this.props.wsInAttach);
  }

  render() {
    const { wsFindStatus, ah, wsUrl, enable } = this.props;
    return (
      <div className="yc-component-assetStructureDetail document_info">
        <div className="yc-component-assetStructureDetail_header">文书信息</div>
        <div className="yc-component-assetStructureDetail_body">
          <ul>
            <Item title="查找情况：">
              <div>
                {enable ? (
                  <span>
                    {parseInt(wsFindStatus) === 1 ? "找到文书" : "未找到文书"}
                  </span>
                ) : (
                  <Radio.Group
                    value={wsFindStatus}
                    name="wsFindStatus"
                    onChange={this.handleChange}
                    disabled={enable}
                  >
                    <Radio value={1}>找到文书</Radio>
                    <Radio value={0}>未找到文书</Radio>
                  </Radio.Group>
                )}
              </div>
            </Item>
            {this.props.wsFindStatus === 1 ? (
              <Fragment>
                <Item title="相关文书案号：">
                  <div className="doucment_info_inputContent">
                    <Fragment>
                      <DocumentLinkInputs
                        values={ah}
                        enable={enable}
                        attr={"ah"}
                        num={this.documentInputNumber}
                        text={"相关文书案号"}
                        handleChange={this.handleChange}
                        handleDeleteClick={this.handleDeleteClick.bind(this)}
                        handleAddClick={this.props.handleAddClick.bind(
                          this,
                          "ah"
                        )}
                      ></DocumentLinkInputs>
                      {this.documentInputNumber >= 3 && !enable ? (
                        <p className="atmost-tip">最多添加3个</p>
                      ) : null}
                    </Fragment>
                  </div>
                </Item>
                <Item title="文书链接地址：">
                  <div className="doucment_info_inputContent">
                    <Fragment>
                      <DocumentLinkInputs
                        values={wsUrl}
                        enable={enable}
                        attr={"wsUrl"}
                        num={this.linkInputNumber}
                        text={"文书链接地址"}
                        handleChange={this.handleChange}
                        handleDeleteClick={this.handleDeleteClick.bind(this)}
                        handleAddClick={this.props.handleAddClick.bind(
                          this,
                          "wsUrl"
                        )}
                      ></DocumentLinkInputs>
                      {this.linkInputNumber >= 3 && !enable ? (
                        <p className="atmost-tip">最多添加3个</p>
                      ) : null}
                    </Fragment>
                  </div>
                </Item>
                <Item>
                  <div>
                    {enable ? (
                      <span>{this.wsInAttach ? "详情见资产拍卖附件" : ""}</span>
                    ) : (
                      <span>
                        <Checkbox
                          name="wsInAttach"
                          onChange={this.handleChange}
                          checked={this.wsInAttach}
                          disabled={enable}
                        >
                          详情见资产拍卖附件
                        </Checkbox>
                      </span>
                    )}
                  </div>
                </Item>
              </Fragment>
            ) : null}
          </ul>
        </div>
      </div>
    );
  }
}

const DocumentLinkInputs = (props) => {
  const { values, enable, attr, num, text } = props;
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(
      <DocumentLinkInput
        value={values[i] || "-"}
        enable={enable}
        attr={attr}
        num={num}
        text={text}
        key={i}
        index={i}
        handleChange={props.handleChange}
        handleDeleteClick={props.handleDeleteClick.bind(this, i, attr)}
        handleAddClick={props.handleAddClick}
      />
    );
  }
  return arr;
};
const linkSpan = (val) =>
  val ? (
    <a
      href={val}
      rel="noopener noreferrer"
      target="_blank"
      style={{ textDecoration: "underline" }}
    >
      {val}
    </a>
  ) : (
    "-"
  );
const DocumentLinkInput = (props) => {
  const { attr, value, enable, index, num, text } = props;
  return (
    <div className="doucment_info_inputItem">
      {enable ? (
        attr === "wsUrl" ? (
          linkSpan(value.value) || "-"
        ) : (
          value.value || "-"
        )
      ) : (
        <Input
          maxLength={attr === "wsUrl" ? 99999 : 50}
          placeholder={`请输入${text}`}
          onChange={props.handleChange}
          name={`${attr}${index}`}
          value={value.value}
          autoComplete="off"
          onBlur={(e) => {
            e.persist();
            if (e.target.name.includes("ah")) {
              e.target.value = e.target.value.trim();
            }
            props.handleChange(e);
          }}
        />
      )}
      {num === index + 1 && num < 3 && !enable ? (
        <img
          src={ICONADD}
          style={{ width: 18, height: 18, marginLeft: 12 }}
          alt=" "
          className="icon_hover_pointer"
          onClick={props.handleAddClick}
        />
      ) : null}
      {num > 1 && !enable ? (
        <img
          src={ICONDEL}
          style={{ width: 18, height: 18, marginLeft: 12 }}
          alt=" "
          className="icon_hover_pointer"
          onClick={props.handleDeleteClick}
        />
      ) : null}
    </div>
  );
};
export default DocumentInfo;
