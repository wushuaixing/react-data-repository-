import React, { Component } from 'react';
import {message,AutoComplete,Input} from 'antd';
import {getAutoPrompt} from '../../../server/api';
const  prompstList=[];
const  paramsLengthList=[];
class autoCompleteInput extends Component {
    constructor(){
        super();
        this.state={
            prompstList:[],//所有姓名输入框 提示语的集合
            paramsLengthList:[],//所有姓名输入框  输入内容的集合
            isBlur:'',
            isChinese:'',
            //输入法是否为中文
        }
    }
    handChange(...rest){     
        const combine=rest[0]||'';   
        const isBlur=rest[1]
        this.setState({
            isBlur
        })
        const params=rest[2]||''.trim();
        this.props.handleNameChange(combine,params);
        const arr_index=combine.substr(combine.length - 1, 1);//索引
        this.state.isChinese!=="Chinese"&&this.getAutoPrompt(params,arr_index) //输入框值发生改变时发送请求
    }
    getAutoPrompt(params,index){
        const list = ['银行', '信用社', '信用联社', '合作联社', '合作社','-','_','.','!','~','*','’','(',')','%','@',"#","$","^","&","+",'=','|','{','}','\\','/'];   
        const flag = list.some(item => params.includes(item));//名称中不包括“银行、信用社、信用联社、合作联社、合作社
        let param=params.replace(/<span style='color:red'>/g,'').replace(/<\/span>/g,'').trim()
        if (param.length > 3 && !flag) {   //角色名称大于等于四个字
           getAutoPrompt(param).then(res => {
                if (res.data.code ===(200||400)) {
                    let data = res.data.data||[];
                    if (data.length>0) {        
                        prompstList[index]=data;        //字段长度大于3且有数据时   未匹配到对应的工商信信息不显示  显示5条提示语   
                        paramsLengthList[index]=''   
                    } else {
                       prompstList[index]=[];
                       paramsLengthList[index]=param //字段长度大于3但无数据时   未匹配到对应的工商信信息显示
                    }
                    this.setState({
                        prompstList,
                        paramsLengthList
                    })
                }else{
                    message.error(res.data.message);
                }
            })
        }else{                                           //字段长度小于3时   提示语  和 未匹配到对应的工商信信息  均不显示  
            prompstList[index]=[];
            paramsLengthList[index]=''
            this.setState({
                prompstList,
                paramsLengthList,
            }) 
        }
    }
    judgeChinese=(e)=>{
        if(e.type==='compositionstart'){
            this.setState({
                isChinese:'Chinese'
            })
        }
        if(e.type==='compositionend'){
            let val=e.target.value;
            let index=e.target.name;
            this.setState({
                isChinese:'English'
            },()=>{
                this.getAutoPrompt(val,index)
            })
        }
    }
    getDeletedData(index){                   
        prompstList.splice(index,1);  
        paramsLengthList.splice(index,1)  //删除角色信息行时 
       this.setState({
           prompstList,
           paramsLengthList
       })
    }
    handFocus(...rest){
       this.getAutoPrompt(rest[0],rest[1])
    }
    componentDidMount(){ 
        const {obligor,index}=this.props;
        this.getAutoPrompt(obligor.name,index); //props发生改变时拿到index和name值发送请求 
        this.props.onRef(this);
     }
     componentWillUnmount(){
        this.setState=()=>false   //不能在组件销毁后设置state，防止出现内存泄漏  (防抖设置定时器)
    }
    render() {
        const {prompstList,paramsLengthList,isBlur}=this.state;
        const {obligor,disabled,index}=this.props;
        const obligors={...obligor};
        const options=(prompstList[index]||[]).map((item)=>{
            let value=item.replace(/<span style='color:red'>/g,'').replace(/<\/span>/g,'');//onselect的默认参数结果就是Option的key值
            return (
            <AutoComplete.Option key={value} text={value}>
               <div dangerouslySetInnerHTML={{ __html:item}}></div>  
            </AutoComplete.Option>)   
        })

        return (
            <div className="auto_complete_content">
                <AutoComplete
                    dataSource={options} //显示的5条自动提示
                    value={obligors.name}//默认值
                    disabled={disabled}
                    defaultActiveFirstOption={false}//是否默认高亮第一个选项
                    placeholder="请输入名称"
                    onChange={this.handChange.bind(this,`name${index}`,'onChange')}
                    onBlur={this.handChange.bind(this,`name${index}`,'onBlur')}
                    className={paramsLengthList[index]&&isBlur==='onBlur'?'atuo_complete_nodata':'atuo_complete'}// 未匹配到对应的工商信息时边框为黄色
                    optionLabelProp='text'     //回填到选择框的 Option 的属性值，默认是 Option 的子元素
                    onFocus={this.handFocus.bind(this,obligors.name,index)}
                >
                    <Input 
                        onCompositionStart={this.judgeChinese} //使用拼音输入法开始输入汉字时，这个事件就会被触发
                        onCompositionEnd={this.judgeChinese}   //拼音输入法输入汉字 按下空格键时 触发
                        name={index}
                        autoComplete='off'
                    />
                </AutoComplete>

                {
                    paramsLengthList[index]&&isBlur==='onBlur'?<p className="auto_complete_nodata">未匹配到对应的工商信息</p>:null
                }
                {
                    paramsLengthList[index]&&isBlur==='onChange'?<div className="auto_complete_nodatas">未匹配到对应的工商信息</div>:null
                }
            </div>
        )
    }
}
export default autoCompleteInput;