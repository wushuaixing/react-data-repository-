import React from 'react';
import { Menu,message } from 'antd';
import { getAvailableNav, } from "@api";
import { Link, withRouter } from "react-router-dom";
import admin from "@/assets/img/admin.png";
import check from "@/assets/img/check.png";
import user from "@/assets/img/user.png";
import sync from "@/assets/img/sync.png";
import structure from "@/assets/img/structure.png";
import './index.scss'

const menuRoute = {
  7: "/index/structureUser", //结构化账号（管理员）
  18: "/index/checkUser",//检查账号（管理员）
  8: "/index",//资产结构化列表（结构化人员）
  15: "/index",//资产结构化列表检查（检查人员）
  20: "/index/assetList",//资产结构化列表（管理员）
  // 17: "/index/documentSearch",//文书搜索（检查人员）
  16: "/documentSearch",//文书搜索（管理员+检查人员）
  9: "/documentSearch",//文书搜索（结构化人员）
  21: "/index/syncMonitor",//抓取与同步监控（管理员）
  22: "/index/structureMonitor",//结构化情况监控（管理员）
};


// const sourceData = {
//   "任务管理": [{
//     "id": 14,
//     "title": "结构化任务分配"
//   }],
//   "账号管理": [
//     {
//       "id": 7,
//       "title": "结构化账号"
//     },
//     {
//       "id": 18,
//       "title": "检查账号"
//     }
//   ],
//   "结构化检查": [
//     {
//       "id": 16,
//       "title": "文书搜索"
//     },
//     {
//       "id": 19,
//       "title": "检查详情"
//     },
//     {
//       "id": 20,
//       "title": "资产结构化列表"
//     }
//   ]
// };


const getSource = (data={})=>{
  const keysArray = Object.keys(data);
  if(keysArray.length===0) return [];
  // 获取 menu icon
  const getMenuIcon = (text) => {
    if(/资产结构化/.test(text))return check;
    if(/数据监控/.test(text))return structure;
    if(/同步监控/.test(text))return sync;
    if(/账号/.test(text))return admin;
    if(/任务/.test(text))return admin;
    return false;
  };
  return keysArray.map((i,index)=>({
    title:i,
    img:getMenuIcon(i),
    children:(data[i]).map(item=>({
      ...item,
      parentIndex:index,
      link:menuRoute[item.id]
    })),
  }))
};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ["subKey_0"],
      menuList: [],
      defaultKey: [],
      menuSource: [],
      selectedKeys:[],
    }
  }

  componentDidMount() {
    getAvailableNav().then(res=>{
      if(res.data.code ===200){
        const { pathname } = this.props.location;
        const { openKeys } = this.state;
        const menuSource = getSource(res.data.data);
        let selectedKeys =[];
        let _openKey = "";
        menuSource.forEach(i=>{
          (i.children||[]).forEach(item=>{
            if ( pathname === item.link ) {
              selectedKeys = [item.id.toString()];
              _openKey = `subKey_${item.parentIndex}`;
            }
          })
        });
        let _openKeys = openKeys.includes(_openKey)?openKeys:[...openKeys,_openKey];
        this.setState({
          menuSource,
          selectedKeys:selectedKeys.includes('7')?selectedKeys:[...selectedKeys,'7'],
          openKeys:_openKeys })
      }
    })
  }

  onMenuItemClick = ({key}) =>this.setState({selectedKeys:[key] });

  onOpenChange=(key) => this.setState({  openKeys: key });

  render() {
    const { openKeys, menuSource,selectedKeys } = this.state;
    console.log(openKeys);
    return (
      <Menu
        mode="inline"
        theme="dark"
        inlineIndent={14}
        openKeys={openKeys}
        selectedKeys={selectedKeys}
        onOpenChange={this.onOpenChange}
        onClick={this.onMenuItemClick}
        id="sider-menu-wrapper"
      >
        {
          menuSource.map(({title,children,img},index)=>(
            <Menu.SubMenu
              className="sider-menu_sub-menu"
              key={`subKey_${index}`}
              title={
                <span className='sider-menu_sub-menu_title'>
                  <img style={{ marginRight: 8, marginTop: -4 }} src={ img || structure} width="15" height="16" alt="" />
                  {title}
                </span>}
            >
              {
                children.map((item,_index)=>(
                  <Menu.Item key={item.id} className="sider-menu_item item_position">
                    {
                      item.title === '文书搜索' ? (
                        <div onClick={(e) => { e.stopPropagation();window.open('/documentSearch') }}>
                          <div className='item_remark' />
                          {item.title}
                        </div>
                      ): ( item.link ? <Link to={item.link}>{item.title}</Link> : (
                          <div onClick={(e) => { e.stopPropagation();message.warning('暂未开发',1) }}>
                            <div className='item_remark' />
                            {item.title}
                          </div>
                        ))
                    }
                  </Menu.Item>
                ))
              }
            </Menu.SubMenu>
          ))
        }
      </Menu>
    );
  }
}
// Todo network 网络延迟显示慢的问题
export default withRouter(Sider)
