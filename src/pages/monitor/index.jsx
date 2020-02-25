/** sync monitor * */
import React from 'react';
import SourcePie from "./sourcePie";
import SourceAndPython from "./sourceAndPython";
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
      <div style={{backgroundColor:'#ffffff',margin:20}}>
        <div className="yc-left-card">
            <SourcePie />
            <SourceAndPython />
        </div>
        <div className="right-card">

        </div>
      </div>
    )
  }

}
export default Index;
