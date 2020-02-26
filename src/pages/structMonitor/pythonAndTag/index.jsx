/** sync monitor * */
import React from 'react';
import {message} from "antd";
import {pythonAndTag} from "../../../server/api";
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/bar';
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const xAxisStyle={
  type: 'category',
  axisLine: {
    lineStyle:{
      color:'#E2E4E9'
    }
  },
  axisLabel: {
    textStyle: {
      color: '#293038'
    }
  },
  splitLine: {
    lineStyle: {
      type: 'dashed'
    }
  },
};
const yAxisStyle={
  type: 'value',
  splitLine: {
    lineStyle: {
      type: 'dashed'
    }
  },
  axisLine: {
    lineStyle:{
      color:'#E2E4E9'
    }
  },
  axisLabel: {
    textStyle: {
      color: '#293038'
    }
  },
  axisTick: {
    show: false
  },

};

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
    //数据抓取与标记差值
    pythonAndTag().then(res=>{
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
    return (
      <div>
        <div className="yc-detail-title" >
          <div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>数据抓取与标记差值分析</div>
        </div>
        <div className="yc-python-tag" id="pythonTag" />
      </div>


    )
  }

}
export default Index;
