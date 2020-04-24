import React from 'react'
import { Checkbox,Button} from 'antd'
import './index.scss'

const StructureButtonGroup = (props) =>{
    return (
        <div className="yc-component-buttonGroup">
            <OnlyMarkButton></OnlyMarkButton>
            {
                (props.status === 0 || props.status === 2)?
                <Button onClick={props.handleClick.bind(this,1)}>保存并标记下一条</Button>:
                <Button onClick={props.handleClick.bind(this,2)}>保存</Button>
            }
        </div>
    )
}


const OnlyMarkButton = () =>{
    return (
        <div className="yc-component-buttonGroup-onlyMark">
            <Checkbox>仅标记本条</Checkbox>
        </div>
    )
}

export default StructureButtonGroup;