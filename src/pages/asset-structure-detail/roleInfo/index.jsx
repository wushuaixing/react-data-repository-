import React from 'react'
import { Icon, Input, Select, Button, Table,Popover } from 'antd'
import { SEX_TYPE, ROLE_TYPE } from '@/static/status'
import { dateUtils,filters } from '@utils/common'
import NoDataIMG from '../../../assets/img/no_data.png'
import AutoCompleteInput from './autoCompleteInput'
const { Option } = Select;
class RoleInfo extends React.Component {
    static defaultProps = {
        obligors:{},
        enable:true,
        handleDeleteClick:()=>{},
        handleChange:()=>{},
        handleAddClick:()=>{}
    };
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.value)
    }
    handleDel(index) {
        this.props.handleDeleteClick('obligors', index)
        this.child.getDeletedData(index);
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
    onRef = (ref) => {
        this.child = ref
    }
    render() {
        const {obligors,enable}=this.props;
        const dataSource = obligors;
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
                dataIndex: 'label_type',
                key: 'label_type',
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
        return (
            <div className="yc-component-assetStructureDetail roleInfo">
                <div className="yc-component-assetStructureDetail_header">
                    <span>角色信息</span>
                    <span style={{marginLeft:4}}>
                        <Popover content={text}>
                            <Icon type="exclamation-circle" style={{color: '#808387',position:'relative',top:1}}/>
                        </Popover>
                    </span>
                </div>
                <div className="roleInfo_body">
                    {
                        enable ?
                            <div>
                                <Table 
                                    dataSource={dataSource} 
                                    columns={columns} 
                                    pagination={false} 
                                    rowKey={record => Math.random() + record.number} 
                                    locale={{emptyText: <div className="no-data-box"><img src={NoDataIMG} alt="暂无数据"/><p>暂无数据</p></div>}}
                                    />
                            </div> :
                            <div>
                                <div className="roleInfo_body-header">
                                    <div className="name">名称</div>
                                    <div className="role">角色</div>
                                    <div className="certification">证件号</div>
                                    <div className="birth">生日</div>
                                    <div className="sex">性别</div>
                                    <div className="note">备注</div>
                                    <div className="operation">操作</div>
                                </div>
                                <div className="roleInfo_body-addRole">
                                    <Button type="dashed" icon="plus" onClick={this.props.handleAddClick.bind(this, 'obligors')}>
                                      添加
                                    </Button>
                                </div>
                                <RoleInputs 
                                    num={this.roleInputNumber} 
                                    obligors={obligors}
                                    handleDel={this.handleDel.bind(this)}
                                    handleChange={this.handleChange.bind(this)}
                                    handleBlur={this.handleBlur.bind(this)}
                                    handleNameChange={this.props.handleChange}
                                    onRef={this.onRef}
                                    key={this.props.id}
                                    >
                                </RoleInputs>
                            </div>
                    }
                </div>
            </div>
        )
    }
}

const RoleInputs = (props) => {
    const arr = [];
    for (let i = 0; i < props.num; i++) {
        arr.unshift(<RoleInput
          key={i}
          index={i}
          obligor={props.obligors[i]}
          handleBlur={props.handleBlur}
          handleDel={props.handleDel.bind(this, i)}
          handleChange={props.handleChange}
          handleNameChange={props.handleNameChange}
          onRef={props.onRef}
        />);
    }
    return arr;
};

const RoleInput = props => (
  <div className="roleInfo_body-InputRow">
      <AutoCompleteInput
            disabled={(props.obligor||{}).system===1}
            index={props.index}
            handleNameChange={props.handleNameChange}
            obligor={props.obligor}
            onRef={props.onRef}
      />
      <Select
            placeholder="角色"
            getPopupContainer={node=>node.offsetParent}
            disabled={(props.obligor||{}).system===1}
            onChange={(value) => { props.handleChange({ target: { name: `label_type${props.index}`, value } }); }}
            value={props.obligor.label_type}>
          {Object.keys(ROLE_TYPE).map(key => <Option key={key} style={{ fontSize: 12 }}>{ROLE_TYPE[key]}</Option>)}
      </Select>
      <Input
            placeholder="请输入证件号"
            autoComplete='off'
            disabled={(props.obligor||{}).system===1}
            onChange={(e) => {
                e.persist();
                props.handleChange(e);
            }}
            onBlur={(e) => {
            e.target.value=e.target.value.trim().replace(/[(]/g,'（').replace(/[)]/g,'）')
            props.handleChange(e);
            }}
            name={`number${props.index}`}
            value={props.obligor.number}
      />
      <Input
            placeholder="请输入年月日"
            autoComplete='off'
            disabled={(props.obligor||{}).system===1}
            onChange={(e) => {
                e.persist();
                props.handleChange(e);
            }}
            name={`birthday${props.index}`}
            value={props.obligor.birthday}
            onBlur={(e) => {
                e.persist();
                e.target.value=e.target.value.trim()
                props.handleBlur(e);
            }}
      />
      <Select
            disabled={(props.obligor||{}).system===1}
            placeholder="性别"
            getPopupContainer={node=>node.offsetParent}
            onChange={(value) => { props.handleChange({ target: { name: `gender${props.index}`, value } }); }}
            value={props.obligor.gender}
            className='sex-select'
        >
          {Object.keys(SEX_TYPE).map(key => <Option key={key}>{SEX_TYPE[key]}</Option>)}
      </Select>
      <Input.TextArea
            placeholder="请输入备注"
            autoComplete='off'
            disabled={(props.obligor||{}).system===1}
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
            autoSize
            className='tips-box'
      />
      <Button type="primary" className="del_role_item" ghost onClick={props.handleDel} disabled={(props.obligor||{}).system===1}>删除</Button>
  </div>
);
export default RoleInfo;
