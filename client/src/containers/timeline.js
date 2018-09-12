import React from 'react';
import PropTypes from 'prop-types';
import { inject, observer } from 'mobx-react';
import InfiniteScroll from 'react-infinite-scroller';
import Status from '../components/status';


@inject('timelineStore')
@observer
export default class Timeline extends React.Component {
    static propTypes = {
        name: PropTypes.string,
        displayName: PropTypes.string,
        onSelect: PropTypes.func
    }

    loadMore = async () => {
        this.props.timelineStore.loadTimeline(this.props.name);
    }

    componentDidMount() {
        this.props.timelineStore.loadTimeline(this.props.name);
    }

    componentDidUpdate(prevProps) {
        if (this.props.name !== prevProps.name) {
            this.props.timelineStore.loadTimeline(this.props.name);
        }
    }

    onSelect = (name) => {
        const [type, val, val2] = this.props.name.split('/', 3);
        const date = type === 'date' ? val : type === 'user' && val2 ? val2 : null;
        if (date) {
            const [selectedType, selectedVal] = name.split('/', 2);
            if (selectedType === 'user') {
                const newName = `user/${selectedVal}/${date}`;
                return this.props.onSelect(newName);
            }
        }
        return this.props.onSelect(name);
    }

    render() {
        const timeline = this.props.timelineStore.getTimeline(this.props.name);


        let content;
        if (timeline.status.length === 0 && !timeline.isLoading) {
            content = <div>条件に該当するステータスはありませんでした。</div>
        }
        else {
            content = <div>{timeline.status.map(item => <Status status={item} key={item.uri} onSelect={this.onSelect} />)}</div>
        }

        return (
            <div className='timeline'>
                <div className='scrollable'>
                    <InfiniteScroll
                        loadMore={this.loadMore}
                        hasMore={timeline.cursor !== null}
                        loader={'Loading'}
                        useWindow={false}
                    >
                        {content}
                    </InfiniteScroll>
                </div>
            </div>
        )
    }
}