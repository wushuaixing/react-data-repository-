/** right content for Account manage* */
import React from 'react';
import './style.scss';
// ==================
// 所需的所有组件
// ==================


/*const errorList=[
  {"desc":"结构化","error":false,"errorLevel":0,"time":"2019-03-18 17:10:25","user":"邵颖结构化"},
  {"desc":"事实上多填所有人:\n债权人错误：\n","error":true,"errorLevel":4,"time":"2020-01-06 17:00:20","user":"检察人员"},
  {"desc":"结构化","error":false,"errorLevel":0,"time":"2019-01-18 17:10:25","user":"邵颖结构化"},
  {"desc":"多填所有人:\n债权人错误：\n","error":true,"errorLevel":4,"time":"2020-02-06 17:00:20","user":"检察人员"},
];*/

class  WrongReason extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailText:'错误详情',
      detailList:[],
      levelText:'错误等级',
      errorLevel:'',
      data:{},
      errorList:[],
		};
  }

  componentWillMount() {
    let storage = window.localStorage;
    const role = storage.userState;
console.log(role);

    if(role === "结构化人员"){

    }
    if(role === "检查人员"){

    }
    if(role === "管理员"){

    }

  }

  //filterLevel
  filterLevel=(level)=>{
      if (level === 1) {
        return "严重";
      } else if (level === 4) {
        return "普通";
      } else if (level === 7) {
        return "不计入";
      }
  };

  render() {
    const { errorList }=this.props;
    // const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
        return(
          <div>
            <div className="yc-wrong-part">
              <div className="part-title">
                <p>错误原因</p>
              </div>
              {/*//待修改*/}
              <div className="yc-wrong-detail" style={{marginBottom:16}}>
                <p
                  style="color: red;display: block"
                >
                  {errorList.reasonStruc}
                </p>
              </div>
              <div className="yc-wrong-detail" style={{marginBottom:16}}>
                <div
                  style="margin-bottom: 10px;"
                >
                  <div>
                    <p style={{display: 'inline-block'}}>错误等级:</p>
                    <p className="error">{this.filterLevel(errorList.reasonCheck.errorLevel)}</p>
                  </div>
                  <div>
                    <p style={{display: 'inline-block'}}>错误详情:</p>
                    <p className="error">{errorList.reasonCheck.desc}</p>
                  </div>
                </div>
                <p
                  style="color: red;display: block"
                >
                  {errorList.reasonCheck}
                </p>
              </div>
              <div className="yc-wrong-detail" style={{marginBottom:16}}>
                  {
                    errorList.reasonAdmin && errorList.reasonAdmin.map((item,index)=>{
                      return (<div
                        style={{marginBottom: 10}}
                      >
                        <div>
                          <p style={{display: 'inline-block'}}>
                            {item.time +" "+ item.user}
                          </p>
                          <p className="yc-error">有误</p>
                        </div>
                        <div>
                          <p style={{display: 'inline-block'}}>错误等级:</p>
                          <p className="yc-error">{this.filterLevel(item.errorLevel)}</p>
                        </div>
                        <div>
                          <p style={{display: 'inline-block'}}>错误详情:</p>
                          <p className="yc-error">{item.desc}</p>
                        </div>
                      </div>)
                  })
                  }
              </div>
              {/*管理员／检查

                {
                  source.map((item, index) => [
                    <PartyCrosswiseDetail {...item} id={row.id} key={row.id} width={maxWidth} max={9999} />,
                    index !== source.length - 1 ? <span className="yc-split-line yc-split-line-info" /> : null,
                  ])
                }*/}
            </div>
          </div>
        );
    }
}
export default WrongReason;
