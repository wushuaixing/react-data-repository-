/** right content for Account manage* */
import React from 'react';
import './style.scss';
// ==================
// 所需的所有组件
// ==================



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


    if(role === "结构化人员"){

    }
    if(role === "检查人员"){

    }
    if(role === "管理员"){

    }

  }

  render() {
    const { }=this.props;
    // const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
        return(
          <div>
            {/*<div className="yc-wrong-part">
              <div className="part-title">
                <p>错误原因</p>
              </div>
              //待修改
              <div className="yc-wrong-detail">
                <div className="line">
                  <p
                    style="color: red;display: block"
                    v-for="item in data.wrongReason"
                  >
                    {{item}}
                  </p>
                </div>
              </div>
              管理员／检查
              <div className="detail" v-show="character">
                <div className="line">
                  <div
                    style="margin-bottom: 10px;"
                    v-for="item in checkErrorList"
                  >
                    <div>
                      <p style="display: inline-block">
                        {{item.time + " " + item.user}}
                      </p>
                      <p className="error">有误</p>
                    </div>
                    <div>
                      <p style="display: inline-block">错误等级:</p>
                      <p className="error">{{item.errorLevel | filterErrorLevel}}</p>
                    </div>
                    <div>
                      <p style="display: inline-block">错误详情:</p>
                      <p className="error">{{item.desc}}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="detail" v-show="!character">
                <div className="line">
                  <div
                    style="margin-bottom: 10px;"
                  >
                    <div>
                      <p style="display: inline-block">错误等级:</p>
                      <p className="error">{{checkError.errorLevel | filterErrorLevel}}</p>
                    </div>
                    <div>
                      <p style="display: inline-block">错误详情:</p>
                      <p className="error">{{checkError.desc}}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>*/}
          </div>
        );
    }
}
export default WrongReason;
