import React from 'react';
import { inject, observer } from 'mobx-react';
import Sidebar from '../components/sidebar';
import { Column, ColumnHeader, ColumnContent } from '../components/column';
import Timeline from '../containers/timeline';

/*
const statusParser = (statuses) => {
    return statuses.map((status) => {
        return Object.assign(status, {
            created_at: status['created_at'],
            media_attachments: status['media_attachments'] || []
        })
    });
}*/


@inject('appStore')
@observer
export default class Home extends React.Component {
    constructor() {
        super();
        this.state = {
            timelines: ['local']
        }
    }
    componentDidMount() {
    }

    onSelect = (name) => {
        const timelines = [this.state.timelines[0], name]
        this.setState({ timelines });
    }

    onOpen = (name) => {
        this.props.history.push('/' + name);
    }

    render() {
        return (
            <div className='container'>
                <Sidebar history={this.props.history} />
                {this.state.timelines.map((name, idx) =>
                    <Column>
                        <ColumnHeader name={name} index={idx} onOpen={this.onOpen} />
                        <ColumnContent>
                            <Timeline name={name} onSelect={this.onSelect} />
                        </ColumnContent>
                    </Column>)}
            </div>
        );
    }
}
