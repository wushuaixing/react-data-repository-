/** right content for Account manage* */
import React from 'react';
import { Tabs, Table, } from "antd";
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

const data = [
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No.',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
  {
    id: '1',
    username: 'John',
    name: 32,
    structuredObject: 'New York No. 1 Lake Park',
    dataType: ['nice', 'developer'],
    role: '结构化',
  },
];
let storage = window.localStorage;

class  AccountManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    	user: '',
			role: '',
		};
  }

  componentWillMount() {
    // console.log(storage);
    this.setState({
			user: storage.userName,
			role: storage.userState,
		})
  }

  callback = key =>{
    // console.log(key);
  };
//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
      const { }=this.props;
      const { user, role }=this.state;
        return(
          <div>
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>账号管理 > 结构化账号</div>
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="正常账号" key="1">
                  <Table className="table-list" columns={columns} dataSource={data} style={{margin:10,width:1240}} />
                </TabPane>
                <TabPane tab="已删除账号" key="2">
                  Content of Tab Pane 2
                </TabPane>
              </Tabs>
          </div>
        );
    }
}
export default AccountManage;
