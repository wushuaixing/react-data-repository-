/** admin * */
import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import {Form, Icon, Input, Button, DatePicker} from 'antd';
import 'antd/dist/antd.css';

// ==================
// 所需的所有组件
// ==================
const searchForm = Form.create;


class  Asset extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

		};
  }

  componentWillMount() {

  };

  componentDidMount() {

  };

//  账号管理-结构化账号列表接口  /api/asset/admin/userView  get
//  账号管理-检查账号列表接口   /api/asset/admin/check/getCheckList  get
  render() {
    const { getFieldDecorator } = this.props.form;

    return(
          <div>
            <div className="yc-detail-title">
              <div style={{ margin:10, fontSize:16, color:'#293038',fontWeight:800 }}>资产结构化</div>
              <div className="yc-button-goback">
                <Button type="default" onClick={()=>this.goBack}>获取新数据</Button>
              </div>
            </div>
            <div className="yc-detail-content">
              <div className="yc-search-line">
                <Form layout="inline" onSubmit={this.handleSubmit} className="yc-search-form" style={{marginLeft:10,marginTop:15}}>
                  <Form.Item label="标题">
                    {getFieldDecorator('title', {})
                    (<Input
                      type="text"
                      size='default'
                      style={{ width: 240 }}
                    />)}
                  </Form.Item>
                  <Form.Item label="结构化时间">
                    {getFieldDecorator('start', {})
                    (<DatePicker
                      placeholder="开始时间"
                      style={{width:108}}
                    />)}
                  </Form.Item>
                  <Form.Item label="至">
                    {getFieldDecorator('end', {})
                    (<DatePicker
                      placeholder="结束时间"
                      style={{width:108}}
                    />)}
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" style={{backgroundColor:'#0099CC',marginLeft:15}}>
                      搜索
                    </Button>
                    <Button type="default" htmlType="submit" style={{marginLeft:5}}>
                      清空搜索条件
                    </Button>
                  </Form.Item>
                </Form>
              </div>
            </div>
          </div>
        );
    }
}
export default searchForm()(Asset);
