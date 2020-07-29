import React from 'react';

export const ItemTag = props => (
	<li>
		<div className='tag-item-wrapper'>
			{props.text}
			{props.tag ? <div className="tag-item-text">企业名称疑似有误</div> : null }
		</div>
	</li>
);

export const ItemList = props =>(
	<div className={(['detail-item_list',...[props.className||'']]).join(' ')} style={props.style||{}}>
		{props.title||!props.noTitle ? <div className="detail-item_list__title">
			<span className={props.required &&"detail-item_list__required"}>{props.title}</span>
		</div> : null }
		<div className="detail-item_list__text">{props.children}</div>
	</div>
);

export const Item = props =>(
	<div className="detail-item" style={props.style||{}}>
		<div className="detail-item_title">{props.title}</div>
		<div className="detail-item_content">
			{props.children}
		</div>
	</div>
);
