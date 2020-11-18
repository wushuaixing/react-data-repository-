import React from "react";
import { Modal, Button, Input } from "antd";
const { TextArea } = Input;

class BatchAddModal extends React.Component {
  constructor() {
    super();
    this.state = {
      text: "",
    };
  }
  
  handleCancel = () => {
    this.props.handleCloseModal("batchAddModalVisible");
    this.setState({
      text: "",
    });
  };

  handleSubmit = (text) => {
    this.props.handleSubmit(text);
    this.setState({
      text: "",
    });
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({
      text: value,
    });
  };

  render() {
    const { visible } = this.props;
    const { text } = this.state;
    const textLength = text.length;
    const footer = (
      <div className="debt-modal-footer">
        <Button onClick={this.handleCancel}>取消</Button>
        <Button type="primary" onClick={() => this.handleSubmit(text)}>
          确定
        </Button>
      </div>
    );
    return (
      <div className="batch-modal-container">
        <Modal
          title="批量添加"
          visible={visible}
          destroyOnClose={true}
          footer={footer}
          maskClosable
          width={858}
          className="batch-modal"
          closable={false}
        >
          <div style={{ position: "relative", color: "#293038" }}>
            <p>请批量输入保证人，并以顿号隔开</p>
            <TextArea
              maxLength={1000}
              style={{ height: 320 }}
              value={text}
              onChange={this.handleChange}
            />
            <span
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                color: "#B2B8C9",
              }}
            >{`${textLength}/1000`}</span>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BatchAddModal;
