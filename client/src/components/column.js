import React from 'react';
import moment from 'moment';
import TimelineNavigation from './timeline_navigation';

export const Column = ({ children }) =>
    <div className='column'>
        {children}
    </div>

export const ColumnHeader = ({ name, index, onOpen }) => {
    const [type, val, val2] = name.split('/', 3);
    console.log(type, val, val2);
    let icon;
    let message;
    if (type === 'local') {
        icon = 'group';
        message = 'ローカルタイムライン';
    } else if (type === 'user') {
        icon = 'person';
        message = `@${val}`;
        if (val2) {
            const date = moment(val2, 'YYYYMMDD');
            message += ` (${date.format('YYYY年MM月DD日')})`;
        }
    } else if (type === 'date') {
        icon = 'access_time';
        const date = moment(val, 'YYYYMMDD')
        message = date.format('YYYY年MM月DD日');
    } else {
        icon = 'bug_report';
        message = 'UNKNOWN'
    }

    let sideButton = null;
    if (index > 0) {
        sideButton = <TimelineNavigation name={name} onClick={() => onOpen(name)} />
    }


    return (<div className='column-header'>
        <div class='wrapper'>
            <div class='column-title'>
                <i className="material-icons icon">{icon}</i> {message}</div>
            <div class='right-menu'>{sideButton}</div>
        </div>
    </div>);
}

export const ColumnContent = ({ children }) => {
    return children;
}