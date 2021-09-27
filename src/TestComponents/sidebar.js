import React from 'react'
import {UtilTemplates} from './utility/util_templates'
import { ToggleSwitch } from './utility/toggleSwitch';
export class Sidebar extends React.Component{
    constructor(props){
        super(props);
    }
    render(){
        return (<>
        <ToggleSwitch name="Projects">
            <UtilTemplates name = "projects" attribute={this.props.user["projects_of_user"]}/>
        </ToggleSwitch>
        <ToggleSwitch name="Cards">
            <UtilTemplates name = "cards" attribute={this.props.user["assigned_cards"]}/>
        </ToggleSwitch>
        <ToggleSwitch name="Comments">
            <UtilTemplates name = "comments" attribute={this.props.user["comments_of_user"]}/>
        </ToggleSwitch>
            
            
            
            
            
            </>);
    }
}