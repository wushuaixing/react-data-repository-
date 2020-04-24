import React from 'react'
import { Button, Input, Radio, Checkbox } from 'antd'
import './index.scss'

const StructureDocumentDetail = () => {
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
                <div className="yc-components-assetStructureDetail_body-row">
                    <span className='yc-components-assetStructureDetail_body-row_title'>相关文书案号：</span>
                    <span >
                        <Input placeholder="请输入相关文书案号" />
                        <Button type="primary" shape="circle" size="small" icon="plus"></Button>
                    </span>
                </div>
                <div className="yc-components-assetStructureDetail_body-row">
                    <span className='yc-components-assetStructureDetail_body-row_title'>文书链接地址：</span>
                    <span >
                        <Input placeholder="请输入文书链接地址" />
                        <Button type="primary" shape="circle" size="small" icon="plus"></Button>
                    </span>
                </div>
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

export default StructureDocumentDetail