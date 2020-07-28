import React from 'react';
import { BreadCrumb } from "@/components/common";
import { Button } from "antd";
import './style.scss';

const ItemTag = props => (
	<li>
		<div className='tag-item-wrapper'>
			{props.text}
			{props.tag ? <div className="tag-item-text">企业名称疑似有误</div> : null }
		</div>
	</li>
);

const ItemList = props =>(
	<div className="detail-item_list" style={props.style||{}}>
		{props.title ? <div className="detail-item_list__title">{props.title}</div> : null }
		<div className="detail-item_list__text">{props.children}</div>
	</div>
);

const Item = props =>(
	<div className="detail-item">
		<div className="detail-item_title">{props.title}</div>
		<div className="detail-item_content">
			{props.children}
		</div>
	</div>
);

export default class BankruptDetail extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="yc-bankrupt-detail-wrapper">
				<div className="detail-content-wrapper">
					<BreadCrumb texts={['破产重组结构化','详情']} suffix={
						<div className="detail-content-crumb_suffix">
							<Button type="primary" ghost style={{width:90}}>返回</Button>
						</div>
					} />
					<div className="detail-content">
						<Item title='自动退回'>
							<span style={{ color:"#FB0037" }}>企业名称疑似有误，建议核实</span>
						</Item>
						<Item title='基本信息'>
							<ItemList title='标题：'>【第一次拍卖】重庆市九龙坡区马王四村11号2-2#房屋</ItemList>
							<ItemList title='发布时间：'>2019-12-13</ItemList>
							<ItemList title='当前状态：'>自动退回</ItemList>
							<ItemList title='结构化记录：'>
								<ul className="detail-content-item_ul">
									<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
									<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
									<li>2018-11-07 21:02:36 翁硕吟结构化  初次结构化</li>
								</ul>
							</ItemList>
						</Item>
						<Item title='破产公告原文'>
							<ItemList>温州市瓯海区人民法院法律文书文稿
								浙江省温州市瓯海区人民法院
								公 告

								（2019）浙0304破16号之一
								本院根据申请人林炳洪的申请于2019年7月29日裁定受理温州市晨乐鞋业有限公司破产清算一案。查明，温州市晨乐鞋业有限公司除银行存款3.62元外无其他财产，上述银行存款不足以清偿破产费用。本院认为，债务人温州市晨乐鞋业有限公司无财产清偿破产费用，依法应予以终结破产程序。依照《中华人民共和国企业破产法》第四十三条、第一百零七条之规定，本院于2019年10月9日裁定宣告温州市晨乐鞋业有限公司破产并终结温州市晨乐鞋业有限公司破产程序。
								特此公告</ItemList>
						</Item>
						<Item title='角色信息'>
							<div style={{display:'flex'}}>
								<ItemList title='破产管理人：' style={{maxWidth:500,paddingRight:120}}>
									<ul className="detail-content-item_ul">
										<ItemTag text='温州市晨乐鞋业有限公司温州市晨乐鞋业有限公司温州市晨乐鞋业有限公司' tag />
										<ItemTag text='炳洪的申请于2019年7月29日裁定受' tag />
										<ItemTag text='依法应予以终结破产程序。依照《中华人民共和国企' />
									</ul>
								</ItemList>
								<ItemList title='申请人：'>--</ItemList>
							</div>
							<ItemList title='破产管理人：'>--</ItemList>
						</Item>
					</div>
				</div>
			</div>
		)
	}
}
