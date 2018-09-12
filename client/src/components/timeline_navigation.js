import React from 'react';

const TimelineNavigation = ({ name, onClick }) => {
    return (<a onClick={onClick}>
        <i className='material-icons icon'>open_in_new</i></a>
    )
}

export default TimelineNavigation;