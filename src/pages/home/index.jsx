/** home * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import StructureRoute from "../../router/structureRoute";
import AdminRoute from "../../router/adminRoute";
import CheckRoute from "../../router/checkRoute";

class  Index extends React.Component {
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
      if(role==="检查人员"){check=true}
        return(
          <div >
              <TopMenu user={user}/>
              <div className="main-body"
                   style={{marginTop:-2,backgroundColor:'#293038',minHeight:1200}}
              >
                <div className="left-menu"  style={{float:'left',width:180}}>
                  <LeftMenu role={role} />
                </div>
                <div className="right-content" style={{overflow:'hidden',backgroundColor:'#ffffff',minHeight:1200}}>
                  {str && <StructureRoute />}
                  {admin && <AdminRoute />}
                  {check && <CheckRoute />}
                </div>
              </div>
          </div>
        );
    }
}
export default Index;
