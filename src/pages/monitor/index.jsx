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
        <div className="right-card" style={{ marginLeft: 630}}>
          <div style={{backgroundColor:'#ffffff'}}>
            <SqlMonitor />
          </div>
          <div style={{backgroundColor:'#ffffff'}}>
            <RuleMonitor />
          </div>

        </div>
      </div>
    )
  }

}
export default Index;
