/** sync monitor * */
import React from 'react';
import {message, Spin} from "antd";
import {dataSourceData} from "../../../server/api";
import {Legend} from "../legend";
import {Series} from  "../series";
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/pie';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lastPython:0,
      compareSourceLess:0,
      compareSourceMore:0,
      sourceDetail:[],
      loading:false,
    };
  }

  componentDidMount() {
    const {sourceDetail}=this.state;
    this.setState({
      loading:true,
    });
    //数据源分布图
    dataSourceData().then(res=>{
      this.setState({
        loading:false,
      });
      if (res.data.code === 200) {
        this.setState({
          lastPython:res.data.data.yesterdayGrabSum,
          compareSourceLess:res.data.data.contrastIncrement,
          compareSourceMore:res.data.data.contrastReduction,
          sourceDetail:res.data.data.details,
        });

        this.drawPie(sourceDetail);
      }else {
        message.error(res.data.message);
      }
    });

  }

  drawPie=()=>{
    // 基于准备好的dom，初始化echarts实例
    let myChart = echarts.init(document.getElementById('source-pie'));
    // 绘制图表
    myChart.setOption({
      title : {
        text: '数据源分布',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
        left: 15,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{b}<br/>{c0}<br/>{d}%',
      },
      legend: Legend[0],
      series: Series[0],
    });
  };

  render() {
    const {lastPython,compareSourceLess,compareSourceMore,loading}=this.state;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div>
              <div className="yc-detail-title" >
                <div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>资产数据抓取情况</div>
              </div>
              <div>
                <div className="yc-left-amount" style={{marginTop:-20}}>
                  <p className="yc-part-title">昨日抓取总量</p>
                  <p className="yc-part-amount">{lastPython}<span style={{fontSize:14,marginLeft:8}}>条</span></p>
                </div>
                <div className="right-amount">
                  <p style={{marginTop:20,color:'#808387',marginBottom:0,fontSize:14}}>与源网站增量（区分数据源）差值</p>
                  <p style={{fontSize:20,color:'#293038',fontWeight:800}}>
                    <span  style={{fontSize:14,marginRight:8}}>少</span>
                    {compareSourceLess}<span style={{fontSize:14,marginLeft:8}}>条</span>
                    <span style={{fontSize:14,marginLeft:8,marginRight:8}}>多</span>
                    {compareSourceMore}<span style={{fontSize:14,marginLeft:8}}>条</span></p>
                </div>
              </div>
              <div className="yc-source-pie" id="source-pie" />
        </div>
      </Spin>
    )
  }
}
export default Index;
