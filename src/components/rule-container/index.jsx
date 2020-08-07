import React from 'react';

export const rule = (Component)=>{
	const ruleSource = {
		rule:'check',
	};
	return class extends React.Component {
		render() {
			return <Component ruleSource={ruleSource} {...this.props}/>
		}
	}
};

