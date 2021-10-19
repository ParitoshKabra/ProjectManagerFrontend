import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { Checkbox, IconButton, Button } from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { red } from "@mui/material/colors";
import { makeStyles } from "@mui/styles";
import axios from "axios";
import { Container } from "@mui/material";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import PersonIcon from "@mui/icons-material/Person";
const useStyles = makeStyles((theme) => ({
  member: {
    border: "2px solid #dde0eb",
    margin: "10px",
    borderRadius: "8px",
    boxShadow: "2px 2px 2px 2px rgba(14, 15, 18, 0.15)",
    zIndex: "1000",
  },
  btn: {
    background: "linear-gradient(to right, #fc4a1a, #f7b733)",
  },
}));

function Members(props) {
  const [users, setUsers] = React.useState([]);
  let csrftoken = null;
  React.useEffect(() => {
    getMembers();
  }, []);
  const getMembers = () => {
    axios
      .get("http://127.0.0.1:8000/trelloAPIs/users_all/", {
        withCredentials: true,
      })
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log("Error fetching users", err);
      });
  };
  const classes = useStyles();

  return (
    <List
      sx={{
        width: "90%",
        bgcolor: "background.paper",
        marginLeft: "auto",
        marginRight: "auto",
      }}
    >
      {users.map((user) => (
        <Container className={classes.member} key={user.id}>
          <ListItem alignItems="flex-start">
            <ListItemAvatar>
              <Avatar sx={{ bgcolor: red[500] }} aria-label="card">
                {user.username.toUpperCase()[0]}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={
                props.user.id === user.id
                  ? user.username + " (me) "
                  : user.username
              }
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
                  {": " + user.email}
                </React.Fragment>
              }
            />
            <Checkbox
              icon={<AccountCircleIcon />}
              checkedIcon={<AdminPanelSettingsIcon />}
              checked={user.is_staff || user.is_superuser}
              onClick={async (e) => {
                if (
                  props.user.id === user.id ||
                  !(props.user.is_staff || props.user.is_superuser)
                ) {
                  return;
                }
                let data = {
                  is_staff: !user.is_staff,
                  is_superuser: user.is_superuser,
                  is_active: user.is_active,
                  email: user.email,
                };
                csrftoken = await axios
                  .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
                    withCredentials: true,
                  })
                  .then((res) => res.data["csrftoken"])
                  .catch((err) => {
                    console.log(err);
                  });
                console.log(csrftoken);
                props.axiosInstance
                  .put(
                    "http://127.0.0.1:8000/trelloAPIs/user/" + user.id + "/",
                    data,
                    {
                      withCredentials: true,
                      headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                      },
                    }
                  )
                  .then((res) => {
                    console.log("user status changed successfully");
                    getMembers();
                  })
                  .catch((err) => {
                    alert(err);
                    console.log(err);
                  });
              }}
            />
          </ListItem>
          <Divider />
          <ListItem
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={async () => {
                if (user.id !== props.user.id) {
                  await props.otherUserView(user.id);
                  props.history.push("/dashboard/" + "user/" + user.id);
                } else {
                  props.history.push("/dashboard");
                }
              }}
              className={classes.btn}
            >
              View Projects
            </Button>
            <IconButton
              color="info"
              children={
                user.is_staff ? (
                  props.user.is_superuser ? (
                    !user.is_active ? (
                      <PersonOffIcon />
                    ) : (
                      <PersonIcon />
                    )
                  ) : null
                ) : !user.is_active ? (
                  <PersonOffIcon />
                ) : (
                  <PersonIcon />
                )
              }
              disabled={!(props.user.is_staff || props.user.is_superuser)}
              onClick={async () => {
                if (props.user.id === user.id) {
                  return;
                }
                if (user.is_staff || user.is_superuser) {
                  if (!props.user.is_superuser) {
                    return;
                  }
                }
                let data = {
                  is_staff: user.is_staff,
                  is_superuser: user.is_superuser,
                  is_active: !user.is_active,
                  email: user.email,
                };
                csrftoken = await axios
                  .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
                    withCredentials: true,
                  })
                  .then((res) => res.data["csrftoken"])
                  .catch((err) => {
                    console.log(err);
                  });
                console.log(csrftoken);
                props.axiosInstance
                  .put(
                    "http://127.0.0.1:8000/trelloAPIs/user/" + user.id + "/",
                    data,
                    {
                      withCredentials: true,
                      headers: {
                        "X-CSRFToken": csrftoken,
                        "Content-Type": "application/json",
                        "X-Requested-With": "XMLHttpRequest",
                      },
                    }
                  )
                  .then((res) => {
                    getMembers();
                  })
                  .catch((err) => {
                    alert(err);
                    console.log(err);
                  });
              }}
            ></IconButton>
          </ListItem>
        </Container>
      ))}
    </List>
  );
}

export default Members;
// warning on enable or disable of an user.
// disbaled listItem
