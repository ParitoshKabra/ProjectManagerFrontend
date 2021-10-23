import React from "react";
import { Project } from "./project";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import { List, ListItem } from "@mui/material";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {},
  standard: {
    "&.MuiListItem-root": {
      boxShadow: "2px 2px 2px 2px rgba(14,15,18,0.8)",
      borderRadius: "8px",
    },
  },
});
export const ProjectTemplate = (props) => {
  const classes = useStyles();

  return (
    <List
      component={"div"}
      sx={{
        maxWidth: 360,
        bgcolor: "background.paper",
        position: "relative",
        overflow: "auto",
        maxHeight: 200,
      }}
      disablePadding
    >
      {props.projects.length === 0
        ? "No projects to display"
        : props.projects.map((project) => {
          return (
            <ListItem
              sx={{ pl: 4 }}
              className={
                project.id === props.activeProject.id ? classes.standard : ""
              }
              key={project.id}
            >
              <Project {...props} project={project} />
            </ListItem>
          );
        })}
    </List>
  );
};
