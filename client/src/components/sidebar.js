import React from 'react';
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types';
import moment from 'moment';

const Box = ({ children }) =>
    <div className='box'>
        {children}
    </div>

const Logo = (props) =>
    <Box>
        <h1><Link to="/">TANSU</Link></h1>
    </Box>

const SearchBox = ({ user, userid, onInput, onGo }) =>
    <div className='search-box'>
        <div className='title'>
            <h2>User</h2>
        </div>
        <div className='form'><input value={userid} onChange={(e) => onInput(e.target.value)} /><button onClick={onGo}>Go</button></div>
    </div>

const RecentDates = ({ lastDay, counts, user }) => {
    return (
        <Box>
            <h2>Recent</h2>
            <div>
                {
                    Array.from(Array(counts)).map((_x, i) => {
                        const date = moment(lastDay);
                        date.subtract(i, 'd');
                        const dateStr = date.format('YYYYMMDD');
                        const link = user ? `/user/${user}/${dateStr}` : `/date/${dateStr}`;
                        return (<div><Link to={link}>{date.format('MM月DD日')}</Link></div>);
                    })
                }
            </div>
        </Box>
    );
}

export default class Sidebar extends React.Component {
    static propTypes = {
        user: PropTypes.string,
        hisoty: PropTypes.object
    }

    componentWillMount() {
        this.setState({ userId: this.props.user });
    }

    onUserInput = (value) => {
        this.setState({ userId: value })
    }

    onUserGo = () => {
        this.props.history.push(`/user/${this.state.userId}`);
    }

    render() {
        const user = this.props.user;
        return (
            <div className='sidebar'>
                <Logo />
                <SearchBox user={user} userid={this.state.userId} onInput={this.onUserInput} onGo={this.onUserGo} />
                <RecentDates lastDay={Date.now()} counts={10} user={user} />
            </div>
        );
    }
}