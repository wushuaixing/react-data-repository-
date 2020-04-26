import React from 'react'
import { Icon, Input, Select, Button, Form } from 'antd'
import { SEX_TYPE, ROLE_TYPE } from '@/static/status'
import '../index.scss'
const { Option } = Select;
class RoleDetail extends React.Component {
    handleChange(e) {
        this.props.handleChange(e.target.name,e.target.value)
    }
    handleDel(index){
        this.props.handleDeleteClick('obligors',index)
    }
    get roleInputNumber() {
        return this.props.obligors.length
    }
    render() {
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
                    <RoleInputs num={this.roleInputNumber} obligors={this.props.obligors}
                        handleDel={this.handleDel.bind(this)}
                        handleChange={this.handleChange.bind(this)}>
                    </RoleInputs>
                    <div className="yc-components-assetStructureDetail_body-addRole">
                        <Button type="dashed" icon="plus" onClick={this.props.handleAddClick.bind(this, 'obligors')}>
                            添加
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
}

const RoleInputs = (props) => {
    const arr = []
    for (let i = 0; i < props.num; i++) {
        arr.push(<RoleInput key={i} index={i} obligor={props.obligors[i]}
            handleDel={props.handleDel.bind(this,i)}
            handleChange={props.handleChange}
        ></RoleInput>)
    }
    return arr;
}

const RoleInput = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-roleInputRow">
            <Input placeholder="请输入名称" onChange={(e)=>{e.persist();props.handleChange(e)}} name={`name${props.index}`} value={props.obligor.name}></Input>
            <Select placeholder="角色" onChange={(value)=>{props.handleChange({target:{name:`labelType${props.index}`,value}})}} value={props.obligor.labelType}>
                {Object.keys(ROLE_TYPE).map((key) => {
                    return <Option key={key}>{ROLE_TYPE[key]}</Option>
                })}
            </Select>
            <Input placeholder="请输入证件号" onChange={(e)=>{e.persist();props.handleChange(e)}} name={`number${props.index}`} value={props.obligor.number}></Input>
            <Input placeholder="请输入年月日" onChange={(e)=>{e.persist();props.handleChange(e)}} name={`birthday${props.index}`} value={props.obligor.birthday}></Input>
            <Select placeholder="性别" onChange={(value)=>{props.handleChange({target:{name:`gender${props.index}`,value}})}} value={props.obligor.gender}>
                {Object.keys(SEX_TYPE).map((key) => {
                    return <Option key={key}>{SEX_TYPE[key]}</Option>
                })}
            </Select>
            <Input placeholder="请输入备注" onChange={(e)=>{e.persist();props.handleChange(e)}} name={`notes${props.index}`} value={props.obligor.notes}></Input>
            <Button type="danger" onClick={props.handleDel}>删除</Button>
        </div>
    )
}
export default RoleDetail;