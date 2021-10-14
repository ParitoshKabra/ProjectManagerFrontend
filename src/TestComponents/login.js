import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";

export class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
    };
  }
  componentDidMount() {
    this.props.checkLoginStatus();
    this.props.getUser();
    console.log("Login didmount", this.props.loginStatus);
  }
  redirect = () => {
    window.location.href =
      "https://channeli.in/oauth/authorise?client_id=9iXxR2JLU4HyfCi1umE5nDKTyjbpicWrFFUQPWAV&redirect_uri=http://127.0.0.1:3000/omniport";
  };
  render() {
    const style = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    };
    const submit = async (e) => {
      console.log("submit is getting called");
      e.preventDefault();
      console.log(this.state.username, this.state.password);
      let data = {
        username: this.state.username,
        password: this.state.password,
      };
      await axios
        .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
          withCredentials: true,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
      const res = await axios
        .post("http://127.0.0.1:8000/trelloAPIs/admin_login", data, {
          withCredentials: true,
        })
        .then((res1) => {
          this.props.checkLoginStatus();
          this.props.history.push("/dashboard");
          return res1.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
      console.log(res);
    };
    if (this.props.loginStatus) {
      console.log("Came inside login,", window.location.href);
      if (this.props.done) {
        this.props.history.push("/dashboard");
      }
    }
    return (
      <div style={style}>
        <h2>Login to Trello</h2>
        <form onSubmit={submit} style={style}>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={(e) => {
              this.setState({ username: e.target.value });
            }}
            value={this.state.username}
          />
          <label htmlFor="passwd">Password:</label>
          <input
            type="password"
            name="passwd"
            id="passwd"
            onChange={(e) => {
              this.setState({ password: e.target.value });
            }}
            value={this.state.password}
          />
          <button type="submit">Log In</button>
        </form>
        <Link onClick={this.redirect}>Authorize</Link>
      </div>
    );
  }
}
