/** home * */
import React from 'react';
import TopMenu from "../../components/layout/topMenu";
import LeftMenu from '../../components/layout/leftMenu';
import StructureRoute from "../../routers/structureRoute";
import AdminRoute from "../../routers/adminRoute";
import CheckRoute from "../../routers/checkRoute";
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
