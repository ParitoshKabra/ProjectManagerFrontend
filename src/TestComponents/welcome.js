import { Button, Typography } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';
import { Sidebar } from './sidebar';
// Main Component
export class Welcome extends React.Component {
	constructor(props) {
		super(props);
		this.getUserWelcome = this.getUserWelcome.bind(this);
	}
	componentDidMount() {
		this.props.checkLoginStatus();
		this.getUserWelcome();
	}

	getUserWelcome() {
		if (this.props.loginStatus) {
			this.props.getUser();
		}
		else {
			this.setState({ user: {} });
		}
	}
	render() {
		if (this.props.loginStatus) {
			// Design starts here 
			/* Welcome page should set the grid layout and then every component individually should be implemented, like Projects, Comments, Assigned_Cards, and the Dashboard then to be decided at the end*/
			// <h3>Welcome {this.state.user['username']}</h3>
			return <>
				<Typography variant="h2" textAlign="center" mt={20}>Welcome to the new Trello App</Typography>
			</>;
		} else {
			if (this.props.done) {
				return <Redirect to="/" />;
			}
			else {
				return <p>Checking login status....</p>
			}
		}
	}
}
