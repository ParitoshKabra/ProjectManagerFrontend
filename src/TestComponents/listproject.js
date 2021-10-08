import React, { useEffect } from 'react';
import { Redirect } from 'react-router';
import CreateList from './CreateList';
import Button from '@mui/material/Button'
import {ButtonGroup} from '@mui/material'
import axios from 'axios';
import {MyList} from './list'
import { Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import {Typography, Container} from '@mui/material';
import {withStyles} from '@material-ui/core';
import IconButton from '@mui/material/IconButton';
import PeopleIcon from '@mui/icons-material/People';
import Switch from '@mui/material/Switch';

const createDOMPurify = require('dompurify');

const DOMPurify = createDOMPurify(window);
// Main Component
//
const styles = theme =>({
	btn:{
		borderRadius:"100%",	
		width:"60px",
		height: "60px",
		margin: "10px 10px"
	},
	btnGrp:{
		alignSelf: "flex-end"
	},
	root:{
		display:"flex",
		flexDirection: "column",

	}
});
class ListProject extends React.Component {
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
		const {classes} =this.props;
		if (this.props.loginStatus) {
			if(this.state.projectContent){
                return (
                    <Container className={classes.root}>
                        <Container sx={{display:"flex", flexDirection:"row", justifyContent:"space-between", margin:"1% 0"}}>
				<Typography variant="h5" component="h5">{this.state.projectContent.title}</Typography>
				<CreateList {...this.props} project={this.state.projectContent} renderLists={this.renderLists}></CreateList>
			</Container>
			<div>
			<div dangerouslySetInnerHTML={{ __html:DOMPurify.sanitize(this.state.projectContent['descp'])}}></div>
			<Switch defaultChecked />
			</div>

			<Grid container spacing={2}>
						{this.state.projectContent["project_lists"].map((list) => {
                        return <Grid item xs={6} md={4}>
								<MyList {...this.props} list={list} project={this.state.projectContent} key={list.id} renderLists={this.renderLists} />
							</Grid>;
                    })}
						</Grid>
						<div className={classes.btnGrp}>
							<Button color="primary" variant="contained" className={classes.btn}>			
								<EditIcon/>
							</Button>
							<Button color="secondary" variant="contained" className={classes.btn}>
								<PeopleIcon/>	
							</Button>
						</div>			
			</Container>
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
export default withStyles(styles)(ListProject);
