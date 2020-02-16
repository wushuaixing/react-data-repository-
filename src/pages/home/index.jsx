/** home * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import StructureRoute from "../../router/structureRoute";
import AdminRoute from "../../router/adminRoute";


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
        return(
          <div>
              <TopMenu user={user}/>
              <div className="main-body">
                <div className="left-menu">
                  <LeftMenu role={role} />
                </div>
                <div className="right-content" style={{marginLeft:180, marginTop:-900}}>
                    {/*<Route path="/index" exact component={AccountManage} />
                    <Route path="/index/check" component={CheckList} />*/}
                  {str && <StructureRoute />}
                  {admin && <AdminRoute />}
                </div>
              </div>
          </div>
        );
    }
}
export default Index;
