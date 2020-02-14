import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';
import './style.scss';
import {getAvailableNav} from "../../server/api";
import {Link} from "react-router-dom";

const { SubMenu } = Menu;
let storage = window.localStorage;
const user = storage.userName;
const role = storage.userState;
const menuRoute= {
  7: "/UserList",
  18: "/UserCheck",
  8: "/structure",
  15: "/CheckAssetStrure",
  20: "/CheckAssetStrure",
  17: "/DocumentSearch",
  16: "/DocumentSearch",
  9: "/DocumentSearch",
  21:"/syncMonitor",
  22:"/structureMonitor",
};


const myMenu=[
/*  {
    title: '首页',
    // icon: 'page',
    path: '/'
  },
  {
    title: '其它',
    // icon: 'bulb',
    path: '/page/Other',
    subs: [
      {key: '/page/AlertDemo', title: '弹出框', icon: ''},
    ]
  },*/
  { title:"账号管理",icon:"book",index:'2',
    children:[
      { title:"结构化账号",path:"/account",icon:"info-circle", index:'1'},
      { title:"检查账号",path:"/page/check",icon:"branches", index:'3', },
    ]
  },
  { title:"资产结构化情况",icon:"issues-close", index:'4',
    children:[
      { title:"资产结构化",path:"/structureAsset",icon:"info-circle", index:'5',},
      { title:"文书搜索",path:"/page/ws",icon:"branches", index:'6', },
    ]
  },
  { title:"资产结构化情况检查",icon:"issues-close",index:'7',
    children:[
      { title:"资产结构化",path:"/page/structure",icon:"info-circle", index:'8', },
      { title:"文书搜索",path:"/page/ws",icon:"branches", index:'9', },
    ]
  },
  { path:"/page/pyhtonMonitor",title:"数据抓取与同步监控",icon:"issues-close", index:'10',},
  { path:"/page/strucMonitor",title:"结构化情况数据监控",icon:"issues-close", index:'11', },
/*  { path:"/page/6",title:"招投标结构化",icon:"issues-close", index:'12', },
  { path:"/page/7",title:"破产重组结构化",icon:"issues-close", index:'13', },*/

  ];

/*//从接口得到menu的数组
const createMenuTemp = () =>{

};*/

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ['sub1'],
      menuList: '',
      selectedKeys:[],
    };
  }

  componentDidMount() {
    getAvailableNav().then(res=>{
        if(res.data.code === 200 && storage["userState"]){
          // console.log(Object.values(res.data.data));
          this.setState({
              menuList:res.data.data,
            });
        }else if(res.data.code === 403){
          localStorage.removeItem("userState");
          localStorage.removeItem("userName");
          this.props.history.push('/login');
        }
    }).catch(()=>{
        // 异常处理
    })
  }

  createMenu =  (menuData) =>{  //创建菜单
    //let itemIndex = 0; //累计的每一项索引
    let submenuIndex = 0; //累计的每一项展开菜单索引
    let menu = [];
    const create = (menuData,el)=>{
      menuData.forEach((item) => {
        let _children = [];
        if(role === "结构化人员"){
          if(item.index === '4'||item.index === '5'||item.index === '6' ){
            if(item.children){
              create(item.children, _children);
              el.push(
                <SubMenu
                  key={`sub${item.index}`}
                  title={(
                    <span>
                    <Link to={item.path}>
                      <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                      <span>{item.title}</span>
                    </Link>
                </span>

                  )}
                >
                  { _children }
                </SubMenu>
              )
            } else {
              el.push(
                <Menu.Item key={item.index}>
                  <Link to={item.path}>
                    <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                    <span>{item.title}</span>
                  </Link>
                </Menu.Item>
              )
            }
          }
        }
        else if(role === "检查人员"){
          if(item.index === '7'||item.index === '8'||item.index === '9' ){
            if(item.children){
              create(item.children, _children);
              el.push(
                <SubMenu
                  key={`sub${item.index}`}
                  title={(
                    <span>
                    <Link to={item.path}>
                      <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                      <span>{item.title}</span>
                    </Link>
                </span>

                  )}
                >
                  { _children }
                </SubMenu>
              )
            } else {
              el.push(
                <Menu.Item key={item.index}>
                  <Link to={item.path}>
                    <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                    <span>{item.title}</span>
                  </Link>
                </Menu.Item>
              )
            }
          }
        }
        else if(role === "管理员"){
          if(item.index !== '4'||item.index !== '5'||item.index !== '6'||item.index !== '7'||item.index !== '8'||item.index !== '9')
          if(item.children){
            create(item.children, _children);
            el.push(
              <SubMenu
                key={`sub${item.index}`}
                title={(
                  <span>
                    <Link to={item.path}>
                      <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                      <span>{item.title}</span>
                    </Link>
                </span>

                )}
              >
                { _children }
              </SubMenu>
            )
          } else {
            el.push(
              <Menu.Item key={item.index}>
                <Link to={item.path}>
                  <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                  <span>{item.title}</span>
                </Link>
              </Menu.Item>
            )
          }
        }
      });

    };
    create(menuData,menu);
    return menu;
  };

  render() {
    const { menuList,selectedKeys } = this.state;

    return (
      <div>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          inlineCollapsed={this.state.collapsed}
          style={{ width: 180, height:1200 }}
          onClick={({key}) => this.setState({selectedKeys: [key]})}
        >
          {this.createMenu(myMenu)}
        </Menu>
      </div>
    );
  }
}

export default Sider;
