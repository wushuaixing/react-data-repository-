import React from "react";
import { Modal, Button } from "antd";
import { HAS_TYPE, TITLES_TYPE } from "../type";
/**
 * 系统提取信息 抵押物信息-查看详情弹窗
 */
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
        hasLease,
        hasSeizure,
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
      HAS_TYPE[hasLease],
      HAS_TYPE[hasSeizure],
      seizureSequence,
      mortgageSequence,
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
            <Item
              title={TITLES_TYPE[index]}
              content={item}
              key={`msgsInfo${index}`}
              indexs={index}
            />
          ))}
        </div>
      </Modal>
    );
  }
}

const Item = (props) => {
  const { indexs, title, content } = props;
  const unit = () => {
    if (indexs === 2 || indexs === 3) {
      return (
        <span>
          m<sup>2</sup>
        </span>
      );
    } else {
      return "";
    }
  };
  return (
    <li>
      <div>{title}：</div>
      <div>
        {content ? content : "-"}
        {content ? unit() : ""}
      </div>
    </li>
  );
};

export default MsgsInfoModal;
