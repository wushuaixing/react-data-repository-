import React from 'react';
import { BreadCrumb } from '@commonComponents'
import StructureBasicDetail from '@/components/assetStructureDetail/basicDetail'
import StructureButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import StructurePropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import StructureDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import WrongDetail from '@/components/assetStructureDetail/wrongDetail'
import './index.scss'
class StructureDetail extends React.Component {
    handleClick(a) {
        console.log(a)
    }
    render() {
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb texts={['资产结构化/详情']} note={`1/50`} buttonText={'返回上一条'} icon={'left'}></BreadCrumb>
                <div className="assetStructureDetail-structure_container">
                    <div className="assetStructureDetail-structure_container_header">
                        {/* 传入不同prop 显示不同的基本信息样式 当点击链接需要一个回调函数内写路由跳转逻辑 */}
                        <WrongDetail wrongReasons = {['文书链接遗漏', '债权人遗漏']}></WrongDetail>
                        {/* 传入不同status 显示不同的button样式 返回对应参数值 根据参数值在handleClick里 去请求不同接口 */}
                        <StructureButtonGroup status={1} handleClick={this.handleClick}></StructureButtonGroup>
                    </div>
                    <div className="assetStructureDetail-structure_container_body">
                        <StructureBasicDetail></StructureBasicDetail>
                        <StructurePropertyDetail></StructurePropertyDetail>
                        <StructureDocumentDetail></StructureDocumentDetail>
                        <RoleDetail></RoleDetail>
                    </div>
                </div>
            </div>
        )
    }
}

export default StructureDetail;