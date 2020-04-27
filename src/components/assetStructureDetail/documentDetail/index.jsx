import React from 'react'
import { Button, Input, Radio, Checkbox } from 'antd'
import './index.scss'

class StructureDocumentDetail extends React.Component {
    handleChange = (e) => {
        if(e.target.type === 'checkbox'){
            this.props.handleChange(e.target.name, e.target.checked * 1)
        }
        else if(e.target.type === 'text'){
            this.props.handleDocumentChange(e.target.name,e.target.value)
        }
        else{
            this.props.handleChange(e.target.name,e.target.value)
        }
    }
    
    get documentInputNumber(){
        return this.props.ah.length;
    }
    get linkInputNumber(){
        return this.props.wsUrl.length;
    }
    get wsInAttach(){
        return Boolean(this.props.wsInAttach)
    }
    render() {
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">文书信息</div>
                <div className="yc-components-basicDetail_body">

                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'>查找情况：</span>
                        <Radio.Group value={this.props.wsFindStatus} name="wsFindStatus" onChange={this.handleChange}>
                            <Radio value={1}>找到文书</Radio>
                            <Radio value={0}>未找到文书</Radio>
                        </Radio.Group>
                    </div>
                    {
                        this.props.wsFindStatus === 1 ?
                            <div>
                                <DocumentLinkInputs 
                                values={this.props.ah}
                                attr={'ah'}
                                text={'相关文书案号'} 
                                num={this.documentInputNumber} 
                                handleChange={this.handleChange}
                                handleDeleteClick={this.props.handleDeleteClick.bind(this,'ah')} 
                                handleAddClick={this.props.handleAddClick.bind(this,'ah')}>
                                </DocumentLinkInputs>
                                <DocumentLinkInputs 
                                values={this.props.wsUrl}
                                attr={'wsUrl'}
                                text={'文书链接地址'} 
                                num={this.linkInputNumber} 
                                handleChange={this.handleChange}
                                handleDeleteClick={this.props.handleDeleteClick.bind(this,'wsUrl')} 
                                handleAddClick={this.props.handleAddClick.bind(this,'wsUrl')}>>
                                </DocumentLinkInputs>
                                <div className="yc-components-assetStructureDetail_body-row">
                                    <span className='yc-components-assetStructureDetail_body-row_title'></span>
                                    <span className='seeDetail'>
                                        <Checkbox name="wsInAttach" onChange={this.handleChange} checked={this.wsInAttach}>详情见资产拍卖附件</Checkbox>
                                    </span>
                                </div>
                            </div> :null
                    }
                </div>
            </div>
        )
    }
}
const DocumentLinkInputs = (props) => {
    return (
        <div>
            {
                (() => {
                    const arr = []
                    for (let i = 0; i < props.num; i++) {
                        arr.push(
                            <DocumentLinkInput attr={props.attr} value={props.values[i]}
                            key={i} index={i} text={props.text} num={props.num} handleChange={props.handleChange}
                            handleDeleteClick={props.handleDeleteClick} handleAddClick={props.handleAddClick}
                            ></DocumentLinkInput>
                        )
                    }
                    return arr;
                })()
            }
        </div>
    )
}
const DocumentLinkInput = (props) => {
    return (
        <div className="yc-components-assetStructureDetail_body-row">
            {
                props.index === 0 ?
                    <span className='yc-components-assetStructureDetail_body-row_title'>{`${props.text}：`}</span> :
                    null
            }
            <span className={props.index !== 0 ? 'addition-ah' : null}>
                <Input placeholder={`请输入${props.text}`} onChange={props.handleChange} name={`${props.attr}${props.index}`} value={props.value.value} />
                {
                    props.num < 3 ?
                        <Button type="primary" shape="circle" size="small" icon="plus" onClick={props.handleAddClick}></Button> :
                        null
                }
                {
                    props.num > 1 ?
                        <Button type="default" shape="circle" size="small" icon="minus" onClick={props.handleDeleteClick}></Button> :
                        null
                }
            </span>
        </div>
    )
}

export default StructureDocumentDetail