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

import { alpha, styled } from '@mui/material/styles';
const useStyles = makeStyles(theme => ({
	root: {
		maxHeight: "10%"
	}
}))
const regex = new RegExp('^/(project|createCard)/[0-9]+(/[0-9]+)?$');
export const Sidebar = (props) => {
	const [activeItem, setactiveItem] = React.useState({});
	const [role, setRole] = React.useState('');
	const [open, setOpen] = React.useState(false);
	const [path, setPath] = React.useState(props.location.pathname);
	const classes = useStyles();
	React.useEffect(async () => {
		console.log("after mounting sidebar", props.user, path);
		if (regex.test(props.location.pathname)) {
			let s = path.split('/');
			if (s[1] === 'project' || s[1] === 'createCard') {
				console.log("called refresh!!");
				await getActiveProjectOnRefresh(s[2]);
			}
		}
		else if (path === '/dashboard') {
			setactiveItem({ 'temp': 'Dashboard' });
		}
		else if (path === '/cards') {
			setactiveItem({ 'temp': 'Assigned Cards' });
		}
		props.getUser();

	}, [path])

	React.useEffect(async () => {
		console.log(activeItem);
		if (Object.keys(activeItem).length !== 0) {
			console.log("Inside useEffect after setting activeItem", activeItem);
			await props.getUser();
			getStatusForActiveItem();
		}
	}, [activeItem])

	const handleClick = () => {
		const new_state = !open;
		setOpen(new_state);
		if (!activeItem.hasOwnProperty('created_by')) {
			setactiveItem({ 'temp': 'Projects' });
		}
	}
	const setAsActive = (project) => {
		console.log('setting active project', project);
		setactiveItem(project);
	}
	const getStatusForActiveItem = async () => {
		console.log(activeItem.created_by, props.user.id);

		if (activeItem.hasOwnProperty('temp')) {
			setRole(activeItem['temp']);
		}
		else if (activeItem.created_by === props.user.id) {
			setRole('Project-Creator');
		} else if (activeItem.admins.indexOf(props.user.id) != -1) {
			setRole('Project-Admin');
		} else if (activeItem.members.indexOf(props.user.id) !== -1) {
			setRole('Project-Member');
		}
		else {
			setRole('Trello App');
		}
	}
	const getActiveProjectOnRefresh = async (id) => {
		console.log('I was called!!', id)
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/projects/' + parseInt(id), { withCredentials: true })
			.then((response) => {
				console.log("getting response in sidebar on refresh");

				setactiveItem(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	}
	return (
		<List
			sx={{
				width: '100%',
				bgcolor: 'background.paper',
				display: 'flex',
				flexDirection: 'column',
				border: '2px solid black',
				height: '100%'
			}}
			component="nav"
			aria-labelledby="nested-list-subheader"
			subheader={
				<ListSubheader component="div" id="nested-list-subheader">
					{role}
				</ListSubheader>
			}
		>
			<ListItemButton
				className={classes.root}
				onClick={() => {
					props.history.push('/dashboard');
					setactiveItem({ 'temp': 'DashBoard' });
				}}

				className={classes.root}
			>
				<ListItemText primary="Dashboard" />
			</ListItemButton>
			<ListItemButton
				onClick={() => {
					props.history.push('/cards');
					setactiveItem({ 'temp': 'Assigned Cards' });

				}}
				className={classes.root}

			>
				<ListItemText primary="Assigned Cards" />
			</ListItemButton>
			<ListItemButton onClick={handleClick} className={classes.root}>
				<ListItemIcon>
					<AccountTreeIcon />
				</ListItemIcon>
				<ListItemText primary="Projects" />
				{open ? <ExpandLess /> : <ExpandMore />}
			</ListItemButton>
			{/* how to add overflow-scroll feature */}
			<List>
				<Collapse in={open} timeout="auto" unmountOnExit>
					<ProjectTemplate
						{...props}
						projects={props.user['projects_of_user']}
						setAsActive={setAsActive}
						activeProject={activeItem}
					/>
				</Collapse>
			</List>

			<ListItemButton
				variant="contained"
				color="primary"
				onClick={() => {
					props.history.push('/createProject');
				}}
				className={classes.root}
			>
				<ListItemText primary="Create New Project" />
			</ListItemButton>

			<ListItemButton
				onClick={() => {
					axios
						.get('http://127.0.0.1:8000/trelloAPIs/logout', { withCredentials: true })
						.then((response) => {
							props.history.push('/');
						})
						.catch((error) => {
							console.log(error);
						});
				}}
				variant="contained"
				sx={{ marginTop: "auto" }}
				className={classes.root}
			>
				<Divider />
				<ListItemIcon>
					<LogoutIcon />
				</ListItemIcon>
				<ListItemText primary="Logout" />
			</ListItemButton>
		</List>
	);
}
