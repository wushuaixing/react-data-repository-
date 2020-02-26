/** sync monitor * */
import React from 'react';
import SourcePie from "./sourcePie";
import SourceAndPython from "./sourceAndPython";
import SqlMonitor from "./sqlMonitor";
import RuleMonitor from "./ruleMonitor";
import './style.scss';

class Index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount() {


  }

  render() {
    return (
      <div style={{margin:20}}>
        <div className="yc-left-card" style={{backgroundColor:'#ffffff'}}>
            <SourcePie />
            <SourceAndPython />
        </div>
        <div className="yc-right-card">
          <div style={{backgroundColor:'#ffffff',marginLeft:10,marginBottom:0}}>
            <SqlMonitor />
          </div>
          <div style={{marginTop:20,marginLeft:10,backgroundColor:'#ffffff',minHeight:630}}>
            <RuleMonitor />
          </div>
        </div>
      </div>
    )
  }

}
export default Index;
