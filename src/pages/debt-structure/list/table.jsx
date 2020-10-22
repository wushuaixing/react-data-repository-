import React from 'react';
import { withRouter } from 'react-router-dom';
import { Tabs, Table, Button } from 'antd';
import { Columns } from './common/column';
import createPaginationProps from '@/utils/pagination';
import NoDataIMG from '@/assets/img/no_data.png';
const { TabPane } = Tabs;

class DebtTable extends React.Component {
    static defaultProps = {
        page:1,
        tabIndex: 0,
        total: 0,
        data: [],
        role:'',
        panes:[],
        timeText:'',
    };

    handleTabChange = (key) => {
        this.props.onTabChange(key)
    };

    handlePageChange = (pagination) => {
        this.props.onPageChange(pagination.current)
    };

    goDetail = (record) => {
        console.log(record);
    }
    
    render() {
        const { data, total, tabIndex, page, role ,panes ,timeText} = this.props;
        const paginationProps = createPaginationProps(page, total);
        let dynamic_column_index = 3;
        if(role === 'normal' || (role === 'admin' && tabIndex === 1)){
            dynamic_column_index = 2
        }
        const columns = [
            ...Columns.slice(0,dynamic_column_index),
            {
                title: '操作',
                dataIndex: 'action',
                align: "center",
                width: 180,
                key: 'action',
                render: (text, record) => {
                    return (
                        <span>
                            <Button size="small" type="primary" ghost style={{ minWidth: 60, height:28 }} className='btn-bgcolor-change' onMouseDown={this.goDetail.bind(record)}>查看</Button>
                        </span>
                    )
                }
            }
        ];

        /*只有结构化账号下的待标记列表不显示时间*/
		if (!(role === 'normal' && tabIndex === 0)) {
			columns.unshift({
                title: timeText,
                dataIndex: 'time',
                key:'time'
			})
		}
        return (
            <div>
                <Tabs activeKey={tabIndex.toString()} onChange={this.handleTabChange} animated={false} className="yc-debt-content_tabs">
                    { panes.map(i=><TabPane tab={i.title} key={i.key} />) }
                </Tabs>
                <Table rowClassName="table-list"
                       columns={columns}
                       dataSource={data}
                       rowKey={record => (record.info||{}).id}
                       pagination={paginationProps}
                       onChange={this.handlePageChange}
                       locale={{ emptyText: <div className="no-data-box"><img src={NoDataIMG} alt="暂无数据"/><p>暂无数据</p></div> }}
                    />
            </div>
        );
    }
}
export default withRouter(DebtTable);
