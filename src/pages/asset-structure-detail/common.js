import React from 'react';
export const Item = props => (props.hide ? null : (
    <li>
        <div className="list_title">{props.title}</div>
        <div className={props.color==='danger'?'danger-error':null}>{props.content||props.children}</div>
    </li>
));
