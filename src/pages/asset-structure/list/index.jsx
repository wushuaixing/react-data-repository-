import React from 'react';

export default class AssetList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	static name  = 'AssetStructureList';
	static description = '资产结构化 - 查询列表';

	render() {
		return 'default Text:AssetStructureList';
	}
}
