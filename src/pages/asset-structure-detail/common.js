import React from 'react';

export const Item = (props) => (props.hide ? null : (
	<li>
		<div className="list_title">{props.title}</div>
		{props.content || props.children}
	</li>
));
