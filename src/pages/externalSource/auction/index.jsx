import React from "react";
import { withRouter } from "react-router-dom";
import { message } from "antd";
import DebtApi from "@/server/debt";
import { getSimilarFile } from "@api";
import pic from "@/assets/img/pic.png";
import OpenSvg from "@/assets/img/icon_open.svg";
import CloseSvg from "@/assets/img/icon_close.svg";

import "./style.scss";

const anchors = [
  {
    id: "biddingAnnouncement",
    title: "竞买公告",
  },
  {
    id: "subjectMatterIntroduction",
    title: "标的物介绍",
  },
  {
    id: "auctionSuccessConfirmation",
    title: "竞价成功确认书",
  },
];

function AnnounceMentPart(props) {
  const { index, html: __html } = props;
  return (
    <div id={anchors[index].id} className="container_body_eachPart">
      <div className="line" />
      <div className="title">{anchors[index].title}</div>
      <div className="content" dangerouslySetInnerHTML={{ __html }} />
    </div>
  );
}

function AttachListItem(props) {
  return (
    <div className="accessory-list_item">
      <a href={props.url} rel="noopener noreferrer" download>
        {props.name}
      </a>
    </div>
  );
}

//寻找是否有图片标签
function findImgTag(html) {
  const reg = /<img*/;
  return reg.test(html);
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: "", //标题
      titleUrl: "", //标题链接
      attachList: [], // 存放文件下载列表 包括 附件ID 附件文件名称 是否已转码到HTML 附件URL
      similarList: [],
      similArattachList: [],
      isCollapse: false,
      showAnchors: [],
      flag: 0,
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { auctionID, isDebt, type },
      },
    } = this.props;
    DebtApi.htmlDetail(auctionID, isDebt).then((res) => {
      if (res.data.code === 200) {
        const data = res.data.data;
        const { title, url, attachList } = data;
        for (let i = 0; i < anchors.length; i++) {
          let part_name = anchors[i].id; //id是每一部分的名称 比如subjectMatterIntroduction 标的物介绍 将后端传来的html动态赋值合并新属性html
          let html = data[part_name]; //返回html
          let isImgTag = findImgTag(html); //判断是否有图片标签
          html
            ? Object.assign(anchors[i], { html, isImgTag })
            : anchors.splice(i, 1);
        }
        this.setState(
          {
            attachList,
            title,
            titleUrl: url,
            showAnchors: anchors,
          },
          () => {
            document.title = data.title;
            !attachList.length &&
              type === "1" &&
              this.getSimilarFile(auctionID);
          }
        );
      } else {
        message.error(res.data.message);
      }
    });
  }

  getSimilarFile = (id) => {
    getSimilarFile(id).then((res) => {
      if (res.data.code === 200) {
        const similarList = res.data.data;
        const similArattachList = similarList.slice(0, 5);
        this.setState({
          similarList,
          similArattachList,
        });
      }
    });
  };

  openTitleUrl() {
    window.open(this.state.titleUrl);
  }

  changeTab = (index) => {
    this.setState({
      flag: index,
    });
  };

  handleCollapse = () => {
    const { similarList, isCollapse } = this.state;
    const arr = similarList.slice(0, 5);
    if (isCollapse) {
      this.setState({
        similArattachList: arr,
        isCollapse: !isCollapse,
      });
    } else {
      this.setState({
        similArattachList: similarList,
        isCollapse: !isCollapse,
      });
    }
  };

  render() {
    const {
      title,
      attachList,
      flag,
      similarList,
      isCollapse,
      similArattachList,
    } = this.state;
    const {
      match: {
        params: { type },
      },
    } = this.props;
    return (
      <div className="externalSource-auction-box">
        <div className="externalSource-auction">
          <div className="externalSource-auction-container">
            <div className="container_body">
              <div className="linkTitle">
                <span onClick={this.openTitleUrl.bind(this)}>{title}</span>
              </div>
              <div className="externalSource-auction-header">
                <ul>
                  {anchors.map((item, index) => {
                    return (
                      <li
                        key={item.id}
                        onClick={() => this.changeTab(index)}
                        className={flag === index ? "hover-item" : null}
                      >
                        {item.isImgTag && <img src={pic} alt="" />}
                        <a href={`#${item.id}`}>{item.title}</a>
                      </li>
                    );
                  })}
                </ul>
              </div>
              {anchors.map((anchor, index) => {
                return (
                  <AnnounceMentPart
                    index={index}
                    html={anchor.html}
                    key={index}
                  />
                );
              })}
            </div>
            <div className="container_right">
              <div className="accessory">
                <div className="accessory_title">本条数据附件</div>
                {attachList.length ? (
                  <div className="accessory-list">
                    {attachList.map((item, index) => (
                      <AttachListItem
                        url={item.url}
                        name={item.name}
                        key={index}
                        transcodingToHtml={item.transcodingToHtml}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="no-data">未找到相关附件</span>
                )}
                {!attachList.length && type === "1" ? (
                  <div className="accessory">
                    <div className="accessory_title">同组其他相似数据附件</div>
                    <div className="accessory-list">
                      {similarList.length ? (
                        similArattachList.map((item, index) => (
                          <AttachListItem
                            url={item.url}
                            name={item.name}
                            key={index}
                            transcodingToHtml={item.transcodingToHtml}
                          />
                        ))
                      ) : (
                        <span className="no-data">未找到相关附件</span>
                      )}
                    </div>
                    {similarList.length > 5 ? (
                      <div style={{ textAlign: "center" }}>
                        <img
                          onClick={() => this.handleCollapse()}
                          src={isCollapse ? CloseSvg : OpenSvg}
                          alt=""
                        />
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(Index);
