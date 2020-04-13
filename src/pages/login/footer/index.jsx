/** Login * */
import React from 'react';
import miniLogo from '../../../assets/img/loginPage-logo.png';
class Footer extends React.Component {
	render() {
		return (
			<div className="yc-login-footer">
				<div className="footer-container">
					<div className="footer-tech">
						<img src={miniLogo} alt="" className="footer-tech-logo" />
						<span>杭州源诚科技有限公司 技术支持</span>
					</div>
					<div className="footer-copyright">
						<span>
							Copyright©2019杭州源诚科技有限公司 备案号：浙ICP备17030D14
						</span>
					</div>
				</div>
			</div>
		);
	}
}

export default Footer;
