/** 错误原因展示* */
import React from 'react';
import StructureRecord from "../../components/structureRecord";
// ==================
// 所需的所有组件
// ==================


class  BasicDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basic:{},
      records:[],
      auctionStatus:'',
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
    const {info,records,status,need}=nextProps;
    // console.log(nextProps,'next');
    this.setState({
      basic:info,
      records:records,
      auctionStatus:status,
      needRecord:need,
    });
  }
  //打开标题链接
  openLink=()=>{
    let href = window.location.href.split("#")[0];
    // window.open(href + "#/SourcePage/"+this.$route.params.id);
  };



  //
  associated=(id) =>{
    let href = window.location.href.split("#")[0];
    // window.open(
    // 	href + "#/check/" + id + "/" + strucData.data[0].auctionStatus
    // );
  };

 /* filterAuctionStatus=(value) =>{
    if (value === 1) {
      return "即将开始";
    } else if (value === 3) {
      return "拍卖中";
    } else if (value === 5) {
      return "成功交易";
    } else if (value === 7) {
      return "失败";
    } else if (value === 9) {
      return "终止";
    } else if (value === 11) {
      return "撤回";
    }
  };*/
  render() {
    const { basic,records,auctionStatus,needRecord }=this.state;
    // const auctionStatus=this.filterAuctionStatus.bind(basic.auctionStatus);
    // console.log(auctionStatus);
        return(
          <div>
            <div className="yc-wrong-part">
              <div className="yc-part-title">
                <p>基本信息</p>
              </div>
              <div className="yc-wrong-detail">
                <div>
                  <p className="yc-sec-title">标题:</p>
                  <p className="yc-link-title" onClick={this.openLink} style={{ marginLeft:5 }} >{ basic.title }</p>
                </div>
                <div>
                  <p className="yc-sec-title">拍卖状态:</p>
                  <p className="yc-sec-title" style={{ marginLeft:5}}>{auctionStatus}</p>
                </div>
                <div>
                {needRecord && <StructureRecord records={records} />}
                {/*//什么数据是有撤回原因和关联标注的 条件：!character && status !== 0*/}
                </div>
                <div>
                  <p className="yc-sec-title">撤回原因:</p>
                  <p className="yc-sec-title" style={{ marginLeft:5}}>
                    {basic.reasonForWithdrawal
                    ? basic.reasonForWithdrawal
                    :'--'}
                  </p>
                </div>
                <div >
                  <p className="yc-sec-title">关联标注:</p>
                  <p
                    className="yc-link-title"
                    style={{ marginLeft:5}}
                    onClick={()=>this.associated(basic.associatedAnnotationId)}
                  >
                    {basic.associatedAnnotationId
                      ? basic.associatedAnnotationId
                      :'--'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
    }
}
export default BasicDetail;
