import React from 'react';
import { Spin, Icon } from 'antd';
const SpinLoading = props=>{
	const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
	return <Spin indicator={antIcon} spinning={props.loading}>{props.children}</Spin>
};
export default SpinLoading;
