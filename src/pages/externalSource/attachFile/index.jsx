import React from 'react';
import icon from '@/assets/img/download.png'
import './style.scss'


export default class AttachFile extends React.Component{

    render(){
        return (
            <div className="externalSource-attachFile_container">
                <div className="externalSource-attachFile_container_body">
                    <div className="header">
                        <div className="header_title">
                            <span>015天波城别墅司法报告</span>
                            <img src={icon} className="downloadIcon"/>
                        </div>
                    </div>
                </div>
                <div className="externalSource-attachFile_container_right">

                </div>
            </div>
        )
    }
}