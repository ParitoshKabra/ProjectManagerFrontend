import { Button, Typography } from "@mui/material";
import axios from "axios";
import React from "react";
import { Redirect } from "react-router";
import { Sidebar } from "./sidebar";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { deepOrange, deepPurple } from "@mui/material/colors";
import Chip from "@mui/material/Chip";

import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import Checkbox from "@mui/material/Checkbox";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Tooltip from "@mui/material/Tooltip";

import { Container } from "@mui/material";
// Main Component
const createDOMPurify = require("dompurify");

const DOMPurify = createDOMPurify(window);
export class Welcome extends React.Component {
  constructor(props) {
    super(props);
    this.getUserWelcome = this.getUserWelcome.bind(this);
  }
  componentDidMount() {
    this.props.checkLoginStatus();
    this.getUserWelcome();
  }

  getUserWelcome() {
    if (this.props.loginStatus) {
      this.props.getUser();
    } else {
      this.setState({ user: {} });
    }
  }
  render() {
    if (this.props.loginStatus) {
      // Design starts here
      /* Welcome page should set the grid layout and then every component individually should be implemented, like Projects, Comments, Assigned_Cards, and the Dashboard then to be decided at the end*/
      // <h3>Welcome {this.state.user['username']}</h3>
      this.activeUser = !this.props.isDiffUser
        ? this.props.user
        : this.props.diffUser;

      console.log("active user: ", this.activeUser);
      if (Object.keys(this.activeUser).length !== 0) {
        return (
          <Container sx={{ marginTop: "auto", marginBottom: "auto" }}>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                margin: "10px 0",
              }}
            >
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: deepOrange[500] }} aria-label="card">
                    {this.activeUser.username.toUpperCase()[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={this.activeUser.username}
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      >
                        Email
                      </Typography>
                      {": " + this.activeUser.email}
                    </React.Fragment>
                  }
                />
                <Checkbox
                  icon={<AccountCircleIcon />}
                  checkedIcon={<AdminPanelSettingsIcon />}
                  checked={
                    this.activeUser.is_staff || this.activeUser.is_superuser
                  }
                />
              </ListItem>
            </Container>
            <Container
              sx={{ maxHeight: "400px", overflow: "auto", margin: "10px 0" }}
            >
              <Container>
                <Typography variant="h6" paragraph fontWeight={"bold"}>
                  My Projects
                </Typography>
              </Container>
              {this.activeUser.projects_of_user.map((project) => {
                const members = project["members"].map((mem) => {
                  return (
                    <Chip
                      avatar={
                        <Avatar
                          sx={{ bgcolor: deepOrange[500], color: "white" }}
                        >
                          {mem.username.toUpperCase()[0]}
                        </Avatar>
                      }
                      label={mem.username}
                      variant="outlined"
                    />
                  );
                });
                const admins = project["admins"].map((mem) => {
                  return (
                    <Chip
                      avatar={
                        <Avatar
                          sx={{ bgcolor: deepPurple[500], color: "white" }}
                        >
                          {mem.username.toUpperCase()[0]}
                        </Avatar>
                      }
                      label={mem.username}
                      variant="outlined"
                    />
                  );
                });
                return (
                  <Card
                    sx={{ margin: "10px", zIndex: "100" }}
                    variant="outlined"
                    key={project.id}
                  >
                    <CardContent
                      sx={{ display: "flex", justifyContent: "space-between" }}
                    >
                      <Container sx={{ textAlign: "start" }}>
                        <Tooltip title="Role" placement="left-start">
                          <Typography gutterBottom variant="h6" component="div">
                            {project.admins.indexOf(this.activeUser.id) > -1
                              ? "Project-Admin"
                              : "Project-Member"}
                          </Typography>
                        </Tooltip>
                      </Container>
                      <Container sx={{ textAlign: "end" }}>
                        <Tooltip title="Title" placement="right-start">
                          <Typography gutterBottom variant="h5" component="div">
                            {project.title}
                          </Typography>
                        </Tooltip>
                      </Container>
                    </CardContent>

                    <CardContent>
                      <Container>
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography
                              sx={{ fontSize: 14 }}
                              color="text.secondary"
                              gutterBottom
                            >
                              Project Description
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              variant="body2"
                              paragraph
                              dangerouslySetInnerHTML={{
                                __html: DOMPurify.sanitize(project["descp"]),
                              }}
                            />
                          </AccordionDetails>
                        </Accordion>
                      </Container>
                    </CardContent>
                    <CardContent>
                      <Container>
                        <Typography color="text.secondary" gutterBottom>
                          Members
                        </Typography>
                        {members}
                      </Container>
                    </CardContent>
                    <CardContent>
                      <Container>
                        <Typography color="text.secondary" gutterBottom>
                          Admins
                        </Typography>
                        {admins}
                      </Container>
                    </CardContent>
                    <CardContent>
                      <Container
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Button
                          size="small"
                          variant="contained"
                          style={{ backgroundColor: "#ff0d51", color: "white" }}
                          onClick={() => {
                            !this.props.isDiffUser
                              ? this.props.history.push(
                                  `/project/${project.id}`
                                )
                              : this.props.history.push(
                                  `/project/user/${this.props.diffUser.id}/${project.id}`
                                );
                          }}
                        >
                          Detail
                        </Button>
                      </Container>
                    </CardContent>
                  </Card>
                );
              })}
            </Container>
          </Container>
        );
      } else {
        return <p>Loading projects....</p>;
      }
    } else {
      if (this.props.done === true) {
        return <Redirect to="/" />;
      } else {
        return <p>Checking login status....</p>;
      }
    }
  }
}
