import React from "react";
import { Modal, Button } from "antd";
import { Title_TYPE } from "../type";

class MsgsInfoModal extends React.Component {
  static defaultProps = {
    msgsInfo: {},
    enble: true,
    visible: false,
  };

  handleClose = () => {
    this.props.handleCloseModal("msgsModalVisible");
  };

  render() {
    const {
      visible,
      msgsInfo: {
        collateralName,
        category,
        landArea,
        buildingArea,
        useType,
        hasSeizure,
        hasLease,
        seizureSequence,
        mortgageSequence,
        note,
      },
    } = this.props;
    const msgsList = [
      collateralName,
      category,
      landArea,
      buildingArea,
      useType,
      hasSeizure,
      hasLease,
      seizureSequence,
      mortgageSequence,
      "-",
      "10000",
      "2000000",
      note,
    ];
    const footer = (
      <div className="footer">
        <Button onMouseDown={this.handleClose}>关闭</Button>
      </div>
    );
    return (
      <Modal
        title="抵押物信息"
        visible={visible}
        destroyOnClose={true}
        footer={footer}
        maskClosable
        width={658}
        className="debt-modal-container"
        onCancel={this.handleClose}
      >
        <div className="msgs-info-modal">
          {msgsList.map((item, index) => (
            <Item title={Title_TYPE[index]} content={item} key={index} />
          ))}
        </div>
      </Modal>
    );
  }
}

const Item = (props) => (
  <li key={props.key}>
    <div>{props.title}：</div>
    <div>{props.content ? props.content : "-"}</div>
  </li>
);

export default MsgsInfoModal;
