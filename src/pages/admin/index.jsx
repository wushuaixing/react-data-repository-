/** admin * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import AccountManage from "./accountManage";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ContentMain from "../content";

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
    // this.setState({
		// 	user: storage.userName,
		// 	role: storage.userState,
		// })
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
            <Router>
              {/*<TopMenu user={user}/>*/}
              {/*<div className="main-body" >*/}
                {/*<div className="left-menu" >*/}
                  {/*<LeftMenu role={role} />*/}
                  {/*/!*<CustomMenu/>*!/*/}
                {/*</div>*/}
                {/*<div className="right-content" style={{marginLeft:180, marginTop:-800}}>*/}
                  {/*<ContentMain />*/}
                  <AccountManage />
                  {/*/!*<ContentMain/>*!/*/}


                  {/*/!*<Search*/}
                      {/*placeholder="input search text"*/}
                      {/*onSearch={value => console.log(value)}*/}
                      {/*style={{ width: 200 }}*/}
                    {/*/>*/}
                  {/**!/*/}
                {/*</div>*/}
              {/*</div>*/}
            </Router>
          </div>
        );
    }
}
export default AdminList;
