import React, { useState, useEffect } from 'react';
import { Anchor } from 'antd';
import 'antd/dist/antd.css';

const { Link } = Anchor;

const AnchorHtml = () => {
  const [targetOffset, setTargetOffset] = useState(undefined);
  useEffect(() => {
    setTargetOffset(window.innerHeight / 2);
  }, []);
  return (
    <Anchor targetOffset={targetOffset}
            showInkInFixed={true}
    >
      <Link href="#basic_usage" title="竞买公告" />
      <Link href="#static_position" title="标的物介绍" />
      <Link href="#book" title="竞价成功确认书" />
    </Anchor>
  );
};

export default AnchorHtml;
