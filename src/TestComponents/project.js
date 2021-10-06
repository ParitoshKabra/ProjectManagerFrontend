import React from 'react'
import { Button } from '@material-ui/core';
<<<<<<< HEAD
import { ListItemButton } from '@mui/material';
import { ListItemText } from '@mui/material';
=======
import { Link } from 'react-router-dom';
import axios from 'axios';
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
export class Project extends React.Component{
    constructor(props){
        super(props);
        this.state = {projectContent: {}}
        this.renderLists = this.renderLists.bind(this);
    }
    componentDidMount(){
    }
    renderLists(){
<<<<<<< HEAD
        this.props.setAsActive(this.props.project);
        this.props.history.push("/project/"+this.props.project.id);
    }
    render(){
        return (<ListItemButton variant="contained" color="primary" style={{width:"200px", margin:"1px 0"}} onClick={this.renderLists}>
            <ListItemText primary={this.props.project.title} />
            </ListItemButton>);
=======
        
        this.props.history.push("/project/"+this.props.project.id);
    }
    render(){
        return <Button variant="contained" color="primary" style={{width:"200px", margin:"1px 0"}} onClick={this.renderLists}>{this.props.project.title}</Button>;
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
    }
}
// how does user know which project is the active project