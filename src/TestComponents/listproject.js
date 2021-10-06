import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import CreateList from './CreateList';
import axios from 'axios';
import {MyList} from './list'
<<<<<<< HEAD
import { Grid } from '@mui/material';
=======

>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
// Main Component
export class ListProject extends React.Component {
	constructor(props) {
		super(props);
		this.state = { projectContent: null };
		this.renderLists = this.renderLists.bind(this);
	}
	componentDidMount() {
		this.props.checkLoginStatus();
		this.props.getUser();
		this.renderLists();
	}
<<<<<<< HEAD
	async componentWillReceiveProps(nextProps) {
		if(this.props.match.params.id !== nextProps.match.params.id) {
			console.log("entered inside this if damn ");
			await this.props.checkLoginStatus();
			await this.props.getUser();
			await this.renderLists();
		}
	}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	renderLists() {
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/projects/' + this.props.match.params.id, { withCredentials: true })
			.then((response) => {
<<<<<<< HEAD
				console.log("I got a response");
				this.setState({ projectContent: response.data });
			})
			.catch((error) => {
				console.log(error);
=======
				console.log('Inside list project');
				console.log(response.data);
				this.setState({ projectContent: response.data });
				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return error;
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			});
	}
	render() {
		if (this.props.loginStatus) {
			if(this.state.projectContent){
<<<<<<< HEAD
                return (
                    <div>
                        <p>Project Number {this.state.projectContent.id}</p>
						<Grid container spacing={2}>
						{this.state.projectContent["project_lists"].map((list) => {
                        return <Grid item xs={6} md={4}>
								<MyList {...this.props} list={list} project={this.state.projectContent} key={list.id} renderLists={this.renderLists} />
							</Grid>;
                    })}
						</Grid>
						<CreateList {...this.props} project={this.state.projectContent} renderLists={this.renderLists}></CreateList>
					</div>
=======
                console.log("content");
                console.log(this.state.projectContent);
                return (
                    <div style={{display: "flex"}}>
                        <p>Project Number {this.state.projectContent.id}</p>
                        {this.state.projectContent["project_lists"].map((list) => {
                        return <MyList {...this.props} list={list} key={list.id} />;
                    })}
						<CreateList {...this.props} project={this.state.projectContent} renderLists={this.renderLists}></CreateList>
                    </div>
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41

                );
            }
            else{
                return <p>Loading Lists...</p>
            }
		} else {
<<<<<<< HEAD
			console.log(this.props.done, this.props.loginStatus);
			if(this.props.done){
				return <Redirect to="/" />;
			}
			else{
				return <p>Checking login status...</p>
			}
=======
			console.log('Inside listProject');
			return <Redirect to="/" />;
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		}
	}
}
