/** sync monitor * */
import React from 'react';
import {message,Radio,Badge,Row,Col} from "antd";
import {newAndStruc} from "../../../server/api";
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
      timeType:0,
      lastTitle:"昨日剩余",
      remainLast:0,
      newCome:0,
      before18:0,
      taskTagged:0,
      allTagged:0,
      lastRest:0,
      allLast:0,
      after18:0,
      newData:0,
      tagPercent:0,
    };
  }

  componentDidMount() {
    const {timeType}=this.state;
    this.changeDay(timeType);

  }

  onChangeRadio=(e)=>{
    let type=parseInt(e.target.value);
    this.changeDay(type);
    this.setState({
      timeType:type,
    });
    if(type===0){
      this.setState({
        lastTitle:"昨日剩余",
      })
    }
    if(type===1){
      this.setState({
        lastTitle:"今日剩余",
      })
    }
  };

//昨日新增 0-昨天；1-今天 默认今天
  changeDay(type){
    newAndStruc(type).then(res=>{
      if (res.data.code === 200) {
        const {lastDayNewComeLast,newCome,before18,after18
        ,underTaskStructured,allStructured,last,allLast}=res.data.data;
        const remainLast=parseInt(lastDayNewComeLast);
        const numLast=parseInt(remainLast);
        const numBefore=parseInt(before18);
        const newData =numLast +numBefore;
        //接口数据
        // if(newData===0){
        //   this.drawRingPIe(0);
        // }
				// else if(numLast>0 && numBefore>0 && lastTagIn>0){
				//   const tagPercent= (underTaskStructured/newData).toFixed(2);
				// 	this.drawRingPIe(tagPercent);
        // }
        //暂时测试数据

        this.drawRingPie(65);

        this.setState({
          remainLast:remainLast,
          newCome:newCome,
          before18:before18,
          after18:after18,
          taskTagged:underTaskStructured,
          allTagged:allStructured,
          lastRest:last,
          allLast:allLast,
        });

      }else{
        message.error(res.data.message)
      }
    });
  };

//近期新增与标记 当日标注完成率
  drawRingPie=(data)=>{
    let ringPie=echarts.init(document.getElementById('ring-pie'));
    ringPie.setOption({
      color:['#1CAFE0FF','#16B45CFF'],
      title: {
        text:'当日完成率',
        top:'90px',
        left:"40px",
        textStyle:{
          fontWeight:'bold',
          fontSize: 14,
        },
        // textAlign:'center',
      },
      legend:{
        show:true,
        left: 0,
        top: 10,
      },
      series: [
        {
          type:'pie',
          radius: ['40%', '60%'],
          avoidLabelOverlap: false,
          hoverAnimation:false,
          label: {
            show: true,
            position: 'inside',
            formatter:'{c}%'
          },
          labelLine: {
            normal: {
              show: false
            }
          },
          data: [{
            value:65,name:'当日完成率'
          },{
            value:32,name:''
          }]
        }
      ]
    })
  };

  render() {
    const {timeType,remainLast,newCome,before18,taskTagged,allTagged,lastRest,allLast,after18,newData,lastTitle}=this.state;
    return (
          <div>
            <div className="yc-detail-title" >
              <div style={{ fontSize:16, color:'#293038',fontWeight:800,marginBottom:15 }}>近期新增与标记</div>
            </div>
            <div className="yc-detail-title" >
              <Radio.Group
                style={{marginTop:10,marginLeft:-50}}
                onChange={this.onChangeRadio}
                value={timeType}
              >
                <Radio.Button value={1} style={{width:70,height:28}}>
                  <span>昨日</span>
                </Radio.Button>
                <Radio.Button value={3} style={{width:70,height:28}}>
                  <span>今日</span>
                </Radio.Button>
              </Radio.Group>
              <div className="yc-ring-pie" id="ring-pie" style={{marginTop:40}} />
              <div className="yc-ring-text">
                <div>
                  <Row>
                    <Col span={8}>
                      <Badge status="default"
                             style={{float:'left',width:150,textAlign:'left',color:'#293038',fontWeight:400}}
                             text="前日18点后新增剩余" />
                      <br />
                      <Badge status="default"
                             style={{float:'left',width:150,textAlign:'left',color:'#293038',fontWeight:400,marginTop:10}}
                             text="昨日新增" />
                      <Badge status="default"
                             style={{float:'left',width:150,textAlign:'left',color:'#293038',fontWeight:400,marginTop:10}}
                             text="昨日新增" />
                      <p style={{marginLeft:10,marginBottom:0,color:'#293038',textAlign:'right'}}>其中，18点前新增</p>
                      <p style={{marginLeft:20,marginBottom:0,color:'#293038',textAlign:'right'}}>18点后新增</p>
                      <Badge status="default"
                             style={{float:'left',width:150,textAlign:'left',color:'#293038',fontWeight:400,marginTop:10}}
                             text="昨日任务内标记" />
                      <br />
                      <Badge status="default"
                             style={{float:'left',width:150,textAlign:'left',color:'#293038',fontWeight:400,marginTop:10}}
                             text="昨日总标记" />
                    </Col>
                    <Col span={6}>
                        <p style={{fontWeight:800,fontSize:16,color:'#293038',marginBottom:5}}>
                          {remainLast}<span style={{color:'#808387',fontSize:14,marginLeft:4}}>条</span></p>
                      <p style={{fontWeight:800,fontSize:16,color:'#293038',marginBottom:28}}>
                        {newCome}<span style={{color:'#808387',fontSize:14,marginLeft:4,}}>条</span></p>
                      <p style={{fontWeight:800,fontSize:16,color:'#293038',marginBottom:0}}>
                        {before18}<span style={{color:'#808387',fontSize:14,marginLeft:4}}>条</span></p>
                      <p style={{fontWeight:800,fontSize:16,color:'#293038',marginBottom:5}}>
                        {after18}<span style={{color:'#808387',fontSize:14,marginLeft:4}}>条</span></p>
                      <p style={{fontWeight:800,fontSize:16,color:'#293038',marginBottom:6}}>
                        {taskTagged}<span style={{color:'#808387',fontSize:14,marginLeft:4}}>条</span></p>
                      <p style={{fontWeight:800,fontSize:16,color:'#293038'}}>
                        {allTagged}<span style={{color:'#808387',fontSize:14,marginLeft:4}}>条</span></p>
                    </Col>
                  </Row>
                </div>
              </div>
              {/*<div className="yc-border-line">*/}
                    {/*<span >*/}
                        {/*{lastTitle}</span>*/}
                {/*<span >{lastRest}</span>条*/}
                {/*<span >*/}
                        {/*当前总剩余 </span>*/}
                {/*<span>{allLast}</span>条*/}
              {/*</div>*/}
            </div>
            <div style={{fontWeight:500,color:'#293038',marginBottom:20,marginTop:20}}>
              <div style={{display:'inline-block',float:'left',marginBottom:20,marginLeft:20,borderTop:1,borderTopColor:'#e2e4e9'}}>
                  <span>{lastTitle} </span>
                  <span style={{marginLeft: 10}}>{lastRest}</span>条
              </div>
              <div  style={{display:'inline-block',float:'right',marginRight:20}}>
              <span >当前总剩余 </span>
              <span style={{marginLeft: 10}}>{allLast}</span>条
              </div>
            </div>
          </div>
    )
  }

}
export default Index;
