import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';
import { Logout } from './logout';
import { Sidebar } from './sidebar';{}

// Main Component
export class Welcome extends React.Component{
	constructor(props){
		super(props);
		this.getUserWelcome = this.getUserWelcome.bind(this);
		this.successfulLogout = this.successfulLogout.bind(this);
	}
	componentDidMount(){
		this.props.checkLoginStatus();
		this.getUserWelcome();
	}

	successfulLogout(data){
		console.log(data)
		console.log(this.history)
		this.props.history.push("/");
	}
	getUserWelcome(){
		if (this.props.loginStatus) {
			this.props.getUser();
		}
		else{
			this.setState({user:{}});
		}
	}
	render(){
		if (this.props.loginStatus) {
			// Design starts here 
			/* Welcome page should set the grid layout and then every component individually should be implemented, like Projects, Comments, Assigned_Cards, and the Dashboard then to be decided at the end*/ 
			// <h3>Welcome {this.state.user['username']}</h3>
			return <>
			<Sidebar {...this.props}/>
			<Logout handleLogout={this.successfulLogout}/>
			<Button variant="contained" color="primary" onClick={()=>{
				this.props.history.push("/createProject")
			}}>Create New Project</Button>
			</>;
		} else {
			return <Redirect to="/" />;
		}
	}
}