/** admin * */
import React from 'react';
import StructureDetail from './detail';
// ==================
// 所需的所有组件
// ==================


class  AdminList extends React.Component {
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
            <StructureDetail />
          </div>
        );
    }
}
export default AdminList;
