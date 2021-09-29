import './App.css';
import React from 'react'
import {Login} from "./TestComponents/login";
import {Welcome} from "./TestComponents/welcome";
import {Omniport} from "./TestComponents/omniport";
import {ListProject} from "./TestComponents/listproject"


import axios from 'axios';
import {
	BrowserRouter as Router,
	Switch,
	Route,
  Redirect
  } from "react-router-dom";

export default class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {loggedin:false}

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
  }
  render(){
    return (
      <Router>
          <h1>Trello App</h1>
          <Route exact path = "/" render = {(props) =>{
            return !this.state.loggedin ? <Login {...props} loginStatus = {this.state.loggedin} checkLoginStatus={this.checkLoginStatus}/> : <Redirect to="/dashboard"/>
          }}/>
          <Route exact path="/dashboard" render = {(props) =>{
            return this.state.loggedin ? <Welcome {...props} loginStatus = {this.state.loggedin} checkLoginStatus={this.checkLoginStatus}/> : <Redirect to="/"/>
          }}/>
          <Route exact path="/project/:id" render = {(props) =>{
            return <ListProject {...props} loginStatus = {this.state.loggedin} checkLoginStatus={this.checkLoginStatus}/> 
          }}/>
          <Route exact path="/omniport" render={props=>{
              return <Omniport {...props} />
            }}/>
      </Router>
    );
  }
  componentDidMount(){
    console.log("DidMount called")
    this.checkLoginStatus();
  }
  checkLoginStatus = ()=>{
    axios
    .get("http://127.0.0.1:8000/trelloAPIs/check_login", {withCredentials:true})
    .then(response =>{
      console.log(response)
      if(response.data.loggedin === true && this.state.loggedin === false){
          this.setState({loggedin:true});
      }
      else if(this.state.loggedin === true && response.data.loggedin === false){
        this.setState({loggedin:false});
      }
    })
    .catch(error =>{
      console.log("checking error...", error);
    });
  }
}
// How to give dynamic path in router
// how to go to the path if loggedin after refresh