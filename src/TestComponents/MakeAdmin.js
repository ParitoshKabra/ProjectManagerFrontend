import React from "react";
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import { ListItemIcon } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import AdminPanelSettingsRoundedIcon from "@mui/icons-material/AdminPanelSettingsRounded";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import axios from "axios";
import Cookies from "universal-cookie";

const cookies = new Cookies();
const Demo = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
}));

function MyCheckBox({ option }) {
  const [checked, setChecked] = React.useState(option);
  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          icon={<AdminPanelSettingsRoundedIcon />}
          checkedIcon={<AdminPanelSettingsRoundedIcon />}
          // onChange={(e) => { setChecked(e.target.value) }}
          // inputProps={{
          //     'aria-label': 'make-admin'
          // }}
        />
      }
    />
  );
}

function MakeAdmin(props) {
  const [madeAdmins, setMadeAdmins] = React.useState(props.project.admins);
  const [members, setMembers] = React.useState([]);
  const activeUser = props.isDiffUser ? props.diffUser : props.user;
  const adminStatus = !props.isDiffUser
    ? props.user.id === props.project.created_by ||
      props.project.admins.indexOf(props.user.id) !== -1
    : props.user.is_staff || props.user.is_superuser;
  let csrftoken = null;
  React.useEffect(() => {
    getMembers();
  }, []);
  React.useEffect(() => {
    console.log(members);
  }, [members]);
  const getMembers = async () => {
    const res = await axios
      .get(
        "http://127.0.0.1:8000/trelloAPIs/project_members/" + props.project.id,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    // console.log(fetchUsername(res['members']));
    console.log("members", res["members"]);
    setMembers(res["members"]);
  };
  const handleToggle = (value) => () => {
    console.log("I was clicked", value);
    if (adminStatus) {
      const currentIndex = madeAdmins.indexOf(value);
      const newChecked = [...madeAdmins];

      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      console.log(currentIndex, newChecked);
      setMadeAdmins(newChecked);
    }
  };
  let mems;
  if (members.length !== 0) {
    mems = members.map((item) => {
      const labelId = `checkbox-list-label-${item.id}`;
      return (
        <ListItemButton
          role={undefined}
          onClick={handleToggle(item.id)}
          key={item.id}
          dense
        >
          <ListItemAvatar>
            <Avatar>{<AccountCircleRoundedIcon />}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={item.id !== props.user.id ? item.username : "You"}
            secondary={
              props.project.admins.indexOf(item.id) > -1
                ? item.id === props.project.created_by
                  ? "creator"
                  : "admin"
                : "member"
            }
          />
          <ListItemIcon>
            <Checkbox
              checked={madeAdmins.indexOf(item.id) > -1}
              edge="start"
              tabIndex={-1}
              disableRipple
              inputProps={{ "aria-labelledby": labelId }}
              icon={<AdminPanelSettingsRoundedIcon />}
              checkedIcon={<AdminPanelSettingsRoundedIcon />}
            />
          </ListItemIcon>
        </ListItemButton>
      );
    });
  }
  return (
    <Container xs={12} md={6}>
      <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
        Project Members
      </Typography>
      <Demo>
        <List dense={true}>
          {members.length !== 0 ? mems : <CircularProgress />}
        </List>
        {members.length !== 0 ? (
          <Button
            variant="contained"
            color="secondary"
            onClick={async () => {
              if (
                !adminStatus ||
                (props.isDiffUser &&
                  !(props.user.is_superuser || props.user.is_staff))
              ) {
                props.handleClose();
                return;
              }
              let data = {
                created_by: props.project.created_by,
                members: props.project.members,
                title: props.project.title,
                descp: props.project.descp,
                admins: madeAdmins,
              };
              if (
                activeUser.id === props.project.created_by &&
                madeAdmins.indexOf(activeUser.id) === -1
              ) {
                data.admins.push(activeUser.id);
              }
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
                  "http://127.0.0.1:8000/trelloAPIs/projects/" +
                    props.project.id +
                    "/",
                  data,
                  {
                    headers: {
                      "X-CSRFToken": csrftoken,
                      "Content-Type": "application/json",
                      "X-Requested-With": "XMLHttpRequest",
                    },
                  }
                )
                .then((response) => {
                  console.log("Project details updated successfully!");
                  console.log(response.data);
                })
                .catch((error) => {
                  console.log(error);
                  // setAlert(true);
                  // setAlertMsg(error);
                  alert("Some error occured");
                });
              props.handleClose();
            }}
          >
            {adminStatus ? "SAVE CHANGES" : "CLOSE"}
          </Button>
        ) : null}
      </Demo>
    </Container>
  );
}

export default MakeAdmin;
