import React, { Component } from 'react';
import {message,AutoComplete} from 'antd';
import {getAutoPrompt} from '../../../server/api';

class autoCompleteInput extends Component {
    constructor(){
        super();
        this.state={
            prompstList:[],//所有姓名输入框 提示语的集合
            paramsLengthList:[]//所有姓名输入框  输入内容的集合
        }
        this.handChange = this.deBounce(this.handChange, 500)
    }
    deBounce(fn, ms) {
        let timeoutId
        return function () {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(() => {
                fn.apply(this, arguments)
            }, ms)
        }
    }
    handChange(...rest){
        const combine=rest[0]||'';      
        const params=rest[1].trim()||''; 
        this.props.handleNameChange(combine,params);
        const arr_index=combine.substr(combine.length - 1, 1);//索引
        this.getAutoPrompt(params,arr_index) //输入框值发生改变时发送请求
    }
    getAutoPrompt(params,index){
        const list = ['银行', '信用社', '信用联社', '合作联社', '合作社'];
        const flag = list.some(item => params.includes(item));//名称中不包括“银行、信用社、信用联社、合作联社、合作社
        let prompstList=this.state.prompstList;
        let paramsLengthList=this.state.paramsLengthList;
        if (params.length > 3 && !flag) {   //角色名称大于等于四个字
            getAutoPrompt(params).then(res => {
                if (res.data.code === 200) {
                    let data = res.data.data||[];
                    if (data.length>0) {        
                        prompstList[index]=data;        //字段长度大于3且有数据时   未匹配到对应的工商信信息不显示  显示5条提示语   
                        paramsLengthList[index]=''   
                    } else {
                       prompstList[index]=[];
                       paramsLengthList[index]=params //字段长度大于3但无数据时   未匹配到对应的工商信信息显示
                    }
                    this.setState({
                        prompstList,
                        paramsLengthList
                    })
                } else {
                    message.error(res.data.message);
                }
            })
        }else{                                           //字段长度小于3时   提示语  和 未匹配到对应的工商信信息  均不显示  
            prompstList[index]=[];
            paramsLengthList[index]=''
            this.setState({
                nameList:prompstList,
                paramsLengthList:paramsLengthList
            })
        }
    }
    componentWillReceiveProps(){ 
        const {obligor,index}=this.props;
        this.getAutoPrompt(obligor.name,index); //props发生改变时拿到index和name值发送请求 
     }
     componentWillUnmount(){
         this.setState=()=>false   //不能在组件销毁后设置state，防止出现内存泄漏  (防抖设置定时器)
     }
    render() {
        const {prompstList,paramsLengthList}=this.state;
        const {obligor,disabled,index}=this.props;
        return (
            <div className="auto_complete_content">
                <AutoComplete
                    dataSource={prompstList[index]} //显示的5条自动提示
                    defaultValue={obligor.name}//默认值
                    disabled={disabled}
                    defaultActiveFirstOption={false}//是否默认高亮第一个选项
                    placeholder="请输入名称"
                    onChange={this.handChange.bind(this,`name${index}`)}
                    onBlur={this.handChange.bind(this,`name${index}`)}
                    className={!paramsLengthList[index]?'atuo_complete':'atuo_complete_nodata'}// 未匹配到对应的工商信息时边框为黄色
                />
                <p className="auto_complete_nodata">{!paramsLengthList[index]?'':'未匹配到对应的工商信息'}</p>  
            </div>
        )
    }
}
export default autoCompleteInput;