import React from 'react';
import { withRouter } from "react-router-dom";
import { message, Anchor } from 'antd';
import { htmlDetailInfo } from "../../../server/api";
import './style.scss';

const { Link } = Anchor;
const anchors = [
  {
    id: 'biddingAnnouncement',
    title: '竞买公告'
  },
  {
    id: 'subjectMatterIntroduction',
    title: '标的物介绍'
  },
  {
    id: 'auctionSuccessConfirmation',
    title: '竞价成功确认书'
  }
]
function AuctionAnchor() {
  return (
    <Anchor
      showInkInFixed={true}
    >
      {anchors.map(anchor => <Link href={`#${anchor.id}`} title={anchor.title} key={anchor.id} />)}
    </Anchor>
  );
}

function AnnounceMentPart(props) {
  const { index } = props
  return (
    <div id={anchors[index].id} className="container_body_eachPart">
      <div className="line" />
      <div className="title">{anchors[index].title}</div>
      <div className="content" dangerouslySetInnerHTML={{ __html: props.html }} />
    </div>
  )
}


class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attachList: [],
      title: '',
      titleUrl: '',
      isToHtml: false,
      attachUrl: '',
    };
  }

  componentDidMount() {
    const { auctionID } = this.props.match.params;
    htmlDetailInfo(auctionID).then(res => {
      if (res.data.code === 200) {
        if (res.data.data) {
          const { title, url, attachList } = res.data.data;
          let isToHtml, attachUrl;
          attachList.forEach((item) => {
            isToHtml = item.transcodingToHtml;
            attachUrl = item.url;
          });
          for (let i = 0; i < anchors.length; i++) {
            let part_name = anchors[i].id //id是每一部分的名称 比如subjectMatterIntroduction 标的物介绍 将后端传来的html动态赋值合并新属性html
            let html = this.clearStyle(res.data.data[part_name]) //清理样式 返回html
            Object.assign(anchors[i], { html })
          }

          this.setState({
            attachList: attachList,
            title: title,
            titleUrl: url,
            isToHtml: isToHtml,
            attachUrl: attachUrl
          });
        }
      } else {
        message.error(res.data.message);
      }

    });
  }

  clearStyle = (data) => {
    data = data
      .replace(/background: #[a-zA-Z0-9]{6};/g, "")
      .replace(/color: #[a-zA-Z0-9]{6};/g, "")
      .replace(/font-size: \d{0,2}\.?\d?p[t|x];/g, "");
    return data;
  };

  render() {
    const { title, isToHtml, attachUrl, attachList } = this.state;
    return (
      <div className="externalSource-auction-container">
        <div className="container_body">
          <div className="container_body_linkTitle" onClick={this.open}>{title}</div>
          {anchors.map((anchor, index) => {
            return <AnnounceMentPart index={index} html={anchor.html} key={index}></AnnounceMentPart>
          })}
        </div>
        <div className="container_right">
          <div className="accessory">
            <p>附件{!isToHtml && attachUrl && <span style={{ fontSize: 12 }}>(未解析)</span>}</p>
            {!attachUrl && <span style={{ fontSize: 12, display: 'inline-block', marginTop: 6, fontWeight: 500, }}>未找到相关附件</span>}
            <ul>
              {attachList && attachList.map((item, index) =>
                <li onClick={() => this.goToAccessoryDetail} key={index}>
                  {item.name}
                </li>
              )}
            </ul>
          </div>
          <AuctionAnchor />
          <div className="gradient" />
        </div>
      </div>
    )
  }
}
export default withRouter(Index);
