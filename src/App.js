import './App.css';
import React from 'react';
import { Login } from './TestComponents/login';
import { Welcome } from './TestComponents/welcome';
import { Omniport } from './TestComponents/omniport';
import { ListProject } from './TestComponents/listproject';
import { CreateCard } from './TestComponents/CreateCard';
import CreateProject from './TestComponents/CreateProject';
import { createTheme, ThemeProvider } from '@mui/material';
import axios from 'axios';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
<<<<<<< HEAD
import { Sidebar } from './TestComponents/sidebar';
import { Grid } from '@mui/material';
=======

>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
const theme = createTheme({
	palette: {
		primary: {
			main: '#4def5a'
		}
	}
});

const axiosInstance = axios.create({
	baseURL: 'http://127.0.0.1:8000/trelloAPIs/',
	timeout: 5000,
	headers: {
		'Content-Type': 'application/json'
		// 'Accept': 'application/json'
	}
});
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.xsrfCookieName = 'csrftoken';
axiosInstance.defaults.xsrfHeaderName = 'X-CSRFToken';

<<<<<<< HEAD
export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loggedin: false, user: {}, done: false };
=======

export default class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = { loggedin: false, user:{} };
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41

		this.checkLoginStatus = this.checkLoginStatus.bind(this);
		this.getUser = this.getUser.bind(this);
	}
<<<<<<< HEAD
	async componentDidMount() {
		console.log('DidMount called');
		await this.checkLoginStatus();
		console.log('Execution of Login Didmount done', this.state.loggedin);
		await this.getUser();
		this.setState({ done: true });
	}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	//once the user is logged in sidebar should be there with every component
	render() {
		return (
			<ThemeProvider theme={theme}>
				<Router>
<<<<<<< HEAD
					<Grid container spacing={1}>
						<Grid item sm={3}>
							<Route
								path="/"
								render={(props) => {
									return this.state.loggedin ? (
										<Sidebar {...props} user={this.state.user} getUser={this.getUser} />
									) : (
										<React.Fragment />
									);
								}}
							/>
						</Grid>
						<Grid item sm={9}>
							<h1>Trello App</h1>
							<Route
								exact
								path="/"
								render={(props) => {
									return (
										<Login
											{...props}
											loginStatus={this.state.loggedin}
											checkLoginStatus={this.checkLoginStatus}
											user={this.state.user}
											getUser={this.getUser}
										/>
									);
								}}
							/>
							<Route
								exact
								path="/dashboard"
								render={(props) => {
									return (
										<Welcome
											{...props}
											loginStatus={this.state.loggedin}
											checkLoginStatus={this.checkLoginStatus}
											user={this.state.user}
											getUser={this.getUser}
										/>
									);
								}}
							/>
							<Route
								exact
								path="/project/:id"
								render={(props) => {
									return (
										<ListProject
											{...props}
											loginStatus={this.state.loggedin}
											checkLoginStatus={this.checkLoginStatus}
											user={this.state.user}
											getUser={this.getUser}
											done={this.state.done}
											axiosInstance={axiosInstance}
										/>
									);
								}}
							/>
							<Route
								exact
								path="/omniport"
								render={(props) => {
									return <Omniport {...props} user={this.state.user} getUser={this.getUser} />;
								}}
							/>
							<Route
								exact
								path="/createCard/:id/:projectid"
								render={(props) => {
									return (
										<CreateCard
											{...props}
											user={this.state.user}
											axiosInstance={axiosInstance}
											loginStatus={this.state.loggedin}
											getUser={this.getUser}
											edit={false}
											done={this.state.done}
										/>
									);
								}}
							/>
							<Route
								exact
								path="/createProject"
								render={(props) => {
									return (
										<CreateProject
											{...props}
											user={this.state.user}
											axiosInstance={axiosInstance}
											loginStatus={this.state.loggedin}
											getUser={this.getUser}
											done={this.state.done}
										/>
									);
								}}
							/>
						</Grid>
					</Grid>
=======
					<h1>Trello App</h1>
					<Route
						exact
						path="/"
						render={(props) => {
							return !this.state.loggedin ? (
								<Login
									{...props}
									loginStatus={this.state.loggedin}
									checkLoginStatus={this.checkLoginStatus}
									user={this.state.user}
									getUser={this.getUser}
								/>
							) : (
								<Redirect to="/dashboard" />
							);
						}}
					/>
					<Route
						exact
						path="/dashboard"
						render={(props) => {
							return (
								<Welcome
									{...props}
									loginStatus={this.state.loggedin}
									checkLoginStatus={this.checkLoginStatus}
									user={this.state.user}
									getUser={this.getUser}
								/>
							);
						}}
					/>
					<Route
						exact
						path="/project/:id"
						render={(props) => {
							return (
								<ListProject
									{...props}
									loginStatus={this.state.loggedin}
									checkLoginStatus={this.checkLoginStatus}
									user={this.state.user}
									getUser={this.getUser}
									axiosInstance={axiosInstance}
								/>
							);
						}}
					/>
					<Route
						exact
						path="/omniport"
						render={(props) => {
							return <Omniport {...props}  user={this.state.user} getUser={this.getUser}/>;
						}}
					/>
					<Route
						exact
						path="/createCard/:id/:projectid"
						render={(props) => {
							return <CreateCard {...props} user={this.state.user} axiosInstance={axiosInstance} loginStatus={this.state.loggedin} getUser={this.getUser}/>;
						}}
					/>
					<Route
						exact
						path="/createProject"
						render={(props) => {
							return <CreateProject {...props} user={this.state.user} axiosInstance={axiosInstance} loginStatus={this.state.loggedin} getUser={this.getUser}/>;
						}}
					/>
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				</Router>
			</ThemeProvider>
		);
	}
<<<<<<< HEAD

	checkLoginStatus = async () => {
		await axios
			.get('http://127.0.0.1:8000/trelloAPIs/check_login', { withCredentials: true })
			.then((response) => {
				console.log('finished checking');
=======
	componentDidMount() {
		console.log('DidMount called');
		this.checkLoginStatus();
		this.getUser();
	}
	checkLoginStatus = () => {
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/check_login', { withCredentials: true })
			.then((response) => {
				console.log(response);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				if (response.data.loggedin === true && this.state.loggedin === false) {
					this.setState({ loggedin: true });
				} else if (this.state.loggedin === true && response.data.loggedin === false) {
					this.setState({ loggedin: false });
				}
			})
			.catch((error) => {
				console.log('checking error...', error);
			});
	};
<<<<<<< HEAD
	getUser = async () => {
		await axios
			.get('http://127.0.0.1:8000/trelloAPIs/user', { withCredentials: true })
			.then((res) => {
				console.log('user data', res.data[0]);
				this.setState({ user: res.data[0] });
			})
			.catch((error) => {
				console.log(error);
			});
	};
}
// How to give dynamic path in router
// how to go to the path if loggedin after refresh
// Main Components : Modify/Delete request on cards, lists
=======
	getUser = () =>{
		axios
		.get('http://127.0.0.1:8000/trelloAPIs/user', {withCredentials: true})
		.then(res=>{
			console.log("user data", res.data[0]);
			this.setState({user: res.data[0]});
		})
		.catch(error=>{
			console.log(error);
		})
	}
}
// How to give dynamic path in router
// how to go to the path if loggedin after refresh
// Main Components : Modify/Delete request on cards, lists
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
