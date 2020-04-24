import React from 'react'
import { Button, Input, Radio, Checkbox } from 'antd'
import './index.scss'

class StructureDocumentDetail extends React.Component {

    state = {
        documentInputNumber: 2,
        linkInputNumber: 1
    }
    handleDeleteClick(e) {
        const num = this.state[`${e}InputNumber`]
        this.setState({
            [`${e}InputNumber`]: num - 1
        })
    }
    handleAddClick(e) {
        const num = this.state[`${e}InputNumber`]
        this.setState({
            [`${e}InputNumber`]: num + 1
        })
    }
    render() {
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">文书信息</div>
                <div className="yc-components-basicDetail_body">

                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'>查找情况：</span>
                        <Radio.Group value={1}>
                            <Radio value={1}>找到文书</Radio>
                            <Radio value={2}>未找到文书</Radio>
                        </Radio.Group>
                    </div>
                    <DocumentLinkInputs text={'相关文书案号'} num={this.state.documentInputNumber} handleDeleteClick={this.handleDeleteClick.bind(this, 'document')} handleAddClick={this.handleAddClick.bind(this, 'document')}></DocumentLinkInputs>
                    <DocumentLinkInputs text={'文书链接地址'} num={this.state.linkInputNumber} handleDeleteClick={this.handleDeleteClick.bind(this, 'link')} handleAddClick={this.handleAddClick.bind(this, 'link')}></DocumentLinkInputs>
                    <div className="yc-components-assetStructureDetail_body-row">
                        <span className='yc-components-assetStructureDetail_body-row_title'></span>
                        <span className='seeDetail'>
                            <Checkbox>详情见资产拍卖附件</Checkbox>
                        </span>
                    </div>
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
                            <DocumentLinkInput key={i} index={i} text={props.text} num={props.num} handleDeleteClick={props.handleDeleteClick} handleAddClick={props.handleAddClick}></DocumentLinkInput>
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
                <Input placeholder={`请输入${props.text}`} />
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