import React from "react";
import { ProjectTemplate } from "./projectTemplate";
import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LogoutIcon from "@mui/icons-material/Logout";
import { Divider } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useLocation } from "react-router-dom";
import axios from "axios";
// Main Component

import { alpha, styled } from "@mui/material/styles";
const useStyles = makeStyles((theme) => ({
  list: {
    height: "8%",
    maxHeight: "10%",
    minHeight: "5%",
  },
  active: {
    color: "rgb(25, 118, 210)",
    backgroundColor: "rgba(0, 0, 0, 0.10)",
  },
}));
const regex = new RegExp("^/(project|createCard)/[0-9]+(/[0-9]+)?$");
export const Sidebar = (props) => {
  const location = useLocation();
  const [activeItem, setactiveItem] = React.useState({});
  const [role, setRole] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  let activeUser = props.isDiffUser ? props.diffUser : props.user;
  React.useEffect(async () => {
    activeUser = props.isDiffUser ? props.diffUser : props.user;
    if (regex.test(location.pathname)) {
      let s = location.pathname.split("/");
      if (s[1] === "project" || s[1] === "createCard") {
        console.log("called refresh!!");
        await getActiveProjectOnRefresh(s[2]);
      }
    } else if (
      location.pathname.startsWith("/project/user/") ||
      location.pathname.startsWith("/project/list/")
    ) {
      getActiveProjectOnRefresh(location.pathname.split("/")[4]);
    } else if (location.pathname.startsWith("/dashboard")) {
      console.log("Inside sidebar, setting dashboard");
      setactiveItem({ temp: "Dashboard" });
    } else if (location.pathname.startsWith("/cards")) {
      setactiveItem({ temp: "Assigned Cards" });
    } else if (location.pathname.startsWith("/createProject")) {
      setactiveItem({ temp: "New Project" });
    } else if (location.pathname.startsWith("/members")) {
      setactiveItem({ temp: "Trello Users" });
    } else {
      setactiveItem({ temp: "" });
    }
    props.getUser();
  }, [location, props.diffUser]);

  React.useEffect(async () => {
    console.log(activeItem);
    if (Object.keys(activeItem).length !== 0) {
      if (!props.isDiffUser) await props.getUser();
      getStatusForActiveItem();
    }
  }, [activeItem]);

  const handleClick = () => {
    const new_state = !open;
    setOpen(new_state);
    if (!activeItem.hasOwnProperty("created_by")) {
      setactiveItem({ temp: "Projects" });
    }
  };
  const setAsActive = (project) => {
    console.log("setting active project", project);
    setactiveItem(project);
  };
  const getStatusForActiveItem = async () => {
    console.log(activeItem.created_by, activeUser.id);

    if (activeItem.hasOwnProperty("temp")) {
      if (activeItem["temp"] === "Dashboard") {
        const appRole = activeUser.is_staff ? "App-Admin" : "App-User";
        setRole(appRole);
      } else {
        setRole(activeItem["temp"]);
      }
    } else if (activeItem.created_by === activeUser.id) {
      setRole("Project-Creator");
    } else if (activeItem.admins.indexOf(activeUser.id) != -1) {
      setRole("Project-Admin");
    } else if (activeItem.members.indexOf(activeUser.id) !== -1) {
      setRole("Project-Member");
    } else {
      setRole("Trello App");
    }
  };
  const getActiveProjectOnRefresh = async (id) => {
    console.log("I was called!!", id);
    axios
      .get("http://127.0.0.1:8000/trelloAPIs/projects/" + parseInt(id), {
        withCredentials: true,
      })
      .then((response) => {
        console.log("getting response in sidebar on refresh");

        setactiveItem(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <List
      sx={{
        width: "100%",
        bgcolor: "background.paper",
        display: "flex",
        flexDirection: "column",
        zIndex: 1,
        height: "100%",
        maxHeight: "100%",
        boxShadow: "2px 2px 2px 2px rgba(14, 15, 18, 0.15)",
      }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" id="nested-list-subheader">
          {role}
        </ListSubheader>
      }
    >
      <ListItemButton
        onClick={() => {
          props.history.push("/dashboard");
          setactiveItem({ temp: "DashBoard" });
        }}
        className={`${classes.list} ${
          role.startsWith("App") ? classes.active : null
        }`}
      >
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton
        onClick={() => {
          !props.isDiffUser
            ? props.history.push("/cards")
            : props.history.push(`/cards/user/${props.diffUser.id}`);
          setactiveItem({ temp: "Assigned Cards" });
        }}
        className={`${classes.list} ${
          role.startsWith("Assigned Cards") ? classes.active : null
        }`}
      >
        <ListItemText primary="Assigned Cards" />
      </ListItemButton>
      <ListItemButton
        onClick={handleClick}
        className={`${classes.list} ${
          role.startsWith("Project") ? classes.active : null
        }`}
      >
        <ListItemIcon>
          <AccountTreeIcon />
        </ListItemIcon>
        <ListItemText primary="Projects" />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      {/* how to add overflow-scroll feature */}
      <List>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <ProjectTemplate
            {...props}
            projects={activeUser["projects_of_user"]}
            setAsActive={setAsActive}
            activeProject={activeItem}
          />
        </Collapse>
      </List>

      {!props.isDiffUser ? (
        <ListItemButton
          variant="contained"
          color="primary"
          onClick={() => {
            props.history.push("/createProject");
          }}
          className={`${classes.list} ${
            role.startsWith("New") ? classes.active : null
          }`}
        >
          <ListItemText primary="Create New Project" />
        </ListItemButton>
      ) : null}
      {!props.isDiffUser ? (
        <ListItemButton
          variant="contained"
          color="primary"
          onClick={() => {
            props.history.push("/members");
          }}
          className={`${classes.list} ${
            role.endsWith("Users") ? classes.active : null
          }`}
        >
          <ListItemText primary="All Users" />
        </ListItemButton>
      ) : (
        <ListItemButton
          variant="contained"
          color="primary"
          onClick={async () => {
            await props.otherUserView();
            props.history.push("/dashboard");
          }}
          className={`${classes.list} ${
            role.endsWith("Users") ? classes.active : null
          }`}
        >
          <ListItemText primary="Your Profile" />
        </ListItemButton>
      )}

      <ListItemButton
        onClick={async () => {
          axios
            .get("http://127.0.0.1:8000/trelloAPIs/logout", {
              withCredentials: true,
            })
            .then((response) => {
              props.checkLoginStatus();
              props.history.push("/");
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        variant="contained"
        sx={{ marginTop: "auto" }}
        className={classes.list}
      >
        <Divider />
        <ListItemIcon>
          <LogoutIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" />
      </ListItemButton>
    </List>
  );
};

// login page
// comments itna bada nahi rakhna
// popovers
// refresh styles
// themeing, colors
// accordion
// material comments
// dashboard Cards, Projects //Menu
// margins -comments
// draggable cards
