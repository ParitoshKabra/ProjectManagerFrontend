import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import CreateList from './CreateList';
import axios from 'axios';
import {MyList} from './list'
import { Grid } from '@mui/material';
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
	async componentWillReceiveProps(nextProps) {
		if(this.props.match.params.id !== nextProps.match.params.id) {
			console.log("entered inside this if damn ");
			await this.props.checkLoginStatus();
			await this.props.getUser();
			await this.renderLists();
		}
	}
	renderLists() {
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/projects/' + this.props.match.params.id, { withCredentials: true })
			.then((response) => {
				console.log("I got a response");
				this.setState({ projectContent: response.data });
			})
			.catch((error) => {
				console.log(error);
			});
	}
	render() {
		if (this.props.loginStatus) {
			if(this.state.projectContent){
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

                );
            }
            else{
                return <p>Loading Lists...</p>
            }
		} else {
			console.log(this.props.done, this.props.loginStatus);
			if(this.props.done){
				return <Redirect to="/" />;
			}
			else{
				return <p>Checking login status...</p>
			}
		}
	}
}
