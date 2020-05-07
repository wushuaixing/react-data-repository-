import React from 'react'
import { Icon, Input, Select, Button } from 'antd'
import { SEX_TYPE, ROLE_TYPE } from '@/static/status'
import { dateUtils } from '@utils/common'
import '../index.scss'
const { Option } = Select;
class RoleDetail extends React.Component {
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.value)
    }
    handleDel(index) {
        this.props.handleDeleteClick('obligors', index)
    }
    handleBlur(e) {
        //日期格式转换 补全
        let reg = /\d{1,4}/g
        let timeArr = e.target.value.match(reg)
        let result = (timeArr && timeArr.length > 0) ? dateUtils.formatDateComplete(timeArr) : e.target.value
        this.props.handleChange(e.target.name, result)
    }
    get roleInputNumber() {
        return this.props.obligors instanceof Array ? this.props.obligors.length : 0
    }
    render() {
        /* console.log(this.props.enable) */
        return (
            <div className="yc-components-assetStructureDetail yc-components-roleDetail">
                <div className="yc-components-assetStructureDetail_header">
                    <span>角色信息</span>
                    <span className="role_mark"><Icon type="exclamation-circle" /></span>
                </div>
                <div className="yc-components-basicDetail_body">
                    <div className="yc-components-assetStructureDetail_body-roleRow">
                        <div className="name">名称</div>
                        <div className="role">角色</div>
                        <div className="certification">证件号</div>
                        <div className="birth">生日</div>
                        <div className="sex">性别</div>
                        <div className="note">备注</div>
                        <div className="operation">操作</div>
                    </div>
                    {
                        this.props.enable ?
                            <div>
                                {
                                    this.props.obligors && this.props.obligors.length > 0 ?
                                        this.props.obligors.map((obligor,index) => {
                                            return <RoleInfos obligor={obligor} key={index}></RoleInfos>
                                        })
                                        : null
                                }
                                {/* <RoleInfos obligors={this.props.obligors}></RoleInfos> */}
                            </div> :
                            <div>
                                <RoleInputs num={this.roleInputNumber} obligors={this.props.obligors}
                                    handleDel={this.handleDel.bind(this)}
                                    handleChange={this.handleChange.bind(this)}
                                    handleBlur={this.handleBlur.bind(this)}>
                                </RoleInputs>
                                <div className="yc-components-assetStructureDetail_body-addRole">
                                    <Button type="dashed" icon="plus" onClick={this.props.handleAddClick.bind(this, 'obligors')}>
                                        添加
                                    </Button>
                                </div>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

const RoleInfos = (props) => {
    const roleArr = []
    Object.keys(props.obligor).forEach((key,index) => {
        roleArr.push(<RoleInfo info={props.obligor[key]} key={index}></RoleInfo>)
    })
    return (
        <div className="role-info_row">
            {roleArr}
        </div>
    )

}

const RoleInfo = (props) => {
    return (
        <span className="role-info_col">
            {props.info}
        </span>
    )
}
const RoleInputs = (props) => {
    const arr = []
    for (let i = 0; i < props.num; i++) {
        arr.push(<RoleInput key={i} index={i} obligor={props.obligors[i]}
            handleBlur={props.handleBlur}
            handleDel={props.handleDel.bind(this, i)}
            handleChange={props.handleChange}
        ></RoleInput>)
    }
    return arr;
}

const RoleInput = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-roleInputRow">
            <Input placeholder="请输入名称" onChange={(e) => { e.persist(); props.handleChange(e) }} name={`name${props.index}`} value={props.obligor.name}></Input>
            <Select placeholder="角色" onChange={(value) => { props.handleChange({ target: { name: `labelType${props.index}`, value } }) }} value={props.obligor.labelType}>
                {Object.keys(ROLE_TYPE).map((key) => {
                    return <Option key={key}>{ROLE_TYPE[key]}</Option>
                })}
            </Select>
            <Input placeholder="请输入证件号" onChange={(e) => { e.persist(); props.handleChange(e) }} name={`number${props.index}`} value={props.obligor.number}></Input>
            <Input placeholder="请输入年月日" onChange={(e) => { e.persist(); props.handleChange(e) }} name={`birthday${props.index}`} value={props.obligor.birthday} onBlur={(e) => { e.persist(); props.handleBlur(e) }}></Input>
            <Select placeholder="性别" onChange={(value) => { props.handleChange({ target: { name: `gender${props.index}`, value } }) }} value={props.obligor.gender}>
                {Object.keys(SEX_TYPE).map((key) => {
                    return <Option key={key}>{SEX_TYPE[key]}</Option>
                })}
            </Select>
            <Input placeholder="请输入备注" onChange={(e) => { e.persist(); props.handleChange(e) }} name={`notes${props.index}`} value={props.obligor.notes}></Input>
            <Button type="danger" onClick={props.handleDel}>删除</Button>
        </div>
    )
}
export default RoleDetail;