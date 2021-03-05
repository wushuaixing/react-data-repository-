import React, { Component } from "react";
import { message, AutoComplete, Input } from "antd";
import { getAutoPrompt } from "@/server/api";
/**
 * 债权结构化-自动联想组件
 */
class AutoCompleteInput extends Component {
  constructor() {
    super();
    this.state = {
      prompstList: [], //所有姓名输入框 提示语的集合
      isBlur: "",
      isChinese: "",
      //输入法是否为中文
    };
  }

  static defaultProps = {
    role: "",
    nameVal: "",
    width: 0,
    index: 0,
    indexs: 0,
    handleChange: () => {},
  };

  handChange = (e, key, index, isBlur, indexs) => {
    const { value } = e.target;
    const { role } = this.props;
    this.setState({
      isBlur,
    });
    const flags = isBlur === "onBlur";
    const params = flags
      ? (value || "").trim().replace(/[(]/g, "（").replace(/[)]/g, "）")
      : value || "";
    role === "guarantors"
      ? this.props.handleChange(e, key, index, indexs, flags)
      : this.props.handleChange(e, key, index, flags);
    this.state.isChinese !== "Chinese" && this.getAutoPrompt(params, index); //输入框值发生改变时发送请求
  };

  getAutoPrompt(params) {
    const list = ["银行", "信用社", "信用联社", "合作联社", "合作社"];
    const flag = list.some((item) => params.includes(item)); //名称中不包括“银行、信用社、信用联社、合作联社、合作社
    let filterparam = params
      .replace(/<span style='color:red'>/g, "")
      .replace(/<\/span>/g, "")
      .trim();
    let regex = /[`~!，@#$%^*+=<>?:"{}|/;'\\[\]·~！、@#￥%……*——+={}|《》？：“”【】；‘’。]/g;
    let rules = regex.test(filterparam);
    if (filterparam.length > 3 && !flag && !rules) {
      let param = filterparam.replace(/&/g, "%26");

      getAutoPrompt(param).then((res) => {
        if (res.data.code === (200 || 400)) {
          let data = res.data.data || [];
          if (data.length > 0) {
            this.setState({
              prompstList: data,
            });
          } else {
            this.setState({
              prompstList: [],
            });
          }
        } else {
          message.error(res.data.message);
        }
      });
    } else {
      this.setState({
        prompstList: [],
      });
    }
  }

  judgeChinese = (e) => {
    if (e.type === "compositionstart") {
      this.setState({
        isChinese: "Chinese",
      });
    }
    if (e.type === "compositionend") {
      let val = e.target.value;
      this.setState(
        {
          isChinese: "English",
        },
        () => {
          this.getAutoPrompt(val);
        }
      );
    }
  };

  render() {
    const { nameVal, index, indexs, width } = this.props;
    const { prompstList, isBlur, isChinese } = this.state;
    const isHaveData =
      prompstList.length === 0 &&
      nameVal.trim().length > 3 &&
      isChinese !== "Chinese";
    const options = (prompstList || []).map((item) => {
      let value = item
        .replace(/<span style='color:red'>/g, "")
        .replace(/<\/span>/g, ""); //onselect的默认参数结果就是Option的key值
      return (
        <AutoComplete.Option key={value} text={value}>
          <div dangerouslySetInnerHTML={{ __html: item }}></div>
        </AutoComplete.Option>
      );
    });

    return (
      <div className="auto_complete_content">
        <AutoComplete
          dataSource={options} //显示的5条自动提示
          value={nameVal} //默认值
          defaultActiveFirstOption={false} //是否默认高亮第一个选项
          placeholder="请输入名称"
          onChange={(value) =>
            this.handChange(
              { target: { value } },
              "name",
              index,
              "onChange",
              indexs
            )
          }
          onBlur={(value) =>
            this.handChange(
              { target: { value } },
              "name",
              index,
              "onBlur",
              indexs
            )
          }
          className={
            isHaveData && isBlur === "onBlur"
              ? "atuo_complete_nodata"
              : "atuo_complete"
          } // 未匹配到对应的工商信息时边框为黄色
          optionLabelProp="text" //回填到选择框的 Option 的属性值，默认是 Option 的子元素
          style={{ height: 32, width: width }}
        >
          <Input
            onCompositionStart={this.judgeChinese} //使用拼音输入法开始输入汉字时，这个事件就会被触发
            onCompositionEnd={this.judgeChinese} //拼音输入法输入汉字 按下空格键时 触发
            autoComplete="off"
            maxLength={120}
          />
        </AutoComplete>

        {isHaveData && isBlur === "onBlur" ? (
          <p className="auto_complete_nodata">未匹配到对应的工商信息</p>
        ) : null}
        {isHaveData && isBlur === "onChange" ? (
          <div className="auto_complete_nodatas">未匹配到对应的工商信息</div>
        ) : null}
      </div>
    );
  }
}

export default AutoCompleteInput;
