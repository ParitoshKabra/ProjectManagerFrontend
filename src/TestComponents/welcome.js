import { Button } from '@mui/material';
import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';
<<<<<<< HEAD
import { Sidebar } from './sidebar';
=======
import { Logout } from './logout';
import { Sidebar } from './sidebar';{}

>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
// Main Component
export class Welcome extends React.Component{
	constructor(props){
		super(props);
		this.getUserWelcome = this.getUserWelcome.bind(this);
<<<<<<< HEAD
=======
		this.successfulLogout = this.successfulLogout.bind(this);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	}
	componentDidMount(){
		this.props.checkLoginStatus();
		this.getUserWelcome();
	}

<<<<<<< HEAD
=======
	successfulLogout(data){
		console.log(data)
		console.log(this.history)
		this.props.history.push("/");
	}
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
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
<<<<<<< HEAD
			
=======
			<Sidebar {...this.props}/>
			<Logout handleLogout={this.successfulLogout}/>
			<Button variant="contained" color="primary" onClick={()=>{
				this.props.history.push("/createProject")
			}}>Create New Project</Button>
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			</>;
		} else {
			return <Redirect to="/" />;
		}
	}
}