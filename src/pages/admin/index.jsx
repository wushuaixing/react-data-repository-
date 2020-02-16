/** admin * */
import React from 'react';
import AccountManage from "./accountManage";

class  Index extends React.Component {
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
      // const { user, role }=this.state;
      let storage = window.localStorage;
        return(
          <div>
            <AccountManage />
          </div>
        );
    }
}
export default Index;
