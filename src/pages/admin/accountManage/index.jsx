/** right content for Account manage* */
import React from 'react';
import { Tabs, Table, } from "antd";
import {userView} from "../../../server/api";
import Pagination from "antd/es/pagination";
// ==================
// 所需的所有组件
// ==================
const { TabPane } = Tabs;

const columns = [
    {
      title: "ID",
      dataIndex: "id"
    },
    {
      title: "账号",
      dataIndex: "username"
    },
    {
      title: "姓名",
      dataIndex: "name"
    },
    {
      title: "结构化对象",
      dataIndex: "structuredObject"
    },
    {
      title: "数据类型",
      dataIndex: "dataType"
    },
    {
      title: "角色",
      dataIndex: "role"
    },
    {
      title: "操作",
      dataIndex: "action",
      align: "center",
      width: 180,
      render: () => (
        <span>
        <a>编辑</a>
        <a>删除</a>
      </span>
      ),
    }
  ];

class  AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isEnabledUser: true,
      taleList: [],
      total: 1,
      page: 1,
      searchRole:'',
      searchUser:'',
		};
  }

  componentWillMount() {
    //默认初始传入正常账号
    this.getTableList();


  }

  callback = key =>{
    // console.log(key);
  };

  //get table dataSource
  getTableList=()=>{
    const {isEnabledUser,page,searchRole,searchUser}=this.state;
    let params = {
      isEnabledUser: isEnabledUser,
      num: 10,
      page: page,
      role: searchRole,
      username: searchUser
    };
    userView(params).then(res => {
      if (res.data.code === 200) {
        // this.loading = false;
        this.setState({
          tableList:res.data.data,
          total:res.data.total,
        });
      } else {
        // this.$Message.error(res.data.message);
      }
    });
  };

//切换Tab
  changeTab=(key)=>{
      if (key === 1) {
        this.setState({
                   page: 1,
          isEnabledUser: true,
             searchRole: '',
             searchUser: '',
        });
      } else if (key === 2) {
        this.setState({
                   page: 1,
          isEnabledUser: true,
             searchRole: '',
             searchUser: '',
        });
      }
      this.getTableList();
  };

  //换页
  onChangePage=(page)=>{
    this.setState({
      page: page,
    });
  };

//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
/*{
  "dataType": "房产数据",
  "id": 1,
  "lastWeekErrorRate": "10%",
  "lastWeekMarkNum": 100,
  "name": "DoyuTu",
  "role": "正式",
  "structuredObject": "资产结构化",
  "totalWrongNum": 1,
  "username": "12345678901"
}*/
  render() {
      const { }=this.props;
      const {tableList,total}=this.state;
        return(
          <div>
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>账号管理 > 结构化账号</div>
              <Tabs defaultActiveKey="1" onChange={this.changeTab}>
                <TabPane tab="正常账号" key="1">
                  <Table className="table-list" columns={columns} dataSource={tableList} style={{margin:10,width:1240}} />
                </TabPane>
                <TabPane tab="已删除账号" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
              <Pagination showQuickJumper={true} defaultCurrent={1} pageSize={10} total={total} onChange={this.onChangePage} />

          </div>
        );
    }
}
export default AccountManage;
