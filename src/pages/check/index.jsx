/** check * */
import React from 'react';
import TopMenu from "../../components/topMenu";
import LeftMenu from '../../components/leftMenu';
// ==================
// 所需的所有组件
// ==================

class  CheckList extends React.Component {
	render() {
		return(
			<div>
				<TopMenu />
				<div className="main-body">
					<div className="left-menu">
						<LeftMenu />
					</div>
					<div className="right-content"/>
				</div>
			</div>
		);
	}
}
export default CheckList;


