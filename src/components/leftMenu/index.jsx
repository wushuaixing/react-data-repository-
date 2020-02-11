import React from 'react';
import { Menu, Icon } from 'antd';
import 'antd/dist/antd.css';
import './style.scss';
import {getAvailableNav} from "../../server/api";
import {Link} from "react-router-dom";

const { SubMenu } = Menu;

const menuRoute= {
  7: "/UserList",
  18: "/UserCheck",
  8: "/AssetStructure",
  15: "/CheckAssetStrure",
  20: "/CheckAssetStrure",
  17: "/DocumentSearch",
  16: "/DocumentSearch",
  9: "/DocumentSearch",
  21:"/syncMonitor",
  22:"/structureMonitor",
};

const menu={"code":200,
  "data":{
  "账号管理":[
    {"id":7,"title":"结构化账号"},
    {"id":18,"title":"检查账号"}
    ],
    "资产结构化":[
      {"id":16,"title":"文书搜索"},
      {"id":19,"title":"检查详情"},
      {"id":20,"title":"资产结构化列表"}
      ],
    "数据抓取与同步监控":[
      {"id":21,"title":"数据抓取与同步监控"}
      ],
    "结构化情况数据监控":[
      {"id":22,"title":"结构化情况数据监控"}
      ]
  },
  "message":"成功"};

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
      { title:"结构化账号",key:"/page/admin",icon:"info-circle", index:'1'},
      { title:"检查账号",key:"/page/check",icon:"branches", index:'3', },
    ]
  },
  { title:"资产结构化情况",icon:"issues-close", index:'4',
    children:[
      { title:"资产结构化",key:"/page/structure",icon:"info-circle", index:'5',},
      { title:"文书搜索",key:"/page/1",icon:"branches", index:'6', },
    ]
  },
  { title:"资产结构化情况检查",icon:"issues-close",index:'7',
    children:[
      { title:"资产结构化",key:"/page/2",icon:"info-circle", index:'8', },
      { title:"文书搜索",key:"/page/3",icon:"branches", index:'9', },
    ]
  },
  { key:"/page/4",title:"数据抓取与同步监控",icon:"issues-close", index:'10',},
  { key:"/page/5",title:"结构化情况数据监控",icon:"issues-close", index:'11', },
  { key:"/page/6",title:"招投标结构化",icon:"issues-close", index:'12', },
  { key:"/page/7",title:"破产重组结构化",icon:"issues-close", index:'13', },

  ];

//从接口得到menu的数组
const createMenuTemp = () =>{

};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      openKeys: ['sub1'],
      menuList: myMenu,
      selectedKeys:[],
    };
  }

  componentWillMount() {
    getAvailableNav().then(res=>{
        if(res.data.code === 200){
            console.log(res.data.data);
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
        if(item.children){
          create(item.children, _children);
            el.push(
              <SubMenu
                key={`sub${item.index}`}
                title={(
                  <span>
                    <Link to={item.key}>
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
              <Link to={item.key}>
                <img style={{marginLeft:-10, marginRight:6 }} src={item.icon} width="15" height="16" alt="" />
                <span>{item.title}</span>
              </Link>
            </Menu.Item>
          )
        }
      });
    };
    create(menuData,menu);
    return menu;
  };

  render() {
    const { menuList,selectedKeys } = this.state;
    const {role} =this.props;
    return (
      <div>
        <Menu
          defaultSelectedKeys={['/page/admin']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          selectedKeys={selectedKeys}
          inlineCollapsed={this.state.collapsed}
          style={{ width: 180, height:800 }}
          onClick={({key}) => this.setState({selectedKeys: [key]})}
        >
          {this.createMenu(myMenu)}
        </Menu>
      </div>
    );
  }
}

export default Sider;
