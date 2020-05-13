import React from 'react';
import { Button, Icon } from 'antd'
import { withRouter } from 'react-router-dom';
import './style.scss'
class BreadCrumb extends React.Component {
    static defaultProps = {
        texts: [],
        breadButtonText: null,
        icon: null,
        note: null,
        handleClick: null,
        disabled: false
    }
    get showTag() {
        //当处于0tab下显示  处于1tab并且是被返回一层时  显示
        const { status } = this.props.match.params
        if ((sessionStorage.getItem("backTime") === "1" && status === '1') || (status === '0')) {
            return this.props.note;
        } else {
            return null;
        }
    }
    get breadButtonText(){
        //结构化人员status 0或者在status为1 返回了一次的时候*/
        const { status } = this.props.match.params
        if (status === '0') {
            return '返回上一条';
        } 
        else if(sessionStorage.getItem("backTime") === "1" && status === '1'){
            return '返回';
        }
        else {
            return null;
        }
    }
    render() {
        //console.log(this.showTag)
        let text = this.props.texts.length > 1 ? this.props.texts.join(' > ') : this.props.texts[0]
        return (
            <div className="yc-components-breadCrumb" >
                <div className="yc-components-breadCrumb-body">{text}</div>
                {this.breadButtonText ?
                    <div className="yc-components-breadCrumb_button">
                        {this.showTag ? <span className="yc-components-breadCrumb_button-note">{this.props.note}</span> : null}
                        <Button type="default" onClick={this.props.handleClick} disabled={this.props.disabled}>
                            {this.props.icon ? <Icon type={this.props.icon} /> : null}
                            {this.breadButtonText}
                        </Button>
                    </div> : null}

            </div>
        )
    }
}
export default withRouter(BreadCrumb);
