/** right content for Account manage* */
import React from 'react';
import {withRouter} from "react-router-dom";
import CheckboxGroup from "antd/es/checkbox/Group";
import {Input, Radio, Checkbox, Button, Form, Modal} from 'antd'
import {REASON_LIST, WRONG_TYPE_LIST} from "@/static/status";
import NoticeImg from '@/assets/img/confirm_notice.png';
import ModalCloseImg from '@/assets/img/close.png';
import './style.scss';

const checkForm = Form.create;

class Check extends React.Component {
    modalOk = () => {
        const options = this.props.form.getFieldsValue();
        this.props.handleModalSubmit(options);
    };

    modalCancel = () => {
        this.props.handleModalCancel();
    };

    addRemark(text, flag) {
        const val = this.props.form.getFieldValue('remark') ? this.props.form.getFieldValue('remark') : '';
        this.props.form.setFieldsValue({
            remark: flag ? `${val}${text},` : `${val}${text}:\n`
        });
    };

    onChangeLocation = (e) => {
        e.target.checked && this.addRemark(e.target.value, true)
    }

    //待标记--》详情页
    render() {
        let {wrongReasons} = this.props;
        const {getFieldDecorator} = this.props.form;
        const status = this.props.match.params.status || this.props.status;
        wrongReasons = (wrongReasons && wrongReasons instanceof Array && wrongReasons.length > 0) ? wrongReasons[wrongReasons.length - 1] : {};
        const isShowWrongRemark = wrongReasons.remark && parseInt(status) === 4;
        return (
            <div>
                <Modal
                    width={394}
                    className="checkError-modal"
                    visible={this.props.visible}
                    closable={true}
                    footer={null}
                    title={<span><img src={NoticeImg} alt=''/> 确认本条结构化数据标注结果有误吗？</span>}
                    maskClosable
                    onCancel={this.modalCancel}
                    closeIcon={<span><img src={ModalCloseImg} alt=""/></span>}
                >
                    <div className="check-modal">
                        <div className="part">
                            点击确定，本条结构化数据将被标记为检查错误，并将退回给结构化人员
                        </div>
                        <Form style={{width: 354}}>
                            <Form.Item className="remark" label="备注">
                                {getFieldDecorator('remark', {
                                    initialValue: `${(isShowWrongRemark) ? wrongReasons.remark.join('\n') : ''}`
                                })(
                                    <Input.TextArea
                                        style={{width: 500, height: 240}}
                                        placeholder="请填写备注"
                                    />
                                )}
                            </Form.Item>
                            <Form.Item className="wrongLevel" label="错误等级" style={{fontSize: 12}}>
                                {getFieldDecorator('wrongLevel', {
                                    initialValue: wrongReasons.wrongLevel && isShowWrongRemark ? wrongReasons.wrongLevel : 0,
                                })(
                                    <Radio.Group initialValue={0} size='small'>
                                        <Radio value={0}>
                                            <span>不计入错误</span>
                                        </Radio>
                                        <Radio value={1} className="second-radio">
                                            <span>普通错误</span>
                                        </Radio>
                                        <Radio value={2}>
                                            <span>严重错误</span>
                                        </Radio>
                                    </Radio.Group>
                                )}
                            </Form.Item>
                            <Form.Item className="wrongTypes" label="出错位置">
                                {getFieldDecorator('wrongTypes', {
                                    initialValue: wrongReasons.auctionExtractWrongTypes && isShowWrongRemark ? wrongReasons.auctionExtractWrongTypes : [],
                                })(
                                    <CheckboxGroup onChange={this.onChangeReason}>
                                        {REASON_LIST && REASON_LIST.map((item) => {
                                            return (
                                                <Checkbox value={item.value}
                                                          key={item.label}
                                                          onChange={this.onChangeLocation}
                                                >
                                                    <span>{item.value}</span>
                                                </Checkbox>
                                            )
                                        })
                                        }
                                    </CheckboxGroup>
                                )}
                            </Form.Item>
                            <div className="err-type">
                                <p className="part-title">错误原因</p>
                                <div className="part-error-detail">
                                    {
                                        WRONG_TYPE_LIST.map((item, index) => {
                                            return <div key={index}
                                                        className="part-error-content"
                                                        onClick={() => this.addRemark(item)}>{item}</div>
                                        })
                                    }
                                </div>
                            </div>
                            <div className="footer">
                                <Button type="primary" onClick={this.modalOk}>确定</Button>
                                <Button onClick={this.modalCancel}>取消</Button>
                            </div>
                        </Form>
                    </div>
                </Modal>
            </div>
        );
    }
}

export default withRouter(checkForm()(Check));

