/** home * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import StructureRoute from "../../router/structureRoute";
import AdminRoute from "../../router/adminRoute";
import Structure from "../structure";
import Asset from "../structure/assetStruc";
import StructureDetail from "../structure/detail";
import history from "../../history";
// ==================
// 所需的所有组件
// ==================


class  structureAsset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	user: '',
			role: '',
		};
  }

  componentDidMount() {
  }

  render() {
      let storage = window.localStorage;
      const user = storage.userName;
      const role = storage.userState;
      let str=false;let admin=false;let check=false;
      if(role==="结构化人员"){str=true}
      if(role==="管理员"){admin=true}
        return(
          <div>
              <TopMenu user={user} history={history} />
              <div className="main-body" >
                <div className="left-menu" >
                  <LeftMenu role={role} history={history} />
                </div>
                <div className="right-content" style={{marginLeft:180, marginTop:-1200}}>
                  {str && <StructureRoute />}
                  {admin && <AdminRoute />}
                </div>
              </div>
          </div>
        );
    }
}
export default structureAsset;
