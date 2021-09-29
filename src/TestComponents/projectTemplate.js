import React from 'react'
import { Project } from './project';


export const ProjectTemplate = (props) =>{
    return (
        <div style={{display:"flex", flexDirection:"column"}}>
			{props.projects.length === 0 ? (
				'No projects to display'
			) : (
				props.projects.map((project) => {
					return <Project {...props} project={project} key={project.id} />;
				})
			)}
		</div>
    );
}