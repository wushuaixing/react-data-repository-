/**基本信息--结构化记录  */
import React from 'react';
// ==================
// 所需的所有组件
// ==================


class  StructureRecord extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      strucRecords:[],
		};
  }

  componentWillMount() {
    let storage = window.localStorage;
    const role = storage.userState;
    if(role === "结构化人员"){

    }
    if(role === "检查人员"){

    }
    if(role === "管理员"){
      this.setState({
        strucRecords:this.props.records,
      });
    }

  }

  toSetText=(desc,error,index)=>{
    let result={};
    if(index === 0 && desc ==='结构化'){
      result={
        styleText:{marginLeft:8},
        text:'初次结构化',
      };
      return result;
    }
    else if(error){
      result={
        styleText:{color:'red',marginLeft:8},
        text:'有误',
      };
      return result;
    }
     else if(!error && desc !=='结构化' ){
      result={
        styleText:{color:'green',marginLeft:8},
        text:'无误',
      };
      return result;
    }
    else{
      result={
        styleText:{marginLeft:8},
        text:'修改',
      };
      return result;
    }
  };

  render() {
    const { recordsForCheck }=this.state;
    // const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
        return(
          <div>
            <div className="yc-wrong-part">
              <p className="yc-sec-title">结构化记录:</p>
              <div style={{display: 'inline-block'}}>
                {
                  recordsForCheck && recordsForCheck.map((item,index)=>{
                    const desc=this.toSetText(item.desc,item.error,index);
                    return (
                      <div
                      style={{marginBottom: 10}} key={index}
                      >
                      <div >
                        <p className="yc-sec-title">
                          { item.time &&  item.time }
                        </p>
                        <p className="yc-sec-title" style={{marginLeft:5}}>
                          { item.user &&  item.user }
                        </p>
                        <p className="yc-sec-title">
                          { item.time &&  item.time }
                        </p>
                        <p className="yc-sec-title" style={desc.styleText}>
                          {desc.text}
                        </p>
                      </div>
                    </div>)
                  })
                }
              </div>
            </div>
          </div>
        );
    }
}
export default StructureRecord;
