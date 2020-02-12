/** 错误原因展示* */
import React from 'react';
import './style.scss';
// ==================
// 所需的所有组件
// ==================


class  WrongReason extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      errorList:{},
		};
  }

  componentWillReceiveProps(nextProps){
    const _list=nextProps.errorList;
    this.setState({
      errorList:_list,
    });


/*    if(role === "结构化人员"){

    }
    if(role === "检查人员"){

    }
    if(role === "管理员"){

    }*/

  }

  //filterLevel 错误等级
  filterLevel=(level)=>{
    // console.log('level',level);
      if (level === 1) {
        return "严重";
      } else if (level === 4) {
        return "普通";
      } else if (level === 7) {
        return "不计入";
      }
  };


  render() {
    let storage = window.localStorage;
    const role = storage.userState;
    const { errorList }=this.state;
    let reasonStruc,reasonCheck,reasonAdmin;
    if(role === "结构化人员"){
      reasonStruc=errorList;
    }
    if(role === "检查人员"){
      reasonCheck=errorList;

    }
    if(role === "管理员"){
      reasonAdmin=errorList;

    }
    // const {reasonStruc,reasonCheck,reasonAdmin}= errorList;

        return(
          <div>
            <div className="yc-wrong-part">
              <div className="yc-part-title">
                <p>错误原因</p>
              </div>
              {/*//待修改*/}
              <div className="yc-wrong-detail">
                <p className="yc-struc-text">
                  {reasonStruc && reasonStruc}
                </p>
              </div>
              {/*//检查*/}
              <div className="yc-wrong-detail">
                <div>
                  {
                    reasonCheck && reasonCheck.map((item,index)=>{
                      item.errorLevel=this.filterLevel(item.errorLevel);
                      return(
                        <div key={index}>
                          <div>
                            <p className="yc-sec-title">错误等级:</p>
                            <p className="yc-error">{item && this.filterLevel(item.errorLevel)}</p>
                          </div>
                          <div>
                            <p className="yc-sec-title">错误详情:</p>
                            <p className="yc-error">{item && item.desc}</p>
                          </div>
                        </div>)
                    })
                  }
                </div>
              </div>
              {/*//管理员*/}
              <div className="yc-wrong-detail">
                {
                  reasonAdmin && reasonAdmin.map((item,index)=>{
                    item.errorLevel=this.filterLevel(item.errorLevel);
                    return (<div
                      style={{marginBottom: 10}} key={index}
                    >
                      <div>
                        <p className="yc-sec-title">
                          { item.time && item.user && item.time +" "+ item.user}
                        </p>
                        <p className="yc-error">有误</p>
                      </div>
                      <div>
                        <p className="yc-sec-title">错误等级:</p>
                        <p className="yc-error">{item.errorLevel && item.errorLevel}</p>
                      </div>
                      <div>
                        <p className="yc-sec-title">错误详情:</p>
                        <p className="yc-error">{item.desc && item.desc}</p>
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
export default WrongReason;
