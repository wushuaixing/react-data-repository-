/** sync monitor * */
import React from 'react';
import EveryMonitor from "./everyDay";
import RecentMonitor from "./recent";
import PythonTag from "./pythonAndTag";
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
        <div className="yc-struct" style={{backgroundColor:'#ffffff'}}>
          <EveryMonitor />
        </div>
        <div className="yc-chart" style={{marginTop:20}}>
          <div className="yc-left-chart" style={{backgroundColor:'#ffffff'}}>
            <RecentMonitor />
          </div>
          <div className="yc-right-chart" style={{backgroundColor:'#ffffff'}}>
            <PythonTag />
          </div>
        </div>

      </div>
    )
  }

}
export default Index;
