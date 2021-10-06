import React from 'react'
import { Project } from './project';
<<<<<<< HEAD
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
=======


export const ProjectTemplate = (props) =>{
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			{props.projects.length === 0 ? (
				'No projects to display'
			) : (
				props.projects.map((project) => {
<<<<<<< HEAD
					return <ListItem sx={{ pl: 4 }}><Project {...props} project={project} key={project.id} /></ListItem>;
				})
			)}
		</List>
=======
					return <Project {...props} project={project} key={project.id} />;
				})
			)}
		</div>
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
    );
}