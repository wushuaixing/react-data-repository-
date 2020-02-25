/** sync monitor * */
import React from 'react';
import EveryMonitor from "./everyDay";
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

      </div>
    )
  }

}
export default Index;
