import React from 'react'
import { WRONG_LEVEL } from '@/static/status'
import '../index.scss';
import './index.scss';

const Item = props =>{
  const { title, content, noTitle } = props;
  return (
    <div className="yc-wrong-item" >
      <div className="yc-wrong-item_title" style={noTitle?{ opacity:0 }:{}}>{title}</div>
      <div className="yc-wrong-item_content danger-info">{content}</div>
    </div>
  )
};

const wrongDetailCom = (props) => {
  let wrongData = (props.wrongData && props.wrongData.length > 0) ? props.wrongData : [];
  const role = (localStorage.getItem('userState') === '管理员' || props.role === 'admin') ? 'admin' : 'no';
  return wrongData.length ? (
    <div className="yc-components-assetStructureDetail">
      <div className="yc-components-assetStructureDetail_header">错误原因</div>
      {
        wrongData.map((item, index) => {
          return (
            <div key={index}>
              { role === 'admin' && <Item title={`${item.date} ${item.name}检查　`} content={'有误'} /> }
              <Item title="错误等级：" content={WRONG_LEVEL[item.wrongLevel]} />
              {
                item.remark && item.remark.length > 0
                  ? item.remark.map((itemText, index)=> <Item title="错误详情：" noTitle={index!==0} content={itemText} />)
                  : <Item title="错误详情：" content="-" />
              }
            </div>
          )
        })
      }
    </div>
  ) :  <div className="yc-components-assetStructureDetail" />;
};

export default wrongDetailCom
