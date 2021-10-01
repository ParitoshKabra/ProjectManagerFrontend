import React from 'react'
import { ToggleSwitch } from './utility/toggleSwitch';
import { ProjectTemplate } from './projectTemplate';

// Main Component
export class Sidebar extends React.Component{
    constructor(props){
        super(props);
        this.state = {activeItem: {}}
    }
    render(){
        return (<>
        <ToggleSwitch name="Projects">
            <ProjectTemplate {...this.props} projects={this.props.user["projects_of_user"]}/>
        </ToggleSwitch>
            </>);
    }
}