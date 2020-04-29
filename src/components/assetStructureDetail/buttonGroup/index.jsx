import React from 'react'
import { Checkbox,Button} from 'antd'
import {STRUCTURE_SAVE_BUTTON_TEXT} from '@/static/status'
import './index.scss'

class StructureButtonGroup extends React.Component{
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    handleClick(){
        this.props.handleSubmit()
    }
    render(){
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[this.props.status]
        //console.log(this.props.status)
        return (
            <div className="yc-component-buttonGroup">
                <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                {
                    <Button onClick={this.handleClick.bind(this)}>{buttonText}</Button>
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