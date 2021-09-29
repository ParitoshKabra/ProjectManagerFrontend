import axios from 'axios';
import React from 'react'

export class MyList extends React.Component{
    constructor(props){
        super(props);
        this.state = {listContent:{}}
    }
    componentDidMount(){
        this.getList();
    }
    getList(){
        axios
        .get("http://127.0.0.1:8000/trelloAPIs/lists/"+this.props.list.id, {withCredentials: true})
        .then(response =>{
            console.log("Inside list")
            console.log(response.data)
            this.setState({projectContent: response.data});
            return response.data
        })
        .catch(error =>{
            console.log(error)
            return error
        })
    }
    render(){
        return <div>{this.props.list.title}</div>
    }
}