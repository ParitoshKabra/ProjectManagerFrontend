import axios from 'axios';
import React from 'react';
import { Redirect } from 'react-router';
import { Logout } from './logout';
import { Sidebar } from './sidebar';{}

export class Welcome extends React.Component{
	constructor(props){
		super(props);
		this.state = {user: {}}

		this.successfulLogout = this.successfulLogout.bind(this);
	}
	componentDidMount(){
		this.getUser();
		this.props.checkLoginStatus();
	}

	successfulLogout(data){
		console.log(data)
		console.log(this.history)
		this.props.history.push("/");
	}
	getUser(){
		if (this.props.loginStatus) {
			axios
				.get('http://127.0.0.1:8000/trelloAPIs/user', {withCredentials : true})
				.then((res) => {
					console.log(res);
					this.setState({user: res.data[0]});
				})
				.catch((error) => {
					console.log(error);
				});
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
			<Sidebar {...this.props} user={this.state.user}/>
			<Logout handleLogout={this.successfulLogout}/>
			</>;
		} else {
			return <Redirect to="/" />;
		}
	}
}