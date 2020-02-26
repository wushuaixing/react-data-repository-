/** sync monitor * */
import React from 'react';
import {message, Select, DatePicker} from "antd";
import moment from 'moment';
import {pythonAmountIn31, structurePython} from "../../../server/api";
import echarts from 'echarts/lib/echarts';
// 引入柱状图
import  'echarts/lib/chart/line';
import  'echarts/lib/chart/pie';
import  'echarts/lib/chart/bar';

// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import '../style.scss';

const { Option } = Select;
//获取当日日期
const dateFormat = 'YYYY-MM-DD';
const today=new Date();
const seperator1="-";
let year = today.getFullYear();
let month = today.getMonth() + 1;
let strDate = today.getDate();
if (month >= 1 && month <= 9) {
  month = "0" + month;
}
if (strDate >= 0 && strDate <= 9) {
  strDate = "0" + strDate;
}
let nowDate=year + seperator1 + month + seperator1 + strDate;

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sourceList:[
        {
          value: "全部",
          label: "全部"
        },
        {
          value: "阿里司法拍卖",
          label: "阿里司法拍卖"
        },
        {
          value: "公拍网",
          label: "公拍网"
        },
        {
          value: "京东司法拍卖",
          label: "京东司法拍卖"
        },
        {
          value: "中国拍卖行业协会",
          label: "中国拍卖行业协会"
        },
        {
          value: "人民法院诉讼资产网",
          label: "人民法院诉讼资产网"
        },

      ],
      time:nowDate,
      sourceId:0,
    };
  }

  componentDidMount() {
    const {sourceId,time}=this.state;

    this.getSourceList(sourceId, time);

  }

  onChangeDate=(e)=>{
    let _date=this.dataFilter(e);
    console.log(_date);
    this.changeDate(_date);
    this.setState({
      time:_date,
    })
  };

  //日期转换
  dataFilter=(value)=>{
    let data = new Date(value);
    let year = data.getFullYear();
    let month = data.getMonth() + 1;
    if (month < 10) {
      month = "0" + month;
    }
    let date = data.getDate();
    if (date < 10) {
      date = "0" + date;
    }
    return year + "-" + month + "-" + date;
  };

  //资产数据抓取时间段分布 数据源选择
  onChangeSelect=(value)=>{
    const {time}=this.state;
    if (value === "全部") {
      this.getSourceList(0,time);
    } else if (value === "阿里司法拍卖") {
      this.getSourceList(1,time);
    } else if (value === "公拍网") {
      this.getSourceList(3,time);
    }else if (value === "京东司法拍卖") {
      this.getSourceList(4,time);
    }else if (value === "中国拍卖行业协会") {
      this.getSourceList(5,time);
    }else if (value === "人民法院诉讼资产网") {
      this.getSourceList(6,time);
    }
  };

  //资产数据抓取时间段
  getSourceList=(id,time)=>{
    this.setState({
      sourceId:id,
    });
    structurePython(id,time).then(res =>{
      if (res.data.code === 200) {
        this.drawStructureTime(res.data.data);
        let pieData=res.data.data.structureDataBy18thPoint;
        this.drawTime18Pie(pieData);
      }else{
        message.error(res.data.message)
      }
    });
    pythonAmountIn31(id).then(res=>{
      if(res.data.code === 200){
        let amount=res.data.data;
        this.drawStructureTime(amount);
      }else{
        message.error(res.data.message)
      }
    })
  };

  //资产数据抓取时间段分布 结构化时间选择 默认选择当日
  changeDate=(data)=>{
    const {sourceId}=this.state;
    this.getSourceList(sourceId,data);
  };

  // 资产数据抓取时间段分布
  drawStructureTime=(data)=>{
    let pythonTime=echarts.init(document.getElementById('pythonTime'));
    //console.log(data);
    let hourData=[];
    let hourAmount=[];
    if(data.length===24){
      for(let key in data){
        hourAmount.push([
            data[key].hour,
            data[key].structureDataBy24Points
          ]
        );
      }
      hourAmount.reverse();
    }
    else{
      let every=data.structureDataBy24Points;
      for(let key in every){
        hourData.push([
            every[key].hour,
            every[key].structureDataBy24Points
          ]
        );
      }
      hourData.reverse();
    }
    //
    pythonTime.setOption({
      color:['#1CAFE0FF','#FD9C26FF','#F03733FF','#126EC7FF','#16B45CFF','#8F56DFFF'],
      title : {
        text: '资产数据抓取时间段分布图',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
        left:20,
      },
      legend: {
        left:20,
        top: 30,
        icon:'circle',
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
      /*xAxis: {
					 type: 'category',
					 splitLine: {
							 show: true,
							 lineStyle: {
									 color: '#999',
									 type: 'dashed'
							 }
					 },
			 },
			 yAxis: yAxisStyle,*/
      xAxis: {
        type: 'category',
        boundaryGap: false,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#999',
            type: 'dashed'
          }
        },
        axisLine: {
          show: true
        }
      },
      yAxis: {
        type: 'value',
        axisLine: {
          show: false
        },
        splitLine: {
          show: false,
        }
      },
      series: [
        {
          type: 'line',
          name: '日抓取分布',
          data: hourData,
        },
        {
          type: 'line',
          name: '31日抓取总量分布',
          data: hourAmount,
        }
      ]
    });
  };

  drawTime18Pie=(data)=>{
    let pieEighteen=echarts.init(document.getElementById('pieEighteen'));
    let pieData=[];
    pieData.push({
        name:'18点前抓取',
        value:data.structureDataBefore18thPoint,
      },{
        name:'18点后抓取',
        value:data.structureDataAfter18thPoint,
      },
    );
    //18点前后抓取数据占比 饼图
    let formatterTemp='{b}:{c0}({d}%)';
    pieEighteen.setOption({
      color:['#1CAFE0FF','#FD9C26FF','#F03733FF','#126EC7FF','#16B45CFF','#8F56DFFF'],
      title : {
        text: '18点前后抓取数据占比',
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
        left: 15,
        top:70,
      },
      legend: {
        orient: 'vertical',
        right:10,
        top: 140,
        icon:'circle',
        itemWidth:6,
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a}<br/>{b}<br/>{d}%',
      },
      series: [
        {
          type: 'pie',
          id: 'pie',
          radius: '40%',
          hoverAnimation: true,
          legendHoverLink:false,
          animation:false,
          center: ['50%', '50%'],
          label: {
            formatter:"{b} : {c0} ({d}%)",
          },
          emphasis:{
            label:{
              formatter:formatterTemp,
            }
          },
          data: pieData,
        },
      ]
    });
  };

  render() {
    const {sourceList}=this.state;
    return (
          <div>
            <div className="yc-detail-title" >
              <div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>资产数据抓取时间段分布</div>
            </div>
            <div className="yc-left-chart" style={{backgroundColor:'#ffffff'}} >
              <div style={{marginTop:20,marginBottom:20}}>
                  <span style={{display: 'inline-block', marginLeft: 26,color:'#293038'}}>数据源：</span>
                  <div style={{display: 'inline-flex'}}>
                    <Select style={{width:150,marginLeft:4,height:28}}
                            transfer
                            placeholder="全部"
                            onChange={this.onChangeSelect}
                            defaultValue="全部"
                    >
                      {
                        sourceList && sourceList.map((item) => {
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
                <span style={{display: 'inline-block', marginLeft: 20,color:'#293038'}}>结构化时间：</span>
                <div style={{display: 'inline-flex'}}>
                  <DatePicker
                    placeholder="开始时间"
                    style={{width:108,fontSize:12}}
                    onChange={this.onChangeDate}
                    defaultValue={moment(nowDate, dateFormat)}
                    format={dateFormat}
                  />
                </div>
              </div>
            <div className="chart" id="pythonTime" />
            </div>
            <div className="yc-right-chart" style={{backgroundColor:'#ffffff'}} id="pieEighteen">
            </div>
          </div>
    )
  }

}
export default Index;
