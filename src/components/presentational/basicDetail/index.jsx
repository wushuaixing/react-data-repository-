/** 错误原因展示* */
import React from 'react';
import {Link} from "react-router-dom";
import StructureRecord from "../structureRecord";

const storage = window.localStorage;
const role = storage.userState;

class  BasicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basic:{},
      records:[],
      auctionStatus:'',
      dataStatus:0,
		};
  }

  componentDidMount() {
 /*   const {info,records,status}=this.props;
    console.log(info,records);
    this.setState({
      basic:info,
      records:records,
      auctionStatus:status,
    });*/

  }
  componentWillReceiveProps(nextProps){
    const {info,records,status,need,dataStatus}=nextProps;
    // console.log(nextProps,'next');
    let _data=parseInt(dataStatus);
    this.setState({
      basic:info,
      records:records,
      auctionStatus:status,
      needRecord:need,
      dataStatus:_data,
    });
  }

  render() {
    const { basic,records,auctionStatus,needRecord,dataStatus }=this.state;
        return(
          <div>
            <div className="yc-wrong-part">
              <div className="yc-part-title">
                <p>基本信息</p>
              </div>
              <div className="yc-wrong-detail">
                <div>
                  <p className="yc-sec-title">标题:</p>
                  <Link to={`/sourcePage/1855771`} target="_blank">
                    <p className="yc-link-title" style={{ marginLeft:5 }} >
                      { basic.title }
                    </p>
                  </Link>
                </div>
                <div>
                  <p className="yc-sec-title">拍卖状态:</p>
                  <p className="yc-sec-title" style={{ marginLeft:5}}>{auctionStatus}</p>
                </div>
                <div>
                {needRecord && <StructureRecord records={records} />}
                {/*//什么数据是有撤回原因和关联标注的 条件：!character && status !== 0*/}
                </div>
                {
                  ((dataStatus !== 0 && role==="检查人员") ||( auctionStatus === "终止" || auctionStatus === "撤回"))&&
                  <div>
                    <p className="yc-sec-title">撤回原因:</p>
                    <p className="yc-sec-title" style={{ marginLeft:5}}>
                      {basic.reasonForWithdrawal
                        ? basic.reasonForWithdrawal
                        :'--'}
                    </p>
                  </div>
                }
                {
                  ((dataStatus !== 0 && role==="检查人员") || basic.type === 2)&&
                  <div>
                    <p className="yc-sec-title">关联标注:</p>
                    <p
                      className="yc-link-title"
                      style={{marginLeft: 5}}
                      onClick={() => this.associated(basic.associatedAnnotationId)}
                    >
                      {basic.associatedAnnotationId
                        ? basic.associatedAnnotationId
                        : '--'}
                    </p>
                  </div>
                }
              </div>
            </div>
          </div>
        );
    }
}
export default BasicDetail;
