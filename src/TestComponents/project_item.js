import React from 'react'

export const ProjectItem = (props)=>{
    console.log(props);
    return (
        <div>
            <h4>{props.project.title}</h4>
            <p>{props.project.descp}</p>
        </div>
    );
}