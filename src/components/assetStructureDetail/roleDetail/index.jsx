import React from 'react'
import { Icon, Input, Select, Button, Table,Popover } from 'antd'
import { SEX_TYPE, ROLE_TYPE } from '@/static/status'
import { dateUtils,filters } from '@utils/common'
import '../index.scss'
const { Option } = Select;
class RoleDetail extends React.Component {
    static defaultProps = {
        handleDeleteClick:()=>{},
        handleChange:()=>{},
        handleAddClick:()=>{}
    };
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.value)
    }
    handleDel(index) {
        this.props.handleDeleteClick('obligors', index)
    }
    handleBlur(e) {
        //日期格式转换 补全
        let reg = /(^\d{1,4}|\d{1,2})/g;
        let timeArr = e.target.value.match(reg);
        let result = (timeArr && timeArr.length > 0) ? dateUtils.formatDateComplete(timeArr) : e.target.value;
        this.props.handleChange(e.target.name, result)
    }
    get roleInputNumber() {
        return this.props.obligors instanceof Array ? this.props.obligors.length : 0
    }
    render() {
        const dataSource = this.props.obligors;
        const columns = [
            {
                title: '名称',
                dataIndex: 'name',
                key: 'name',
                render:(text)=>(
                    <span>{filters.blockNullData(text,'-')}</span>
                )
            },
            {
                title: '角色',
                dataIndex: 'labelType',
                key: 'labelType',
                render(text) {
                    return (
                        <span>{ROLE_TYPE[text]}</span>
                    )
                }
            },
            {
                title: '证件号',
                dataIndex: 'number',
                key: 'number',
                render:(text)=>(
                    <span>{filters.blockNullData(text,'-')}</span>
                )
            },
            {
                title: '生日',
                dataIndex: 'birthday',
                key: 'birthday',
                render:(text)=>(
                    <span>{filters.blockNullData(text,'-')}</span>
                )
            },
            {
                title: '性别',
                dataIndex: 'gender',
                key: 'gender',
                render(text) {
                    return (
                        <span>{SEX_TYPE[text]}</span>
                    )
                }
            },
            {
                title: '备注',
                dataIndex: 'notes',
                key: 'notes',
                render:(text)=>(
                    <span>{filters.blockNullData(text,'-')}</span>
                )
            },
        ];
        const text =
        <div>
            <div>（1）生日原文复制到“生日”框内会自动转化为简版：20120103</div>
            <div>（2）如若转化失败，可自行进行填写，填写格式为：20180912</div>
            <div>（3）“生日”也可直接进行填写，格式为：20181012</div>
        </div>;
        /* console.log(this.props.enable) */
        return (
            <div className="yc-components-assetStructureDetail yc-components-roleDetail">
                <div className="yc-components-assetStructureDetail_header">
                    <span>角色信息</span>
                    <span className="role_mark">
                        <Popover content={text}>
                            <Icon type="exclamation-circle" style={{color: '#808387'}}/>
                        </Popover>
                    </span>
                </div>
                <div className="yc-components-basicDetail_body">
                    {
                        this.props.enable ?
                            <div>
                                <Table dataSource={dataSource} columns={columns} pagination={false} rowKey={record => Math.random() + record.number} />
                            </div> :
                            <div>
                                <div className="yc-components-assetStructureDetail_body-roleRow">
                                    <div className="name">名称</div>
                                    <div className="role">角色</div>
                                    <div className="certification">证件号</div>
                                    <div className="birth">生日</div>
                                    <div className="sex">性别</div>
                                    <div className="note">备注</div>
                                    <div className="operation">操作</div>
                                </div>
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

/* const RoleInfos = (props) => {
    const roleArr = []
    Object.keys(props.obligor).forEach((key, index) => {
        roleArr.push(<RoleInfo info={props.obligor[key]} key={index}></RoleInfo>)
    })
    return (
        <div className="role-info_row">
            {roleArr}
            <hr></hr>
        </div>
    )
}

const RoleInfo = (props) => {
    return (
        <span className="role-info_col">
            {props.info}

        </span>
    )
} */
const RoleInputs = (props) => {
    const arr = [];
    for (let i = 0; i < props.num; i++) {
        arr.push(<RoleInput
          key={i}
          index={i}
          obligor={props.obligors[i]}
          handleBlur={props.handleBlur}
          handleDel={props.handleDel.bind(this, i)}
          handleChange={props.handleChange}
        />);
    }
    return arr;
};

const RoleInput = props => (
  <div className="yc-components-assetStructureDetail_body-roleInputRow">
      <Input
        placeholder="请输入名称"
        onChange={(e) => {
            e.persist();
            props.handleChange(e);
        }}
        onBlur={(e) => {
          e.target.value=e.target.value.trim();
          props.handleChange(e);
        }}
        name={`name${props.index}`}
        value={props.obligor.name}
      />
      <Select placeholder="角色" onChange={(value) => { props.handleChange({ target: { name: `labelType${props.index}`, value } }); }} value={props.obligor.labelType}>
          {Object.keys(ROLE_TYPE).map(key => <Option key={key} style={{ fontSize: 12 }}>{ROLE_TYPE[key]}</Option>)}
      </Select>
      <Input
        placeholder="请输入证件号"
        onChange={(e) => {
            e.persist();
            props.handleChange(e);
        }}
        onBlur={(e) => {
          e.target.value=e.target.value.trim();
          props.handleChange(e);
        }}
        name={`number${props.index}`}
        value={props.obligor.number}
      />
      <Input
        placeholder="请输入年月日"
        onChange={(e) => {
            e.persist();
            props.handleChange(e);
        }}
        name={`birthday${props.index}`}
        value={props.obligor.birthday}
        onBlur={(e) => {
            e.persist();
            props.handleBlur(e);
        }}
      />
      <Select placeholder="性别" onChange={(value) => { props.handleChange({ target: { name: `gender${props.index}`, value } }); }} value={props.obligor.gender}>
          {Object.keys(SEX_TYPE).map(key => <Option key={key}>{SEX_TYPE[key]}</Option>)}
      </Select>
      <Input
        placeholder="请输入备注"
        onChange={(e) => {
            e.persist();
            props.handleChange(e);
        }}
        onBlur={(e) => {
          e.target.value=e.target.value.trim();
          props.handleChange(e);
        }}
        name={`notes${props.index}`}
        value={props.obligor.notes}
      />
      <Button type="danger" onClick={props.handleDel}>删除</Button>
  </div>
);
export default RoleDetail;
