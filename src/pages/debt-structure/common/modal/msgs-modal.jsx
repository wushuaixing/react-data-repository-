import React from "react";
import { Modal, Button } from "antd";
import { HAS_TYPE, USE_TYPE } from "../type";
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
      {
        lable: "名称",
        value: collateralName,
        unit: "normal",
      },
      {
        lable: "类别",
        value: category,
        unit: "normal",
      },
      {
        lable: "土地面积",
        value: landArea,
        unit: "area",
      },
      {
        lable: "建筑面积",
        value: buildingArea,
        unit: "area",
      },
      {
        lable: "房地用途",
        value: USE_TYPE[useType],
        unit: "normal",
      },
      {
        lable: "有无租赁",
        value: HAS_TYPE[hasLease],
        unit: "normal",
      },
      {
        lable: "有无查封",
        value: HAS_TYPE[hasSeizure],
        unit: "normal",
      },

      {
        lable: "查封顺位",
        value: seizureSequence,
        unit: "normal",
      },
      {
        lable: "抵押顺位",
        value: mortgageSequence,
        unit: "normal",
      },
      {
        lable: "备注",
        value: note,
        unit: "normal",
      },
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
          {msgsList.map((item) => (
            <Item
              title={item.lable}
              content={item.value}
              key={item.lable}
              units={item.unit}
            />
          ))}
        </div>
      </Modal>
    );
  }
}

const Item = (props) => {
  const { title, content, units } = props;
  const unit = () => {
    if (units === "area") {
      return (
        <span>
          m<sup>2</sup>
        </span>
      );
    } else {
      return "";
    }
  };
  const text = (text) => {
    if (units === "area") {
      return parseInt(text).toFixed(2);
    } else {
      return text;
    }
  };
  return (
    <li>
      <div>{title}：</div>
      <div>
        {content ? text(content) : "-"}
        {content ? unit() : ""}
      </div>
    </li>
  );
};

export default MsgsInfoModal;
