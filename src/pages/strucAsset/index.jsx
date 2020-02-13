/** home * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
import ContentMain from "../content";
import Structure from "../structure";
import Asset from "../structure/assetStruc";
import StructureDetail from "../structure/detail";
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

  componentWillMount() {
  }

  render() {
      let storage = window.localStorage;
      const user = storage.userName;
      const role = storage.userState;
        return(
          <div>
              <TopMenu user={user}/>
              <div className="main-body" >
                <div className="left-menu" >
                  <LeftMenu role={role} />
                </div>
                <div className="right-content" style={{marginLeft:180, marginTop:-1200}}>
                  {/*<Structure />*/}
                  <Asset />
                </div>
              </div>
          </div>
        );
    }
}
export default structureAsset;
