import React from 'react';
import { Spin } from 'antd';
const SpinLoading = props=>{
	// const antIcon =1 || <Icon type="loading" style={{ fontSize: 24 }} spin />;
	// indicator={antIcon}
	return <Spin  tip="Loading..." spinning={props.loading||false}>{props.children}</Spin>
};
export default SpinLoading;
