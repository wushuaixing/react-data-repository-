import React from 'react'
import AdminBasicDetail from '@/components/assetStructureDetail/basicDetail'
import AdminButtonGroup from '@/components/assetStructureDetail/buttonGroup'
import AdminPropertyDetail from '@/components/assetStructureDetail/propertyDetail'
import AdminDocumentDetail from '@/components/assetStructureDetail/documentDetail'
import AdminWrongDetail from '@/components/assetStructureDetail/wrongDetail'
import ReturnRemark from '@/components/assetStructureDetail/returnRemark'
import RoleDetail from '@/components/assetStructureDetail/roleDetail'
import { BreadCrumb } from '@commonComponents'

export default class AdminStructure extends React.Component{
    componentDidMount(){
        const { id, status } = this.props.match.params
    }
    render(){
        const moduleOrder = []
        return (
            <div className="yc-content-container assetStructureDetail-structure">
                <BreadCrumb
                    texts={['资产结构化 /详情']}></BreadCrumb>
                
            </div>
        )
    }
}