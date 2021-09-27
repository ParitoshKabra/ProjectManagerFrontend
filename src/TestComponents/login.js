import React, { useEffect } from 'react';
import { Link, Redirect } from 'react-router-dom';
export const Login = (props) => {
	const submit = (e) => {
		e.preventDefault();
	};
	const style = {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center'
	};
	const redirect = () => {
		window.location.href = "https://channeli.in/oauth/authorise?client_id=9iXxR2JLU4HyfCi1umE5nDKTyjbpicWrFFUQPWAV&redirect_uri=http://127.0.0.1:3000/omniport";
	};
	useEffect(()=>{
		props.checkLoginStatus();
	});
	if (!props.loginStatus) {
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
				<Link onClick={redirect}>Authorize</Link>
			</div>
		);
	}
	else{
		return <Redirect to="/login/success"/>
	}
};
