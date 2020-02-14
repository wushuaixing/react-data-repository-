/** admin * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import AccountManage from "./accountManage";
import history from "../../history";


// ==================
// 所需的所有组件
// ==================


class  AdminList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	user: '',
			role: '',
		};
  }

  componentWillMount() {
  }



//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
      const { }=this.props;
      // const { user, role }=this.state;
      let storage = window.localStorage;
      const user = storage.userName;
      const role = storage.userState;
        return(
          <div>
            <TopMenu user={user} history={history} />
            <div className="main-body" >
              <div className="left-menu" >
                <LeftMenu role={role} history={history} />
              </div>
              <div className="right-content" style={{marginLeft:180, marginTop:-1200}}>
                <div style={{ opacity: 0, height: 0, display: 'none' }}>
                  <input type="text" />
                  <input type="password" />
                </div>
                <AccountManage />
              </div>
            </div>
          </div>
        );
    }
}
export default AdminList;
