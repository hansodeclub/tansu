import React from 'react';
import { Media } from './attachment';
import moment from 'moment';
import emojify from '../vendor/mastodon/emoji';

const Timestamp = ({ value }) => {
    const date = moment(value);
    return date.format('YYYY年MM月DD日 HH:mm:ss');
}

const customEmojis = (status) => {
    if (!status['emojis']) return {};
    console.log(status['emojis'].map(JSON.parse));
    return status['emojis'].map(JSON.parse);
}

const Status = ({ status, onSelect }) =>
    <article>
        <div className='status'>
            <div className='avatar-wrapper'>
                <img src={status['account.avatar']} alt='avatar' onError={(e) => { e.target.src = "/missing.png" }} />
            </div>
            <div className='content'>
                <div className='name'>
                    <span className='display_name'><a onClick={() => onSelect(`user/${status['account.acct']}`)}>{status['account.display_name']}</a></span>
                    <span className='acct'><a onClick={() => onSelect(`user/${status['account.acct']}`)}>@{status['account.acct']}</a></span>
                </div>
                <div className='body'>
                    <span dangerouslySetInnerHTML={{ __html: emojify(status['content'], customEmojis(status)) }} />
                </div>
                <div className='attachments'>
                    <Media attachments={status['media_attachments']} />
                </div>
                <div className='footer'>
                    <Timestamp value={status['created_at']} />
                </div>
            </div>
        </div>
    </article>


export default Status;