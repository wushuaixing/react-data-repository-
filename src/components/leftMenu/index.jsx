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
  { title:"账号管理",icon:"book", index:'1',
    children:[
      { title:"结构化账号",path:"/home",icon:"info-circle", index:'2', subs:'1'},
      { title:"检查账号",path:"/page/check",icon:"branches", index:'3', },
    ]
  },
  { title:"资产结构化情况",icon:"issues-close", index:'4',
    children:[
      { title:"资产结构化",path:"/page/structure",icon:"info-circle", index:'5',},
      { title:"文书搜索",path:"/home",icon:"branches", index:'6', },
    ]
  },
  { title:"资产结构化情况检查",icon:"issues-close", index:'7',
    children:[
      { title:"资产结构化",path:"/home",icon:"info-circle", index:'8', },
      { title:"文书搜索",path:"/home",icon:"branches", index:'9', },
    ]
  },
  { path:"/home",title:"数据抓取与同步监控",icon:"issues-close", index:'10',},
  { path:"/home",title:"结构化情况数据监控",icon:"issues-close", index:'11', },
  { path:"/home",title:"招投标结构化",icon:"issues-close", index:'12', },
  { path:"/home",title:"破产重组结构化",icon:"issues-close", index:'13', },

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
          // const _menuData = item.children;
          // _menuData.forEach((_item) => {
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
          // });
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
      });
      /*for(let i=0;i<menuData.length;i++){
				if(menuData[i].children){  //如果有子级菜单
					let children = [];
					create(menuData[i].children,children);
					submenuIndex++;
					el.push(
						<SubMenu
							key={`sub${submenuIndex}`}
							title={(
								<span style={{ height:'100%',display: 'block' }}>
										<Icon type={menuData[i].icon} />{menuData[i].title}
									</span>
							)}
						>
							{children}
						</SubMenu>
					)
				}else{   //如果没有子级菜单
					//itemIndex++;
					el.push(
						<Menu.Item key={menuData[i].path} title={menuData[i].title}>
							<Link to={menuData[i].path}>
								{menuData[i].icon ? <Icon type={menuData[i].icon} /> : null}
								<span>{menuData[i].title}</span>
							</Link>
						</Menu.Item>
					)
				}
			}*/
    };
    create(menuData,menu);
    return menu;
  };

  render() {
    const { menuList } = this.state;
    const {role} =this.props;
    return (
      <div>
        <Menu
          defaultSelectedKeys={['1']}
          defaultOpenKeys={['sub1']}
          mode="inline"
          theme="dark"
          inlineCollapsed={this.state.collapsed}
          style={{ width: 180, height:800 }}
        >
          {this.createMenu(myMenu)}
{/*          <SubMenu
            // children={menuList}
            key="sub1"
            title={
              <span>
                <img style={{marginLeft:-10, marginRight:6 }} src={account} width="15" height="16" alt="" />
                <span>账号管理</span>
              </span>
            }
          >
            <Menu.Item style={{ marginLeft: -12 }} key="1">结构化账号</Menu.Item>
            <Menu.Item key="2">检查账号</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub2"
            title={
              <span>
                <Icon type="appstore" />
                <span>资产结构化情况</span>
              </span>
            }
          >
            <Menu.Item key="3">资产结构化</Menu.Item>
            <Menu.Item key="4">文书搜索</Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub3"
            title={
              <span>
                <Icon type="appstore" />
                <span>资产结构化情况检查</span>
              </span>
            }
          >
            <Menu.Item key="9">资产结构化检查</Menu.Item>
            <Menu.Item key="10">文书搜索</Menu.Item>
          </SubMenu>
          <Menu.Item key="5">
            <Icon type="pie-chart" />
            <span>数据抓取与同步监控</span>
          </Menu.Item>
          <Menu.Item key="6">
            <Icon type="pie-chart" />
            <span>结构化情况数据监控</span>
          </Menu.Item>
          <Menu.Item key="7">
            <Icon type="pie-chart" />
            <span>招投标结构化</span>
          </Menu.Item>
          <Menu.Item key="8">
            <Icon type="pie-chart" />
            <span>破产重组结构化</span>
          </Menu.Item>*/}
        </Menu>
      </div>
    );
  }
}

export default Sider;
