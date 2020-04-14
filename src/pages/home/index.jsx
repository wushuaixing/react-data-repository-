/** home * */
import React from 'react';
import TopMenu from "../../components/presentational/topMenu";
import LeftMenu from '../../components/presentational/leftMenu';
import StructureRoute from "../../router/structureRoute";
import AdminRoute from "../../router/adminRoute";
import CheckRoute from "../../router/checkRoute";
import './style.scss'
class  Index extends React.Component {
  render() {
      const user = window.localStorage.userName;
      const role = window.localStorage.userState;
        return(
          <div >
              <TopMenu user={user}/>
              <div className="yc-main-body">
                <div className="yc-left-menu" >
                  <LeftMenu role={role} />
                </div>
                <div className="yc-right-content">
                  { role === '结构化人员' && <StructureRoute />}
                  { role === '管理员' && <AdminRoute />}
                  { role === '检查人员' && <CheckRoute />}
                </div>
              </div>
          </div>
        );
    }
}
export default Index;
