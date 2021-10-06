import React from 'react'
import { Button } from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import { ListItemText } from '@mui/material';
export class Project extends React.Component{
    constructor(props){
        super(props);
        this.state = {projectContent: {}}
        this.renderLists = this.renderLists.bind(this);
    }
    componentDidMount(){
    }
    renderLists(){
        this.props.setAsActive(this.props.project);
        this.props.history.push("/project/"+this.props.project.id);
    }
    render(){
        return (<ListItemButton variant="contained" color="primary" style={{width:"200px", margin:"1px 0"}} onClick={this.renderLists}>
            <ListItemText primary={this.props.project.title} />
            </ListItemButton>);
    }
}
// how does user know which project is the active project