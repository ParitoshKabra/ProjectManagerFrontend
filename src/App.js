import "./App.css";
import React from "react";
import { Login } from "./TestComponents/login";
import { Welcome } from "./TestComponents/welcome";
import { Omniport } from "./TestComponents/omniport";
import ListProject from "./TestComponents/listproject";
import { CreateCard } from "./TestComponents/CreateCard";
import CreateProject from "./TestComponents/CreateProject";
import { createTheme, ThemeProvider } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

import axios from "axios";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { Sidebar } from "./TestComponents/sidebar";
import { Grid } from "@mui/material";
import MyCard from "./TestComponents/Card.js";
import AssignedCards from "./TestComponents/AssignedCards";
import Members from "./TestComponents/Members";

const axiosInstance = axios.create({
  baseURL: "http://127.0.0.1:8000/trelloAPIs/",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    // 'Accept': 'application/json'
  },
});
axiosInstance.defaults.withCredentials = true;
axiosInstance.defaults.xsrfCookieName = "csrftoken";
axiosInstance.defaults.xsrfHeaderName = "X-CSRFToken";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      user: {},
      done: false,
      isDiffUser: false,
      diffUser: {},
    };

    this.checkLoginStatus = this.checkLoginStatus.bind(this);
    this.getUser = this.getUser.bind(this);
    this.otherUserView = this.otherUserView.bind(this);
    this.getOtherUser = this.getOtherUser.bind(this);
  }
  async componentDidMount() {
    console.log("DidMount called");
    const regex = new RegExp("^/(cards|dashboard)/user/([0-9]+)?$");
    const regex1 = new RegExp(
      "^/(project|createCard)/user/[0-9]+/[0-9]+/[0-9]+/?$"
    );
    const regex2 = new RegExp("^/project/user/[0-9]+/[0-9]+");

    await this.checkLoginStatus();
    console.log("Execution of Login Didmount done", this.state.loggedin);
    await this.getUser();
    this.setState({ done: true });
    let refresh = window.location.pathname;
    console.log(refresh, refresh.split("/")[3]);
    if (regex.test(refresh) || regex1.test(refresh) || regex2.test(refresh)) {
      await this.otherUserView(refresh.split("/")[3]);
    }
  }
  async otherUserView(id) {
    if (!this.state.isDiffUser) {
      this.setState({ isDiffUser: true }, async () => {
        await this.getOtherUser(id);
      });
    } else {
      this.setState({ isDiffUser: false });
    }
  }
  async getOtherUser(id) {
    console.log(
      "called in app.js to fetch other user: ",
      id,
      this.state.isDiffUser
    );
    await axios
      .get("http://127.0.0.1:8000/trelloAPIs/users_all/" + id + "/", {
        withCredentials: true,
      })
      .then((res) => {
        console.log("diff user is fetched", res.data);
        this.setState({ diffUser: res.data });
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("I am printed after user is fetched!!");
  }

  //once the user is logged in sidebar should be there with every component
  render() {
    return (
      // <ThemeProvider theme={theme}>
      <Router>
        <Grid container spacing={1} height={"100vh"}>
          <Grid item sm={3} sx={{ maxHeight: "100%", height: "100%" }}>
            <Route
              path="/"
              render={(props) => {
                return this.state.loggedin ? (
                  <Sidebar
                    {...props}
                    user={this.state.user}
                    getUser={this.getUser}
                    isDiffUser={this.state.isDiffUser}
                    diffUser={this.state.diffUser}
                    otherUserView={this.otherUserView}
                    checkLoginStatus={this.checkLoginStatus}
                  />
                ) : (
                  <React.Fragment />
                );
              }}
            />
          </Grid>
          <Grid
            item
            sm={9}
            sx={{
              maxHeight: "100%",
              height: "100%",
              overflowX: "hidden",
              overflowY: "scroll",
              position: "relative !important",
            }}
          >
            <Switch>
              <Route
                exact
                path="/"
                render={(props) => {
                  return (
                    <Login
                      {...props}
                      loginStatus={this.state.loggedin}
                      checkLoginStatus={this.checkLoginStatus}
                      user={this.state.user}
                      getUser={this.getUser}
                    />
                  );
                }}
              />
              <Route
                exact
                path={["(/dashboard|/dashboard/user/[0-9]+/?)"]}
                render={(props) => {
                  return (
                    <Welcome
                      {...props}
                      loginStatus={this.state.loggedin}
                      checkLoginStatus={this.checkLoginStatus}
                      user={this.state.user}
                      getUser={this.getUser}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path={["(/cards|/cards/user/[0-9]+/?)"]}
                render={(props) => {
                  return (
                    <AssignedCards
                      {...props}
                      loginStatus={this.state.loggedin}
                      checkLoginStatus={this.checkLoginStatus}
                      user={this.state.user}
                      getUser={this.getUser}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path={"/project/:id"}
                render={(props) => {
                  return (
                    <ListProject
                      {...props}
                      loginStatus={this.state.loggedin}
                      checkLoginStatus={this.checkLoginStatus}
                      user={this.state.user}
                      getUser={this.getUser}
                      done={this.state.done}
                      axiosInstance={axiosInstance}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/project/user/:userId/:id"
                render={(props) => {
                  console.log(props);
                  return (
                    <ListProject
                      {...props}
                      loginStatus={this.state.loggedin}
                      checkLoginStatus={this.checkLoginStatus}
                      user={this.state.user}
                      getUser={this.getUser}
                      done={this.state.done}
                      axiosInstance={axiosInstance}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/omniport"
                render={(props) => {
                  return (
                    <Omniport
                      {...props}
                      user={this.state.user}
                      getUser={this.getUser}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/createCard/:projectid/:id"
                render={(props) => {
                  return (
                    <CreateCard
                      {...props}
                      user={this.state.user}
                      axiosInstance={axiosInstance}
                      loginStatus={this.state.loggedin}
                      getUser={this.getUser}
                      edit={false}
                      done={this.state.done}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/createProject"
                render={(props) => {
                  return (
                    <CreateProject
                      {...props}
                      user={this.state.user}
                      axiosInstance={axiosInstance}
                      loginStatus={this.state.loggedin}
                      getUser={this.getUser}
                      done={this.state.done}
                      edit={false}
                      project={undefined}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path={"/project/:projectId/:cardId"}
                render={(props) => {
                  return (
                    <MyCard
                      {...props}
                      user={this.state.user}
                      axiosInstance={axiosInstance}
                      loginStatus={this.state.loggedin}
                      getUser={this.getUser}
                      done={this.state.done}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path={"/project/user/:userId/:projectId/:cardId"}
                render={(props) => {
                  return (
                    <MyCard
                      {...props}
                      user={this.state.user}
                      axiosInstance={axiosInstance}
                      loginStatus={this.state.loggedin}
                      getUser={this.getUser}
                      done={this.state.done}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
              <Route
                exact
                path="/members"
                render={(props) => {
                  return (
                    <Members
                      {...props}
                      user={this.state.user}
                      axiosInstance={axiosInstance}
                      loginStatus={this.state.loggedin}
                      getUser={this.getUser}
                      done={this.state.done}
                      isDiffUser={this.state.isDiffUser}
                      diffUser={this.state.diffUser}
                      otherUserView={this.otherUserView}
                    />
                  );
                }}
              />
            </Switch>
          </Grid>
        </Grid>
      </Router>
      // </ThemeProvider>
    );
  }

  checkLoginStatus = async () => {
    await axios
      .get("http://127.0.0.1:8000/trelloAPIs/check_login", {
        withCredentials: true,
      })
      .then((response) => {
        console.log(
          "finished checking",
          "response: ",
          response.data.loggedin,
          "state: ",
          this.state.loggedin
        );
        if (response.data.loggedin === true) {
          this.setState({ loggedin: true });
        } else if (
          this.state.loggedin === true &&
          response.data.loggedin === false
        ) {
          this.setState({ loggedin: false });
        } else {
          this.setState({ loggedin: false });
        }
      })
      .catch((error) => {
        console.log("checking error...", error);
      });
  };
  getUser = async () => {
    await axios
      .get("http://127.0.0.1:8000/trelloAPIs/user", { withCredentials: true })
      .then((res) => {
        console.log("user is fetched");
        this.setState({ user: res.data[0] });
      })
      .catch((error) => {
        console.log(error);
      });
  };
}
