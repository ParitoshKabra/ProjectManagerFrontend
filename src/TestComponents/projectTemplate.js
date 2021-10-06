import React from 'react'
import { Project } from './project';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import { List, ListItem } from '@mui/material';
export const ProjectTemplate = (props) =>{
    return (
        <List component={"div"} sx ={{
			width: '100%',
			maxWidth: 360,
			bgcolor: 'background.paper',
			position: 'relative',
			overflow: 'auto',
			maxHeight: 300,
			'& ul': { padding: 0 },
		  }}>
			{props.projects.length === 0 ? (
				'No projects to display'
			) : (
				props.projects.map((project) => {
					return <ListItem sx={{ pl: 4 }}><Project {...props} project={project} key={project.id} /></ListItem>;
				})
			)}
		</List>
    );
}