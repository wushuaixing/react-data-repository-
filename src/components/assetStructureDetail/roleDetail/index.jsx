import React from 'react'
import { Icon, Input, Select, Button } from 'antd'
import '../index.scss'


//功能还剩链接跳转  在父组件补上Prop和回调逻辑即可  另外要根据传入prop选择需要显示的row
const RoleDetail = () => {
    return (
        <div className="yc-components-assetStructureDetail yc-components-roleDetail">
            <div className="yc-components-assetStructureDetail_header">
                <span>角色信息</span>
                <span className="role_mark"><Icon type="exclamation-circle" /></span>
            </div>
            <div className="yc-components-basicDetail_body">
                <div className="yc-components-assetStructureDetail_body-roleRow">
                    <span className="name">名称</span>
                    <span className="role">角色</span>
                    <span className="certification">证件号</span>
                    <span className="birth">生日</span>
                    <span className="sex">性别</span>
                    <span className="note">备注</span>
                    <span className="operation">操作</span>
                </div>
                <div className="yc-components-assetStructureDetail_body-roleInputRow">
                    <Input placeholder="请输入名称"></Input>
                    <Select placeholder="角色"></Select>
                    <Input placeholder="请输入证件号"></Input>
                    <Input placeholder="请输入年月日"></Input>
                    <Select placeholder="性别"></Select>
                    <Input placeholder="请输入备注"></Input>
                    <Button type="danger">删除</Button>
                </div>
                <div className="yc-components-assetStructureDetail_body-addRole">
                    <Button type="dashed" icon="plus">
                        添加
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default RoleDetail;