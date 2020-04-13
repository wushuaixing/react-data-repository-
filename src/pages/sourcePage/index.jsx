/** admin * */
import React from 'react';
import {withRouter} from "react-router-dom";
import { message } from 'antd';
import {htmlDetailInfo} from "../../server/api";
import 'antd/dist/antd.css';
import './style.scss';
import AnchorHtml from "./htmlPart";

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      attachList: [],
      title:'',
      titleUrl:'',
      isToHtml:false,
      attachUrl:'',
    };
  }

  componentDidMount() {
    const {Id} = this.props.match.params;
    htmlDetailInfo("1855771").then(res => {
      if(res.data.code===200){
        if(res.data.data){
          const{title,url,attachList,
            biddingAnnouncement,subjectMatterIntroduction}=res.data.data;
          let isToHtml,attachUrl;
          attachList.forEach((item) => {
            isToHtml=item.transcodingToHtml;
            attachUrl=item.url;
          });

          let bidding= "<div>" + biddingAnnouncement + "</div>";
          let subject = "<div>" + subjectMatterIntroduction + "</div>";
          bidding = this.clearStyle(bidding);
          subject = this.clearStyle(subject);

          this.setState({
            attachList: attachList,
            title:title,
            titleUrl:url,
            isToHtml:isToHtml,
            attachUrl:attachUrl,
            biddingHtml:bidding,
            subjectHtml:subject,
          });
        }
      }else{
        message.error(res.data.message);
      }

    });
  }

  clearStyle=(data)=> {
    data = data
      .replace(/background\: \#[a-zA-Z0-9]{6}\;/g, "")
      .replace(/color\: \#[a-zA-Z0-9]{6}\;/g, "")
      //.replace(/font\-weight\: bolder\;/g, "font-weight: inherit")
      .replace(/font\-size\: \d{0,2}\.?\d?p[t|x]\;/g, "");
    return data;
  };

  render() {
    const {title,isToHtml,attachUrl,attachList,biddingHtml,subjectHtml}=this.state;

    return (
      <div className="source-page">
        <div className="source-left">
          <div className="link-title" onClick={this.open}>
            {title}
          </div>
          <div className="detail">
            <div id="basic_usage" className="part">
              <div className="line"/>
              <p style={{left: 396}}>竞买公告</p>
              <div id="bidding-announcement" className="content" dangerouslySetInnerHTML={{ __html: biddingHtml }} />
              <div style={{clear: 'both'}}/>
            </div>

            <div id="static_position" className="part">
              <div className="line"/>
              <p style={{left: 382}}>标的物介绍</p>
              <div id="subject-matter-introduction" className="content" dangerouslySetInnerHTML={{ __html: subjectHtml }} />
            </div>

            <div id="book" className="part">
              <div className="line"/>
              <p style={{left: 382}}>竞价成功确认书</p>
              <div style={{height: 200}}>
                1111
              </div>
            </div>
          </div>
        </div>
        <div className="source-right">
          <div className="accessory">
            <p>附件{!isToHtml && attachUrl && <span style={{fontSize: 12}}>(未解析)</span>}</p>
            {!attachUrl && <span style={{fontSize: 12,display:'inline-block',marginTop: 6,fontWeight:500,}}>未找到相关附件</span>}
            <ul>
              {attachList && attachList.map((item)=>{
                return(
                  <li onClick={()=>this.goToAccessoryDetail}>
                    { item.name }
                  </li>
                )
              })}
            </ul>
        </div>
          <AnchorHtml />
        <div className="gradient"/>
      </div>
  </div>
    )
  }
}
export default withRouter(Index);
