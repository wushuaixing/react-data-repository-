import React from "react";
import { Menu, message } from "antd";
import { getAvailableNav } from "@api";
import { Link, withRouter } from "react-router-dom";
import SpinLoading from "@/components/Spin-loading";
import admin from "@/assets/img/admin.svg";
import check from "@/assets/img/check.svg";
// import user from "@/assets/img/user.png";
import sync from "@/assets/img/structure.png";
import structure from "@/assets/img/structures.png";
import search from "@/assets/img/search.svg";
import debt from "@/assets/img/debt.svg";
import backrupt from "@/assets/img/backrupt.svg";
import "./index.scss";

const menuRoute = {
  7: ["/index/structureUser", "/index"], //结构化账号（管理员）
  18: "/index/checkUser", //检查账号（管理员）
  8: ["/index", "/index/structureDetail"], //资产结构化列表（结构化人员）
  15: ["/index", "/index/structureDetail"], //资产结构化列表检查（检查人员）
  20: ["/index/assetList", "/index/structureDetail"], //资产结构化列表（管理员）
  16: "/documentSearch", //文书搜索（管理员+检查人员）
  9: "/documentSearch", //文书搜索（结构化人员）
  25: ["/index/bankrupt", "/index/bankrupt/detail"], //破产重组结构化（结构化人员）
  11: ["/index/bankrupt", "/index/bankrupt/detail"], //破产重组结构化（结构化人员）
  26: ["/index/debtList", "/index/debtDetail"],
  27: ["/index/debtList", "/index/debtDetail"],
  28: ["/index/debtList", "/index/debtDetail"],
  // 21: "/index/syncMonitor",//抓取与同步监控（管理员）
  // 22: "/index/structureMonitor",//结构化情况监控（管理员）
  // 17: "/index/documentSearch",//文书搜索（检查人员）
};

const getSource = (data = {}) => {
  const keysArray = Object.keys(data);
  if (keysArray.length === 0) return [];
  // 获取 menu icon
  const getMenuIcon = (text) => {
    if (/金融资产结构化/.test(text)) return debt;
    if (/资产结构化/.test(text)) return structure;
    if (/数据监控/.test(text)) return structure;
    if (/结构化情况监控/.test(text)) return sync;
    if (/账号/.test(text)) return admin;
    if (/任务/.test(text)) return admin;
    if (/检查/.test(text)) return check;
    return false;
  };
  const link = (id) => {
    if (menuRoute[id])
      return Array.isArray(menuRoute[id]) ? menuRoute[id][0] : menuRoute[id];
    return null;
  };
  return keysArray
    .map((i, index) => ({
      title: i,
      img: getMenuIcon(i),
      children: data[i]
        .map((item) => ({
          ...item,
          parentIndex: index,
          link: link(item.id),
          backup: menuRoute[item.id],
        }))
        .filter((i) => i.link),
    }))
    .filter((i) => i.children.length);
  // .concat({
  //   title:'金融资产结构化',
  //   children: [
  //     {
  //       title:'债权结构化',
  //       id:502,
  //       link:'/index/debtList',
  //       backup:'/houseHoldDetail',
  //     }
  //   ]
  // })
};

class Sider extends React.Component {
  // submenu keys of first level
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      openKeys: ["subKey_0", "subKey_1", "subKey_2", "subKey_3"],
      menuList: [],
      defaultKey: [],
      menuSource: [],
      selectedKeys: [],
    };
    this.pathname = "";
  }

  componentDidMount() {
    // 判断是否符合path

    getAvailableNav()
      .then((res) => {
        if (res.data.code === 200) {
          const { openKeys } = this.state;
          const menuSource = getSource(res.data.data);
          const { selectedKeys, _openKey } = this.toGetSelectInfo(menuSource);
          let _openKeys = openKeys.includes(_openKey)
            ? openKeys
            : [...openKeys, _openKey];
          this.setState({
            menuSource,
            // selectedKeys:selectedKeys.includes('7')?selectedKeys:[...selectedKeys,'7'],
            selectedKeys: selectedKeys,
            openKeys: _openKeys,
          });
        }
      })
      .finally(() => this.setState({ loading: false }));
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    const {
      history: {
        location: { pathname },
      },
    } = nextProps;
    if (this.pathname !== pathname) {
      const { menuSource, openKeys } = this.state;
      const { selectedKeys, _openKey } = this.toGetSelectInfo(
        menuSource,
        pathname
      );
      let _openKeys = openKeys.includes(_openKey)
        ? openKeys
        : [...openKeys, _openKey];
      this.setState({
        selectedKeys: selectedKeys,
        openKeys: _openKeys,
      });
    }
  }

  toGetSelectInfo = (menuSource, newPathname) => {
    const { pathname } = this.props.location;
    let selectedKeys = [];
    let _openKey = "";
    const linkCheck = (link, pathname) => {
      if (!link) return false;
      if (typeof link === "string") return new RegExp(link).test(pathname);
      if (Array.isArray(link))
        return link.some((i) => new RegExp(i).test(pathname));
      return false;
    };
    menuSource.forEach((i) => {
      (i.children || []).forEach((item) => {
        if (linkCheck(item.backup, newPathname || pathname)) {
          selectedKeys = [item.id.toString()];
          _openKey = `subKey_${item.parentIndex}`;
        }
      });
    });
    const defaultKey = menuSource.length
      ? [((menuSource[0] || {}).children[0] || {}).id + ""]
      : [];
    return {
      selectedKeys: selectedKeys.length ? selectedKeys : defaultKey,
      _openKey,
    };
  };

  onMenuItemClick = ({ key }) => this.setState({ selectedKeys: [key] });

  onOpenChange = (key) => this.setState({ openKeys: key });

  render() {
    const { openKeys, menuSource, selectedKeys, loading } = this.state;
    const isAdmin = localStorage.getItem("userState") === "管理员";
    const {
      history: {
        location: { pathname },
      },
    } = this.props;
    this.pathname = pathname;
    return (
      <SpinLoading loading={loading} wrapperClassName="yc-sider-left">
        {menuSource.length === 0 && <div style={{ minHeight: 350 }} />}
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
          {!isAdmin && (
            <Menu.Item key="documentSearch" className="document-search">
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  window.open("/documentSearch");
                }}
              >
                <img src={search} alt="" style={{height:16}}/> 文书搜索
              </div>
            </Menu.Item>
          )}
          {menuSource.map(({ title, children, img }, index) => (
            <Menu.SubMenu
              className="sider-menu_sub-menu"
              key={`subKey_${index}`}
              title={
                <span className="sider-menu_sub-menu_title">
                  <img
                    style={{ marginRight: 8, marginTop: -4 }}
                    src={img || backrupt}
                    width="15"
                    height="16"
                    alt=""
                  />
                  {title}
                </span>
              }
            >
              {children.map((item, _index) => (
                <Menu.Item
                  key={item.id}
                  className="sider-menu_item item_position"
                >
                  {item.link ? (
                    <Link to={item.link}>{item.title}</Link>
                  ) : (
                    <div
                      onClick={(e) => {
                        e.stopPropagation();
                        message.warning("暂未开发", 1);
                      }}
                    >
                      <div className="item_remark" />
                      {item.title}
                    </div>
                  )}
                </Menu.Item>
              ))}
            </Menu.SubMenu>
          ))}
        </Menu>
      </SpinLoading>
    );
  }
}
// Todo network 网络延迟显示慢的问题
export default withRouter(Sider);
