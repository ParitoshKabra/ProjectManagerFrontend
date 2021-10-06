import React from 'react';
import { ToggleSwitch } from './utility/toggleSwitch';
import { ProjectTemplate } from './projectTemplate';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import { ListItem } from '@material-ui/core';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import StarBorder from '@mui/icons-material/StarBorder';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import LogoutIcon from '@mui/icons-material/Logout';
import { Divider } from '@mui/material';
import { makeStyles } from '@mui/styles';
import axios from 'axios';
// Main Component

const style = makeStyles(theme => ({
	root:{
		paddingTop: "8px",
		paddingBottom: "8px",
		paddingRight: "16px",
		paddingLeft: "16px"
	}
}))

export class Sidebar extends React.Component {
	constructor(props) {
		super(props);
		this.classes = makeStyles();
		this.state = { activeItem: {}, open: false, role: '' };
		this.handleClick = this.handleClick.bind(this);
		this.setAsActive = this.setAsActive.bind(this);
		this.getStatusForActiveItem = this.getStatusForActiveItem.bind(this);
	}
	handleClick() {
		const new_state = !this.state.open;
		this.setState({ open: new_state });
	}
	componentDidMount() {
		this.props.getUser();
		console.log('open', this.state.open);
	}
	setAsActive(project) {
		console.log('setting active project', project);
		this.setState({ activeItem: project }, this.getStatusForActiveItem);
	}
	getStatusForActiveItem() {
		if (this.state.activeItem.created_by === this.props.user.id) {
			this.setState({ role: 'Project-Creator' });
		} else if (this.state.activeItem.admins.indexOf(this.props.user.id) != -1) {
			this.setState({ role: 'Project-Admin' });
		} else {
			this.setState({ role: 'Project-Member' });
		}
	}
	render() {
		return (
			<List
				sx={{
					width: '100%',
					maxWidth: 360,
					bgcolor: 'background.paper',
					display: 'flex',
					flexDirection: 'column',
					border: '2px solid black',
					height: '100vh'
				}}
				component="nav"
				aria-labelledby="nested-list-subheader"
				subheader={
					<ListSubheader component="div" id="nested-list-subheader">
						{this.state.role}
					</ListSubheader>
				}
			>
				<ListItemButton
					className={this.classes.root}
					onClick={() => {
						this.props.history.push('/dashboard');
					}}
				>
					<ListItemText primary="Dashboard" />
				</ListItemButton>
				<ListItemButton
					onClick={() => {
						this.props.history.push('/cards');
					}}
				>
					<ListItemText primary="Assigned Cards" />
				</ListItemButton>
				<ListItemButton onClick={this.handleClick}>
					<ListItemIcon>
						<AccountTreeIcon />
					</ListItemIcon>
					<ListItemText primary="Projects" />
					{this.state.open ? <ExpandLess /> : <ExpandMore />}
				</ListItemButton>
				{/* how to add overflow-scroll feature */}
				<List>
					<Collapse in={this.state.open} timeout="auto" unmountOnExit>
						<ProjectTemplate
							{...this.props}
							projects={this.props.user['projects_of_user']}
							setAsActive={this.setAsActive}
						/>
					</Collapse>
				</List>

				<ListItemButton
					variant="contained"
					color="primary"
					onClick={() => {
						this.props.history.push('/createProject');
					}}
				>
					<ListItemText primary="Create New Project" />
				</ListItemButton>
				
				<ListItemButton
					onClick={() => {
						axios
							.get('http://127.0.0.1:8000/trelloAPIs/logout', { withCredentials: true })
							.then((response) => {
								this.props.history.push('/');
							})
							.catch((error) => {
								console.log(error);
							});
					}}
					variant="contained"
					sx={{marginTop: "15px"}}
				>
					<ListItemIcon>
						<LogoutIcon />
					</ListItemIcon>
					<ListItemText primary="Logout" />
				</ListItemButton>
			</List>
		);
	}
}
