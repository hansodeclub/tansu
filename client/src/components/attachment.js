import React from 'react';

export class Media extends React.Component {
    filterImage(attachments) {
        return attachments.filter((attachment) => attachment['type'] === 'image');
    }

    render() {
        const { attachments } = this.props;
        if (!attachments) return null;

        const images = this.filterImage(attachments.map(JSON.parse));

        return (
            <div>
                {images.map(attachment => {
                    const displayUrl = attachment['remote_url'] || attachment['url'];
                    return (
                        <div key={attachment.id}>
                            <a href={displayUrl} target='_blank' rel='noopener'>
                                <img src={attachment.preview_url} alt='Click and show full size' />
                            </a>
                        </div>
                    );
                })}
            </div>
        );
    }
}