import React from 'react'
import { Button, Input, Radio, Checkbox } from 'antd'
// import { filters } from '@/utils/common'
import './index.scss'

class StructureDocumentDetail extends React.Component {
    static defaultProps = {
        handleDeleteClick: () => { },
        handleDocumentChange: () => { },
        handleAddClick: () => { }
    };
    handleChange = (e) => {
        if (e.target.type === 'checkbox') {
            this.props.handleChange(e.target.name, e.target.checked * 1)
        }
        else if (e.target.type === 'text') {
            this.props.handleDocumentChange(e.target.name, e.target.value)
        }
        else {
            this.props.handleChange(e.target.name, e.target.value)
        }
    };
    handleDeleteClick(i, attr) {
        this.props.handleDeleteClick(attr, i)
    }
    get documentInputNumber() {
        return this.props.ah.length;
    }
    get linkInputNumber() {
        return this.props.wsUrl.length;
    }
    get wsInAttach() {
        return Boolean(this.props.wsInAttach)
    }
    render() {
        const enable = this.props.enable;
        /* console.log(enable) */
        return (
            <div className="yc-components-assetStructureDetail">
                <div className="yc-components-assetStructureDetail_header">文书信息</div>
                <div className="yc-components-basicDetail_body">
                    {
                        enable ?
                            <div className="yc-components-assetStructureDetail_body-row">
                                <span className='yc-components-assetStructureDetail_body-row_title documentDetail_row'>查找情况：</span>
                                <span>{parseInt(this.props.wsFindStatus) === 1 ? '找到文书' : '未找到文书'}</span>
                            </div> :
                            <div className="yc-components-assetStructureDetail_body-row">
                                <span className='yc-components-assetStructureDetail_body-row_title documentDetail_row'>查找情况：</span>
                                <Radio.Group value={this.props.wsFindStatus} name="wsFindStatus" onChange={this.handleChange} disabled={enable}>
                                    <Radio value={1}>找到文书</Radio>
                                    <Radio value={0}>未找到文书</Radio>
                                </Radio.Group>
                            </div>
                    }
                    {
                        this.props.wsFindStatus === 1 ?
                            <React.Fragment>
                                <DocumentLinkInputs
                                    values={this.props.ah}
                                    enable={enable}
                                    attr={'ah'}
                                    text={'相关文书案号'}
                                    num={this.documentInputNumber}
                                    handleChange={this.handleChange}
                                    handleDeleteClick={this.handleDeleteClick.bind(this)}
                                    handleAddClick={this.props.handleAddClick.bind(this, 'ah')}>
                                </DocumentLinkInputs>
                                <DocumentLinkInputs
                                    enable={enable}
                                    values={this.props.wsUrl}
                                    attr={'wsUrl'}
                                    text={'文书链接地址'}
                                    num={this.linkInputNumber}
                                    handleChange={this.handleChange}
                                    handleDeleteClick={this.handleDeleteClick.bind(this)}
                                    handleAddClick={this.props.handleAddClick.bind(this, 'wsUrl')}>
                                </DocumentLinkInputs>
                                <div className="yc-components-assetStructureDetail_body-row">
                                    <span className='yc-components-assetStructureDetail_body-row_title'/>
                                    {
                                        enable ?
                                            <span className='seeDetail'>
                                                {this.wsInAttach?'详情见资产拍卖附件':''}
                                            </span> :
                                            <span className='seeDetail'>
                                                <Checkbox name="wsInAttach" onChange={this.handleChange} checked={this.wsInAttach} disabled={enable}>详情见资产拍卖附件</Checkbox>
                                            </span>
                                    }
                                </div>
                            </React.Fragment> : null
                    }
                </div>
            </div>
        )
    }
}
const DocumentLinkInputs = (props) => {
		const arr = [];
		for (let i = 0; i < props.num; i++) {
				arr.push(
						<DocumentLinkInput attr={props.attr} value={props.values[i]} enable={props.enable}
								key={i} index={i} text={props.text} num={props.num} handleChange={props.handleChange}
								handleDeleteClick={props.handleDeleteClick.bind(this, i, props.attr)} handleAddClick={props.handleAddClick}
						/>
				)
		}
		return arr;
};

// eslint-disable-next-line react/jsx-no-target-blank
const linkSpan = val=> val ? <a href={val} rel="noopener norefferrer" target="_blank" style={{ textDecoration: 'underline' }}>{val}</a> : '-';

const DocumentLinkInput = (props) => {
    //console.log(props)
    return (
        <div className="yc-components-assetStructureDetail_body-row">
            {
                props.index === 0 ?
                    <span className='yc-components-assetStructureDetail_body-row_title'>{`${props.text}：`}</span> :
                    null
            }
            <span className={props.index !== 0 ? 'addition-ah' : null}>
                {
                    props.enable ? (props.attr==='wsUrl'?linkSpan(props.value.value):props.value.value)
                        : <Input
                            maxLength={ props.attr==='wsUrl'?99999:50 }
                            placeholder={`请输入${props.text}`}
                            onChange={props.handleChange}
                            name={`${props.attr}${props.index}`}
                            value={props.value.value}
                      />
                }
                {
                    props.num < 3 && !props.enable ?
                        <Button type="primary" shape="circle" size="small" icon="plus" onClick={props.handleAddClick}/> :
                        null
                }
                {
                    props.num > 1 && !props.enable ?
                        <Button type="default" shape="circle" size="small" icon="minus" onClick={props.handleDeleteClick}/> :
                        null
                }
            </span>
        </div>
    )
};
export default StructureDocumentDetail
