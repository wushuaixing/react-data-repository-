import React from "react";
import { Button, message } from "antd";

export default class Auction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  onClick = () => {
    const {
      history,
      href,
      api,
      check,
      toRefresh,
      approveStatus: s,
    } = this.props;
    let text = "服务繁忙，请稍后再试";
    if (s === 0) text = "该数据已被标注,请到已标记列表查看";
    if (s === 1) text = "该数据已被检查错误，请到待修改列表查看";
    if (s === 2) text = "该数据已被处理,请到已标记列表查看";
    if (check) {
      this.setState({ loading: true });
      api()
        .then(({ code, data }) => {
          this.setState({ loading: false }, () => {
            if (code === 200) {
              if (data === s) history.push(href);
              else message.warning(text, 1.5, toRefresh);
            }
          });
        })
        .catch(() => this.setState({ loading: false }));
    } else {
      history.push(href);
    }
  };

  render() {
    const { text } = this.props;
    const { loading } = this.state;
    return (
      <Button
        size="small"
        type="primary"
        ghost
        style={{ minWidth: 88, height: 28 }}
        loading={loading}
        onClick={this.onClick}
        className="btn-bgcolor-change"
      >
        {text}
      </Button>
    );
  }
}
