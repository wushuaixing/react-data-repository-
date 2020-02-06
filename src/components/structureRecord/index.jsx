/** right content for Account manage* */
import React from 'react';
import './style.scss';
// ==================
// 所需的所有组件
// ==================


class  StructureDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      detailText:'错误详情',
      detailList:[],
      levelText:'错误等级',
      errorLevel:'',

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
    const { recordsForCheck }=this.props;
    // const { dataMark, dataTotal, buttonText, buttonStyle }=this.state;
        return(
          <div>
            <div className="line">
              <p style="float: left">结构化记录:</p>
              <div style="display: inline-block">

                {/*forEach*/}
               {/* <div>
                  <p style="display: inline-block">
                    {{item.time}}
                  </p>
                  <p style="display: inline-block;margin-left: 5px"
                  >
                    {{item.user}}
                  </p>
                  <!--<p style="display: inline-block;margin-left: 5px"
                  >
                      {{item.desc}}
                  </p>-->
                  <p
                    style="display: inline-block;margin-left: 10px"
                    v-if="index == 0 && item.desc =='结构化'">
                    <!--                        v-if=" 'index == 0' && 'item.desc==结构化' "-->

                    初次结构化
                  </p>
                  <p
                    style="color: red;display: inline-block;margin-left: 10px"
                    v-else-if="item.error"
                  >
                    有误
                  </p>
                  <p
                    style="color: green;display: inline-block;margin-left: 5px"
                    v-else-if="!item.error && item.desc !='结构化' "
                  >
                    无误
                  </p>
                  <p style="display:  inline-block;margin-left: 5px" v-else>
                    修改
                  </p>
                </div>*/}
              </div>
            </div>
          </div>
        );
    }
}
export default StructureDetail;
