/** sync monitor * */
import React from 'react';
import {message} from "antd";
import {dataTypeChange} from "../../../server/api";
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
      dataType:3,
    };
  }

  componentDidMount() {
    //数据类型占比变动
    dataTypeChange().then(res=>{
      if (res.data.code === 200) {
        //console.log(res.data.data);
        this.drawLineDataType(res.data.data);
      }else{
        message.error(res.data.message)
      }
    });
  }

// 数据类型占比变动趋势
  drawLineDataType=(data)=>{
    let dataTypeChart=echarts.init(document.getElementById('dataType'));
    let similarData=[];
    let initialData=[];
    let notInitial=[];
    for(let key in data){
      similarData.push([
        data[key].date,
        data[key].similarity
      ]);
      initialData.push([
        data[key].date,
        data[key].first
      ]);
      notInitial.push([
        data[key].date,
        data[key].notFirst
      ]);
    }
    dataTypeChart.setOption({
      color:['#1CAFE0FF','#FD9C26FF','#F03733FF',],
      title : {
        text: '',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
      },
      legend: {
        left:20,
        top: 25,
      },
      xAxis: xAxisStyle,
      yAxis: yAxisStyle,
      series: [
        {type: 'line',
          smooth: true,
          name: '相似数据',
          data: similarData,
        },
        {
          type: 'line',
          smooth: true,
          name: '初标数据',
          data: initialData,
        },
        {
          type: 'line',
          smooth: true,
          name: '非初标数据',
          data: notInitial,
        }
      ]
    });

  }


  render() {
    return (
      <div>
        <div className="yc-detail-title" >
          <div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>数据类型占比变动趋势</div>
        </div>
        <div className="yc-every-line" id="dataType" style={{height: 300}} />
      </div>


    )
  }

}
export default Index;
