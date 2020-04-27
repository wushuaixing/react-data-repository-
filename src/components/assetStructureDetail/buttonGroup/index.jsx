import React from 'react'
import { Checkbox,Button} from 'antd'
import './index.scss'

class StructureButtonGroup extends React.Component{
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    handleClick(){
        this.props.handleSubmit()
    }
    render(){
        return (
            <div className="yc-component-buttonGroup">
                <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                {
                    (this.props.status === 0 || this.props.status === 2)?
                    <Button onClick={this.handleClick.bind(this)}>保存并标记下一条</Button>:
                    <Button onClick={this.handleClick.bind(this)}>保存</Button>
                }
            </div>
        )
    }
}

const OnlyMarkButton = (props) =>{
    return (
        <div className="yc-component-buttonGroup-onlyMark">
            <Checkbox onChange={props.handleChange} name="onlyThis">仅标记本条</Checkbox>
        </div>
    )
}

export default StructureButtonGroup;