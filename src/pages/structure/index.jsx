/** admin * */
import React from 'react';
import StructureDetail from './detail';
import {BrowserRouter as Router} from "react-router-dom";
import Asset from "./assetStruc";
// ==================
// 所需的所有组件
// ==================


class  Structure extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

		};
  }

  componentWillMount() {

  }

//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
      const { }=this.props;
        return(
          <div>
            <Router>
              <Asset />
              {/*<StructureDetail />*/}
            </Router>
          </div>
        );
    }
}
export default Structure;
