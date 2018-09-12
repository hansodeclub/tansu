import React from 'react';
import { inject, observer } from 'mobx-react';
import Sidebar from '../components/sidebar';
import Timeline from '../containers/timeline';

import { Column, ColumnHeader, ColumnContent } from '../components/column';


@inject('appStore')
@observer
export default class DatePage extends React.Component {
    constructor() {
        super();
        this.state = {
            timelines: []
        }
    }

    componentWillMount() {
        this.setState({
            timelines: ['date/' + this.props.match.params.date]
        })
    }

    componentDidUpdate(prevProps) {
        if (this.props.match.params.date !== prevProps.match.params.date) {
            this.setState({
                timelines: ['date/' + this.props.match.params.date]
            });
        }
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
                {this.state.timelines.map((name, idx) => <Column>
                    <ColumnHeader name={name} index={idx} onOpen={this.onOpen} />
                    <ColumnContent>
                        <Timeline name={name} onSelect={this.onSelect} />
                    </ColumnContent>
                </Column>)}
            </div>
        );
    }
}

