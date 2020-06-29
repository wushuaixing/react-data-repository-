import React from 'react';
import { withRouter } from "react-router-dom";
import { message, Anchor } from 'antd';
import { htmlDetailInfo } from "@api";
import pic from "@/assets/img/pic.png";
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
];

function AuctionAnchor() {
  const icon = <img src={pic} alt="有图片" style={{width: 16, height: 16, marginLeft: 8}}/>;
  return (
    <Anchor showInkInFixed={true}>
      {
        anchors.map(anchor =>
          <Link href={`#${anchor.id}`}
            title={
              <span>
                <span>{anchor.title}</span>
                {anchor.isImgTag ? icon : null}
              </span>
            }
            key={anchor.id} >
          </Link>
        )
      }
    </Anchor>
  );
}

function AnnounceMentPart(props) {
  const { index,html:__html } = props;
  // TODO img 请求问题
  // const  __html = (html||'').replace(/src="http:\/\//g,'src="');
  return (
    <div id={anchors[index].id} className="container_body_eachPart">
      <div className="line" />
      <div className="title">{anchors[index].title}</div>
      <div className="content" dangerouslySetInnerHTML={{ __html }} />
    </div>
  )
}

function AttachListItem(props) {
  return (
    <div onClick={props.handleClick} className="accessory-list_item">
      <span>{props.name}</span>
      {/* {!props.transcodingToHtml && <span>未解析</span>} */}
    </div>
  )
}

//寻找是否有图片标签
function findImgTag(html) {
  const reg = /<img*/;
  return reg.test(html)
}
class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      title: '', //标题
      titleUrl: '', //标题链接
      attachList: [],// 存放文件下载列表 包括 附件ID 附件文件名称 是否已转码到HTML 附件URL
      showAnchors: []
    };
  }

  componentDidMount() {
    const { auctionID } = this.props.match.params;
    htmlDetailInfo(auctionID).then(res => {
      if (res.data.code === 200) {
        const data = res.data.data;
        const { title, url, attachList } = data;
        for (let i = 0; i < anchors.length; i++) {
          let part_name = anchors[i].id; //id是每一部分的名称 比如subjectMatterIntroduction 标的物介绍 将后端传来的html动态赋值合并新属性html
          let html = this.clearStyle(data[part_name]); //清理样式 返回html
          let isImgTag = findImgTag(html); //判断是否有图片标签
          html ? Object.assign(anchors[i], { html, isImgTag }) : anchors.splice(i, 1)
        }
        this.setState({
          attachList,
          title,
          titleUrl: url,
          showAnchors: anchors
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
  downloadAttachFile(data) {
    window.open(data.url)//如果未解析为网页 直接下载
  }
  render() {
    const { title, attachList } = this.state;
    return (
      <div className="externalSource-auction">
        <div className="linkTitle" onClick={this.openTitleUrl.bind(this)}>{title}</div>
        <div className="externalSource-auction-container">
          <div className="container_body">
            {anchors.map((anchor, index) => {
              return <AnnounceMentPart index={index} html={anchor.html} key={index}/>
            })}
          </div>
          <div className="container_right">
            <AuctionAnchor />
            <div className="accessory">
              <div className="accessory_title">附件</div>
              {(attachList.length > 0) ?
                <div className="accessory-list">
                  {
                    attachList.map((item, index) =>
                      <AttachListItem
                          handleClick={this.downloadAttachFile.bind(this, item)}
                          name={item.name} key={index}
                          transcodingToHtml={item.transcodingToHtml}
                      />
                    )
                  }
                </div> :
                <span className="accessory-notFound">未找到相关附件</span>
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Index);
