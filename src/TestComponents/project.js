import React from 'react';
import { Button } from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import { ListItemText } from '@mui/material';

export const Project = (props) => {
	const renderLists = () => {
		props.setAsActive(props.project);
		props.history.push('/project/' + props.project.id);
	};
	
	return (
		<ListItemButton
			variant="contained"
			color="primary"
			style={{ width: '200px', margin: '1px 0' }}
			onClick={renderLists}
		>
			<ListItemText primary={props.project.title} />
		</ListItemButton>
	);
};
// how does user know which project is the active project
