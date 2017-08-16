import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import injectTapEventPlugin from 'react-tap-event-plugin';
import validator from 'validator';
import ListMessages from './ListMessages';
import { connect } from 'react-redux';
import { login, logout, authStates } from '../controllers/auth';
import RefreshIndicator from 'material-ui/RefreshIndicator';

const INVALID_EMAIL = 'Invalid Email.';
const REQUIRE_EMAIL = 'Email is required.';
const INVALID_PASSWORD = 'Password is required.';

class LoginForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            errors: {}
        }

        injectTapEventPlugin();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.validate = this.validate.bind(this);
    }

    validate() {

        if (!this.state.email) {
            throw new Error(REQUIRE_EMAIL);
        } else if (!validator.isEmail(this.state.email)) {
            throw new Error(INVALID_EMAIL);
        }

        if (!this.state.password) {
            throw new Error(INVALID_PASSWORD);
        }

    }

    handleChange(event) {
        if (event.target.id === 'email') {
            this.setState({ ...this.state, email: event.target.value, errors: { ...this.state.errors, email: '' } });
        } else if (event.target.id === 'password') {
            this.setState({ ...this.state, password: event.target.value, errors: { ...this.state.errors, password: '' } });
        }
    }

    handleSubmit(e) {
        try {
            this.validate();
            this.props.login( this.state.email, this.state.password );
        } catch (err) {

            if (err.message === INVALID_EMAIL || err.message === REQUIRE_EMAIL) {
                this.setState({ ...this.state, errors: { email: err.message } });
            } else if (err.message === INVALID_PASSWORD) {
                this.setState({ ...this.state, errors: { password: err.message } });
            } else {
                this.setState({ ...this.state, errors: { ...this.state.errors, messages: [err.message] } });
            }
        }

        e.preventDefault();
    }

    handleLogout( e ) {
        this.props.logout();
    }

    render() {

        let { email, password, errors } = this.state;

        if (this.props.state.state === authStates.AUTH_LOGGED_IN || this.props.state.state === authStates.AUTH_READY) {
            return (<div><RaisedButton label="Logout" fullWidth={true} secondary={true} onClick={this.handleLogout} /></div>);
        } else if (this.props.state.state === authStates.AUTH_PENDING) {

            const refresh = {
                display: 'inline-block',
                position: 'relative'
            };

            return (<div><RefreshIndicator size={40} left={10} top={0} status='loading' style={refresh} /></div>);
        } else {
            return (
                <div>
                    <ListMessages messages={errors.messages} />
                    <form name="LoginForm" onSubmit={this.handleSubmit} >
                        <TextField id="email" hintText="Username or Email" floatingLabelText="Username" value={email} onChange={this.handleChange} errorText={errors.email} /><br />
                        <TextField id="password" hintText="Password" floatingLabelText="Password" type="password" value={password} onChange={this.handleChange} errorText={errors.password} /><br />
                        <RaisedButton label="Submit" fullWidth={true} primary={true} type="submit" />
                    </form>
                </div>
            );
        }

    }
}

const mapStateToProps = (state) => ({
    state: state.auth
});

const mapDispatchToProps = {
    login: login,
    logout: logout
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
