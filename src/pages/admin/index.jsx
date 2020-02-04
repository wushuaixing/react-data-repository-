/** admin * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import { Tabs, Tag, Table, Select, Input } from "antd";
import flex from "antd/es/tag";
import AccountManage from "./accountManage";
// ==================
// 所需的所有组件
// ==================
const { Search } = Input;
let storage = window.localStorage;

class  AdminList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	user: '',
			role: '',
		};
  }

  componentWillMount() {
    console.log(storage);
    this.setState({
			user: storage.userName,
			role: storage.userState,
		})
  }

//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
      const { }=this.props;
      const { user, role }=this.state;
        return(
          <div>
              <TopMenu user={user}/>
              <div className="main-body" >
                  <div className="left-menu" >
                      <LeftMenu role={role} />
                  </div>
                  <div className="right-content" style={{marginLeft:180, marginTop:-800}}>
                    <AccountManage />
                    <Search
                      placeholder="input search text"
                      onSearch={value => console.log(value)}
                      style={{ width: 200 }}
                    />
                  </div>
              </div>
          </div>
        );
    }
}
export default AdminList;
