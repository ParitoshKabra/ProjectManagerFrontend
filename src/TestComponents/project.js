import React from 'react'
import { Button } from '@material-ui/core';
import { Link } from 'react-router-dom';
import axios from 'axios';
export class Project extends React.Component{
    constructor(props){
        super(props);
        this.state = {projectContent: {}}
        this.renderLists = this.renderLists.bind(this);
    }
    componentDidMount(){
    }
    renderLists(){
        
        this.props.history.push("/project/"+this.props.project.id);
    }
    render(){
        return <Button variant="contained" color="primary" style={{width:"200px", margin:"1px 0"}} onClick={this.renderLists}>{this.props.project.title}</Button>;
    }
}
// how does user know which project is the active project