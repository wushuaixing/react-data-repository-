/** Login * */
import React from 'react';
import miniLogo from '../../../assets/img/logo_blue.png';
import 'antd/dist/antd.css';
import '../style.scss';

class Footer extends React.Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	render() {
		return (
			<div className="yc-login-footer">
				<div className="footer-container">
					<div className="footer-tech">
						<img src={miniLogo}  alt="" />
						<span style={{marginLeft:6}}>杭州源诚科技有限公司 技术支持</span>
					</div>
					<div className="footer-copyright">
							<span>
								Copyright©2019杭州源诚科技有限公司 备案号：浙ICP备17030D14
							</span
							>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
