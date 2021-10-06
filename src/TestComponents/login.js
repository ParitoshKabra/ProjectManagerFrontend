import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';


export class Login extends React.Component{
	constructor(props){
		super(props);
	}
	componentDidMount(){
		this.props.checkLoginStatus();
		this.props.getUser();
<<<<<<< HEAD
		console.log("Login didmount", this.props.loginStatus);
=======
		if(this.props.loginStatus){
			console.log("Came inside login," ,this.props.history)
			this.props.history.goBack();
		}
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	}
	redirect = () => {
		window.location.href = "https://channeli.in/oauth/authorise?client_id=9iXxR2JLU4HyfCi1umE5nDKTyjbpicWrFFUQPWAV&redirect_uri=http://127.0.0.1:3000/omniport";
	};
	render(){
		const style = {
			display: 'flex',
			flexDirection: 'column',
			alignItems: 'center',
			justifyContent: 'center'
		};
		const submit = (e) => {
			e.preventDefault();
		};
<<<<<<< HEAD
		if(this.props.loginStatus){
			console.log("Came inside login," ,window.location.href);
			this.props.history.push('/dashboard');
		}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		return (
			<div style={style}>
				<h2>Login to Trello</h2>
				<form onSubmit={submit} style={style}>
					<label htmlFor="username">Username:</label>
					<input type="text" name="username" id="username" />
					<label htmlFor="passwd">Password:</label>
					<input type="password" name="passwd" id="passwd" />
					<button type="submit">Log In</button>
				</form>
				<Link onClick={this.redirect}>Authorize</Link>
			</div>
		);
	}
}