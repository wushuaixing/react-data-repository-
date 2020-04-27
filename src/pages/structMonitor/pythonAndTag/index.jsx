/** sync monitor * */
import React from 'react';
import {message, Spin} from "antd";
import {pythonAndTag} from "@api";
import {AxisStyle} from '@/static/axisStyle';
import echarts from 'echarts/lib/echarts';
import {BreadCrumb} from '@commonComponents'
// 引入柱状图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const xAxisStyle=AxisStyle[0];
const yAxisStyle=AxisStyle[1];

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
    };
  }

  componentDidMount() {
    //数据抓取与标记差值
    this.setState({
      loading:true,
    });
    pythonAndTag().then(res=>{
      this.setState({
        loading:false,
      });
      if (res.data.code === 200) {
        this.drawLinePythonAndTag(res.data.data);
      }else{
        message.error(res.data.message)
      }
    });
  }

  //数据抓取与标记差值分析
  drawLinePythonAndTag=(data)=>{
    let myPython=echarts.init(document.getElementById('pythonTag'));
    //console.log(data);
    // 累计差值
    let diffAll=[];
    // 当日抓取未标记
    let pyhtonUnTag=[];
    // 标记量与抓取量差值
    let diffAllCount=[];
    /*let diffCountLess=[];
		let diffCountMore=[];*/
    for (let key in data ){
      //console.log( data[key])
      diffAll.push([
        data[key].date,
        data[key].difference
      ]);
      pyhtonUnTag.push([
        data[key].date,
        data[key].notStructuredYet
      ]);
      diffAllCount.push([
        data[key].date,
        data[key].diffEveryDay
      ]);

    }
    myPython.setOption({
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
        top: 20,
        itemWidth: 20,
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: '#999'
          }
        }
      },
      xAxis:  xAxisStyle,
      yAxis: yAxisStyle,
      series: [
        {type: 'line',
          smooth: true,
          name: '累计差值',
          data: diffAll,
        },
        {
          type: 'line',
          smooth: true,
          name: '当日抓取未标记',
          data: pyhtonUnTag,
        },
        {
          type: 'bar',
          smooth: true,
          name: '标记量与抓取量差值',
          data: diffAllCount,
        },
      ]
    });
  };

  render() {
    const {loading}=this.state;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div>
          <BreadCrumb texts={['数据抓取与标记差值分析']}></BreadCrumb>
          <div className="yc-python-tag" id="pythonTag" />
        </div>
      </Spin>
    )
  }

}
export default Index;
