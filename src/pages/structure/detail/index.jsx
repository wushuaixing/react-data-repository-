/** right content for Account manage* */
import React from 'react';
import Button from "antd/es/button";
import './style.scss';
import Icon from "antd/es/icon";
// ==================
// 所需的所有组件
// ==================
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

class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataMark:  0,
      dataTotal:50,
		};
  }

  componentWillMount() {

  }
  goBack=()=>{

  };

//待标记--》详情页
  render() {
    const { }=this.props;
    const { dataMark, dataTotal }=this.state;
        return(
          <div>
            <div className="yc-right-detail">
              <div style={{ margin:10, fontSize:16, color:'#293038' }}>资产结构化／详情</div>
              <div className="yc-button-goback">
                <p>{ dataMark}/{ dataTotal }</p>
                <Button type="default" onClick="goBack"><Icon type="left" />返回上一条</Button>
              </div>
            </div>
          </div>
        );
    }
}
export default StructureDetail;
