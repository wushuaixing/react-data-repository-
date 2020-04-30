import React from 'react'
import { Checkbox,Button} from 'antd'
import {STRUCTURE_SAVE_BUTTON_TEXT} from '@/static/status'
import './index.scss'

class StructureButtonGroup extends React.Component{
    state = {
        buttonDisabled:true
    }
    handleChange(e) {
        this.props.handleChange(e.target.name, e.target.checked * 1)
    }
    handleClick(){
        this.props.handleSubmit()
    }
    componentWillMount(){
        
    }
    componentWillUnmount(){
        clearInterval(this.timeId)
    }
    render(){
        const buttonText = STRUCTURE_SAVE_BUTTON_TEXT[this.props.status]
        this.timeId = setTimeout(()=>{
            this.setState({
               buttonDisabled:false
            })
       },3000)
        return (
            <div className="yc-component-buttonGroup">
                <OnlyMarkButton handleChange={this.handleChange.bind(this)}></OnlyMarkButton>
                <Button onClick={this.handleClick.bind(this)} disabled={this.state.buttonDisabled}>{buttonText}</Button>
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