import React from 'react';
import { withRouter } from "react-router-dom";
import { message, Anchor } from 'antd';
import { htmlDetailInfo } from "@api";
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

function AttachListItem(props) {
  return (
    <div onClick={props.handleClick} className="accessory-list_item">
      <span>{props.name}</span>
      {!props.transcodingToHtml&&<span>未解析</span>}
    </div>
  )
}

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '', //标题
      titleUrl: '', //标题链接
      attachList: []// 存放文件下载列表 包括 附件ID 附件文件名称 是否已转码到HTML 附件URL
    };
  }

  componentDidMount() {
    const { auctionID } = this.props.match.params;
    htmlDetailInfo(auctionID).then(res => {
      if (res.data.code === 200) {
        const data = res.data.data;
        const { title, url, attachList } = data;
        for (let i = 0; i < anchors.length; i++) {
          let part_name = anchors[i].id //id是每一部分的名称 比如subjectMatterIntroduction 标的物介绍 将后端传来的html动态赋值合并新属性html
          let html = this.clearStyle(data[part_name]) //清理样式 返回html
          Object.assign(anchors[i], { html })
        }
        this.setState({
          attachList,
          title,
          titleUrl: url
        });
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
  openTitleUrl() {
    window.open(this.state.titleUrl)
  }
  downloadAttachFile(url){
    window.open(url)
  }
  render() {
    const { title, attachList } = this.state;
    return (
      <div className="externalSource-auction-container">
        <div className="container_body">
          <div className="container_body_linkTitle" onClick={this.openTitleUrl.bind(this)}>{title}</div>
          {anchors.map((anchor, index) => {
            return <AnnounceMentPart index={index} html={anchor.html} key={index}></AnnounceMentPart>
          })}
        </div>
        <div className="container_right">
          <div className="accessory">
            <div className="accessory_title">附件</div>
            {(attachList.length > 0) ?
              <div className="accessory-list">
                {
                  attachList.map((item, index) =>
                    <AttachListItem handleClick={this.downloadAttachFile.bind(this,item.url)} name={item.name} key={index} transcodingToHtml={item.transcodingToHtml}></AttachListItem>
                  )
                }
              </div> :
              <span className="accessory-notFound">未找到相关附件</span>
            }
          </div>
          <AuctionAnchor />
        </div>
      </div>
    )
  }
}
export default withRouter(Index);
