/** sync monitor * */
import React from 'react';
import {message, Select, Radio, Spin} from "antd";
import {detailsByDate} from "../../../server/api";
import {AxisStyle} from '../../../static/axisStyle';
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const { Option } = Select;

const xAxisStyle=AxisStyle[0];
const yAxisStyle=AxisStyle[1];

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      siteName:"总量",
      dataSourceType:0,
      timeType:1,
      siteList:[
        {
          value: "0",
          label: "总量"
        },
        {
          value: "1",
          label: "阿里司法拍卖"
        },
        {
          value: "3",
          label: "公拍网"
        },
        {
          value: "4",
          label: "京东司法拍卖"
        },
        {
          value: "5",
          label: "中国拍卖行业协会"
        },
        {
          value: "6",
          label: "人民法院诉讼资产网"
        },
        {
          value: "11",
          label: "阿里金融资产"
        },
      ],
      dbCount:0,
      diffSource:0,
    };
  }

  componentDidMount() {
    this.changeTime(1);
    this.siteSelect(0);
  }

  siteSelect=(id)=>{
    if(id === 0){
      this.setState({
        siteName:"总量",
      })
    }
    if(id === 1){
      this.setState({
        siteName:"阿里司法拍卖",
      })
    }
    if(id === 3){
      this.setState({
        siteName:"公拍网",
      })
    }
    if(id === 4){
      this.setState({
        siteName:"京东司法拍卖",
      })
    }
    if(id === 5){
      this.setState({
        siteName:"中国拍卖行业协会",
      })
    }
    if(id === 6){
      this.setState({
        siteName:"人民法院诉讼资产网",
      })
    }
    if(id === 11){
      this.setState({
        siteName:"阿里金融资产",
      })
    }
  };

  onChangeRadio=(e)=>{
    let type=e.target.value;
    this.changeTime(type);
    this.siteSelect(0);
  };

  onChangeSelect=(value)=>{
    this.changeSourceType(value);
  };

  //切换 不同源网站 数据抓取量与源网站增量日月周
  changeTime=(type)=>{
      const {dataSourceType}=this.state;
      this.setState({
        timeType:type,
        loading:true,
      });
      detailsByDate(type,dataSourceType).then(res => {
        this.setState({
          loading:false,
        });
        if (res.data.code === 200) {
          let sourceTemp=[];
          for (let key in res.data.data) {
            sourceTemp.push({
              date: res.data.data[key].date,
              sourceCount: res.data.data[key].sourceCount,
              dbCount: res.data.data[key].dbCount,
              diffEveryDay: res.data.data[key].diff,
              diffAllCount: res.data.data[key].difference,
            });
          }
          this.drawLine(sourceTemp);
        } else {
          message.error(res.data.message);
        }
      });
  };

  //切换 不同源网站 数据抓取量与源网站增量
  changeSourceType(sourceType){
    const {timeType}=this.state;
    let source=parseInt(sourceType);
    this.setState({
      dataSourceType:source,
    });
    this.changeTime(timeType);
    this.siteSelect(source);
  }

  //源网站增量与数据抓取&&源网站增量与数据抓取图
  drawLine=(data)=>{
    let lineSP = echarts.init(document.getElementById('compareSP'));
    let lineDiff = echarts.init(document.getElementById('compareDiff'));
    let sourceDataByDate=[];
    let dbDataByDate=[];
    let dataEveryMore=[];
    let dataEveryLess=[];
    let diffAllCount=[];
    for (let key in data ){
      diffAllCount.push([
        data[key].date,
        data[key].diffAllCount
      ]);
      sourceDataByDate.push([
        data[key].date,
        data[key].sourceCount
      ]);
      dbDataByDate.push([
        data[key].date,
        data[key].dbCount
      ]);
      if(data[key].diffNegative === 0){
        dataEveryMore.push([
          data[key].date,
          data[key].diffPositive
        ]);
      }
      else if(data[key].diffPositive === 0){
        dataEveryLess.push([
          data[key].date,
          data[key].diffNegative
        ]);
      }
    }
    lineSP.setOption({
      color:['#1CAFE0FF','#FD9C26FF','#F03733FF','#126EC7FF','#16B45CFF','#8F56DFFF'],
      title : {
        text: '',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
      },
      legend: {
        left:20,
        top: 15,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
      },
      xAxis: xAxisStyle,
      yAxis: yAxisStyle,
      series: [
        {type: 'line',
          smooth: true,
          name: '源网站',
          data: sourceDataByDate,
        },
        {
          type: 'line',
          smooth: true,
          name: '数据抓取',
          data: dbDataByDate,
        }
      ]
    });

    lineDiff.setOption({
      color:['#F03733FF','#16B45CFF','#1CAFE0FF'],
      title : {
        text: '',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        },
      },
      legend: {
        left: 20,
        top: 15,
        itemWidth: 20,
        orient: 'horizontal'
      },
      xAxis: xAxisStyle,
      yAxis: yAxisStyle,
      series: [
        {type: 'bar',data:dataEveryMore, name:'多于源网站增量'},
        {type: 'bar',data:dataEveryLess, name:'少于源网站增量'},
        {type: 'line', data:diffAllCount, name:'累计差值'},
      ],
    });

  };

  render() {
    const {siteList,timeType,siteName,loading}=this.state;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div>
                <div style={{margin:20}}>
                    <Radio.Group
                      onChange={this.onChangeRadio}
                      value={timeType}
                      >
                      <Radio.Button value={1} style={{width:54}}>
                        <span>日</span>
                      </Radio.Button>
                      <Radio.Button value={2} style={{width:54}}>
                        <span>周</span>
                      </Radio.Button>
                      <Radio.Button value={3} style={{width:54}}>
                        <span>月</span>
                      </Radio.Button>
                  </Radio.Group>
                    <span style={{display: 'inline-block', marginLeft: 20,color:'#293038'}}>数据源：</span>
                    <div style={{display: 'inline-flex'}}>
                      <Select style={{width:150,marginLeft:4,height:28}}
                              transfer
                              placeholder="总量"
                              onChange={this.onChangeSelect}
                              defaultValue="0"
                      >
                        {
                          siteList && siteList.map((item) => {
                            return (
                              <Option
                                value={item.value}
                                key={item.value}
                              >
                                {item.label}
                              </Option>
                            );
                          })
                        }
                      </Select>
                    </div>
                </div>
                <div className="yc-chart-title" >
                  <span>源网站增量与数据抓取量-{siteName}</span>
                </div>
                <div className="yc-python-line" id="compareSP" />
                <div className="yc-chart-title">
                  <span>数据抓取量与源网站增量差值-{siteName}</span>
                </div>
                <div className="yc-python-line" id="compareDiff" />
            </div>
      </Spin>


    )
  }

}
export default Index;
