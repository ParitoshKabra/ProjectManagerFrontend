import React, { useEffect } from "react";
import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
      height: "100%",
    };
    const formStyle = {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      maxHeight: "100%",
      width: "50%",
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

          return res1.data;
        })
        .catch((err) => {
          console.log(err);
          return err;
        });
      console.log(res);

      if (!res.hasOwnProperty("error")) {
        this.props.history.push("/dashboard");
      } else {
        alert(`Some error occured: ${res["error"]}`);
      }
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
        <form onSubmit={submit} style={formStyle}>
          <TextField
            type="text"
            name="username"
            id="fullWidth1"
            onChange={(e) => {
              this.setState({ username: e.target.value });
            }}
            label={"Username"}
            value={this.state.username}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <TextField
            type="password"
            name="passwd"
            id="fullWidth2"
            onChange={(e) => {
              this.setState({ password: e.target.value });
            }}
            value={this.state.password}
            label={"Password"}
            fullWidth
            style={{ marginBottom: "10px" }}
          />
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <Button type="submit" variant="contained">
              Log In
            </Button>
            <Button
              onClick={this.redirect}
              variant="contained"
              color="secondary"
            >
              Sign In with Omniport
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
