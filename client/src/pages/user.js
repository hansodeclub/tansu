
import React from 'react';
import { inject, observer } from 'mobx-react';
import Sidebar from '../components/sidebar';
import Timeline from '../containers/timeline';

import { Column, ColumnHeader, ColumnContent } from '../components/column';


@inject('appStore')
@observer
export default class UserPage extends React.Component {
    constructor() {
        super();
        this.state = {
            timelines: []
        }
    }

    getName({ userid, date }) {
        if (date) {
            return `user/${userid}/${date}`;
        } else {
            return `user/${userid}`;
        }
    }

    componentWillMount() {
        this.setState({
            timelines: [this.getName(this.props.match.params)]
        })
    }

    componentDidUpdate(prevProps) {
        if (this.getName(this.props.match.params) !== this.getName(prevProps.match.params)) {
            this.setState({
                timelines: [this.getName(this.props.match.params)]
            });
        }
    }

    onSelect = (name) => {
        if (this.state.timelines[0] !== name) {
            const timelines = [this.state.timelines[0], name]
            this.setState({ timelines });
        }
    }

    onOpen = (name) => {
        this.props.history.push('/' + name);
    }

    render() {
        const userid = this.props.match.params.userid;
        return (
            <div className='container'>
                <Sidebar user={userid} history={this.props.history} />
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

