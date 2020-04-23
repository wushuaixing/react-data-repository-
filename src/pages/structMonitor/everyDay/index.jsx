/** sync monitor * */
import React from 'react';
import {message, Radio, Spin} from "antd";
import {addedAndStructured} from "@api";
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
      dataType:3,
      loading:false,
    };
  }

  componentDidMount() {
    const {dataType}=this.state;
    this.changeDataType(dataType);
  }

  onChangeRadio=(e)=>{
    let type=e.target.value;
    this.changeDataType(type);
  };

  //每日资产数据新增与标记 切换数据类型 总量/相似/初标/非初标
  changeDataType(type){
    this.setState({
      dataType:type,
      loading:true,
    });
    addedAndStructured(type).then(res =>{
      this.setState({
        loading:false
      });
      if (res.data.code === 200) {
        this.drawStruct(res.data.data);
      }
      else{
        message.error(res.data.message)
      }
    });
  }

  //每日资产数据新增与标记
  //结构化 以日为单位进行统计，展示近6个月
  drawStruct=(data)=>{
    //console.log(data);
    // 数据抓取量
    let pythonData=[];
    // 结构化标记量
    let structureData=[];
    // 标记量与抓取量差值
    let diffCount=[];
    for (let key in data ){
      pythonData.push([
        data[key].date,
        data[key].structureDataIncrement
      ]);
      structureData.push([
        data[key].date,
        data[key].structureDataSignedIncrement
      ]);
      diffCount.push([
        data[key].date,
        data[key].structureDataSignedDiff
      ])
    }
    pythonData.reverse();
    structureData.reverse();
    diffCount.reverse();
    let everyDay=echarts.init(document.getElementById('myChartEveryDay'));
    everyDay.setOption({
      color:['#1CAFE0FF','#FD9C26FF','#F03733FF','#16B45CFF',],
      title : {
        text: '',
        textStyle:{
          fontWeight:'normal',
          fontSize: 14,
        },
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        left:20,
        top: 15,
        itemWidth: 20,
      },
      xAxis: xAxisStyle,
      yAxis: yAxisStyle,
      series: [
        {type: 'line',data:pythonData, name:'数据抓取量'},
        {type: 'line',data:structureData, name:'结构化标记量'},
        {type: 'bar', data:diffCount, name:'标记量与抓取量差值'},
      ]
    });
  };


  render() {
    const {dataType,loading}=this.state;
    return (
      <Spin tip="Loading..." spinning={loading}>
        <div>
          <div>
            <BreadCrumb texts={['每日资产数据新增与标记']}></BreadCrumb>
            <div style={{textAlign:'center',marginTop:-35}}>
            <Radio.Group
                onChange={this.onChangeRadio}
                value={dataType}
              >
                <Radio.Button value={3} style={{width:90}}>
                  <span>总量</span>
                </Radio.Button>
                <Radio.Button value={1} style={{width:90}}>
                  <span>相似数据</span>
                </Radio.Button>
                <Radio.Button value={2}>
                  <span>非初标数据</span>
                </Radio.Button>
                <Radio.Button value={0} style={{width:90}}>
                  <span>初标数据</span>
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
          <div className="yc-every-line" id="myChartEveryDay" />
        </div>
      </Spin>


    )
  }

}
export default Index;
