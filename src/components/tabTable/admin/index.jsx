/** 5.1 checkTable(资产结构化检查-6个tab栏下的表格-检察人员)

全部/未检查/检查无误/检查错误/已修改/待确认 * */
import React from 'react';
import { Link, withRouter } from "react-router-dom";
import { Tabs, Table, Button } from 'antd';
import { Columns } from "../../../static/columns";
import createPaginationProps from "../../../utils/pagination";
import { AssetTabTextWithNumber } from '../../../components/common'
const { TabPane } = Tabs;

class TabTable extends React.Component {
    static defaultProps = {
        currentPage: 1,
        data: [],
        isCheck: true,
        total: 0,
        waitNum: 0,
        checkErrorNum: 0,
        editNum: 0,
        tabIndex: "0",
    }
    //切换Tab
    changeTab = (key) => {
        const _key = parseInt(key);
        this.props.onTabs(_key)
    };

    //换页
    onTablePageChange = (pagination) => {
        this.props.onPage(pagination.current)
    };

    render() {
        const { data, checkErrorNum, editNum, total, currentPage, tabIndex, status } = this.props;
        const paginationProps = createPaginationProps(currentPage, total)
        const columnsAdmin = [
            {
                title: "抓取时间",
                dataIndex: "grabTime",
            },
            Columns[0],
            Columns[1],
            Columns[2],
            Columns[3],
            {
                title: "操作",
                dataIndex: "action",
                align: "center",
                width: 180,
                render: (text, record) => (
                    <span>
                        <Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
                            <Button style={{ fontSize: 12 }}>查看</Button>
                        </Link>
                    </span>
                ),
            }
        ];
        const columnsCheckAdmin = [
            {
                title: "检查时间",
                dataIndex: "checkTime",
            },
            Columns[0],
            Columns[1],
            Columns[2],
            Columns[3],
            {
                title: "操作",
                dataIndex: "action",
                align: "center",
                width: 180,
                render: (text, record) => (
                    <span>
                        <Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
                            <Button style={{ fontSize: 12 }}>查看</Button>
                        </Link>
                    </span>
                ),
            }
        ];
        const columnsReviseAdmin = [
            {
                title: "修改时间",
                dataIndex: "lastStructuredTime",
            },
            Columns[0],
            Columns[1],
            Columns[2],
            Columns[3],
            {
                title: "操作",
                dataIndex: "action",
                align: "center",
                width: 180,
                render: (text, record) => (
                    <span>
                        <Link to={`/index/${record.id}/${record.status}/${currentPage}/${status}`}>
                            <Button style={{ fontSize: 12 }}>查看</Button>
                        </Link>
                    </span>
                ),
            }
        ];
        return (
            <div>
                <Tabs activeKey={tabIndex} onChange={this.changeTab} animated={false}>
                    <TabPane tab="全部" key="0" >
                        <Table rowClassName="table-list"
                            columns={columnsAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                    <TabPane tab={"未标记"} key="1">
                        <Table rowClassName="table-list"
                            columns={columnsAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                    <TabPane tab={"未检查"} key="2">
                        <Table rowClassName="table-list"
                            columns={columnsCheckAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                    <TabPane tab={"检查无误"} key="3">
                        <Table rowClassName="table-list"
                            columns={columnsCheckAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                    <TabPane tab={<AssetTabTextWithNumber text={"检查错误"} num={checkErrorNum}/>} key="4">
                        <Table rowClassName="table-list"
                            columns={columnsCheckAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                    <TabPane tab={<AssetTabTextWithNumber text={"已修改"} num={editNum}/>} key="5">
                        <Table rowClassName="table-list"
                            columns={columnsReviseAdmin}
                            dataSource={data}
                            rowKey={record => record.id}
                            pagination={paginationProps}
                            onChange={this.onTablePageChange}
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
export default withRouter(TabTable);
