import React from "react";
import TextField from "@mui/material/TextField";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import { Grid } from "@mui/material";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";
import { ListItemIcon, ListItemText } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { OutlinedInput } from "@mui/material";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";
import { useHistory } from "react-router";
import { Autocomplete } from "@mui/material";
import { Redirect } from "react-router";
import axios from "axios";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { makeStyles } from "@mui/styles";

import Container from "@mui/material/Container";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};
const useStyles = props => makeStyles((theme) => ({
  container: {
    "&.MuiContainer-root": {
      display: "flex",
      flexDirection: "column",
      justifyContent: props.edit ? "space-between" : "center",
      alignItems: "center",
      width: "100%",
      paddingTop: "10px",
    },
    btnTest: {
      border: "2px solid red !important"
    }
  },
}));
// how to render richtext as filled value in CKEditor
function CreateProject(props) {
  const [title, setTitle] = useState("");
  const [descp, setDescp] = useState("");
  const [members, setMembers] = useState([]);
  const [reg_members, setRegMembers] = useState([]);
  const [errorTitle, setErrorTitle] = useState(false);
  const [errorTitleMsg, setErrorTitleMsg] = useState("");
  const [editMembers, setEditMembers] = useState([]);
  const [open, setOpen] = useState(false);
  const classes = useStyles(props)();

  let csrftoken = null;
  const history = useHistory();
  const getRegisteredMembers = async () => {
    await axios
      .get("http://127.0.0.1:8000/trelloAPIs/users_all/", {
        withCredentials: true,
      })
      .then((res) => {
        console.log(res.data);
        setRegMembers(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(async () => {
    await getRegisteredMembers();
    if (props.edit) {
      setTitle(props.project.title);
      setDescp(props.project.descp);
    }
  }, []);
  useEffect(() => {
    if (props.edit) {
      let mems = [];
      props.project.members.forEach((elem) => {
        // console.log("I am a member ", elem);
        for (let i = 0; i < reg_members.length; i++) {
          if (elem === reg_members[i].id) {
            mems.push(reg_members[i]);
          }
        }
      });
      console.log(mems);
      setEditMembers(mems);
      setMembers(props.project.members);
    }
  }, [reg_members]);
  const handleSelectChange = (event, values) => {
    const member_arr = values.map((item) => item.id);
    setMembers(member_arr);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      setErrorTitle(true);
      setErrorTitleMsg("Required");
      return;
    }
    let data = {
      created_by: props.user.id,
      members: members,
      title: title,
      descp: descp,
      admins: [],
    };
    console.log(data);
    csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    if (!props.edit) {
      props.axiosInstance
        .post("http://127.0.0.1:8000/trelloAPIs/projects/", data, {
          headers: {
            "X-CSRFToken": csrftoken,
            "Content-Type": "application/json",
            "X-Requested-With": "XMLHttpRequest",
          },
        })
        .then((response) => {
          console.log(response.data);
          props.history.push(`/project/${response.data.id}`);
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      data["admins"] = props.project.admins;
      props.axiosInstance
        .put(
          "http://127.0.0.1:8000/trelloAPIs/projects/" + props.project.id + "/",
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
          props.history.push(`/project/${response.data.id}`);

          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          // setAlert(true);
          // setAlertMsg(error);
          alert("Some error occured");
        });
      props.handleClose();
    }
  };
  const handleDelete = async () => {
    setOpen(false);
    csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    console.log("csrftoken now must be validatable");
    props.axiosInstance
      .delete(
        "http://127.0.0.1:8000/trelloAPIs/projects/" + props.project.id + "/",
        {
          withCredentials: true,
          headers: {
            "X-CSRFToken": csrftoken,
          },
        }
      )
      .then((res) => {
        console.log("Project deleted successfully!", res);
        props.history.push("/dashboard");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  if (props.loginStatus) {
    return (
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <Container component="div" className={classes.container}>
          <TextField
            id="filled-basic"
            label="Title"
            variant="outlined"
            color="primary"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={(e) => {
              setTitle(e.target.value);
              // handleCreateCard(e);
            }}
            style={{ width: 400 }}
            value={title}
            error={errorTitle}
            helperText={errorTitleMsg}
          />
          <CKEditor
            editor={ClassicEditor}
            onReady={(editor) => {
              // You can store the "editor" and use when it is needed.
              console.log("Editor is ready to use!", editor);
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setDescp(data);
              console.log({ event, editor, data });
            }}
            data={descp}
          />
          <Autocomplete
            multiple
            id="checkboxes-tags-demo"
            options={reg_members}
            disableCloseOnSelect
            getOptionLabel={(option) => option.username}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                {option.username}
              </li>
            )}
            style={{ width: 400 }}
            value={editMembers}
            onChange={(event, values) => {
              setEditMembers(values);
              handleSelectChange(event, values);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Members"
                placeholder="Members..."
              />
            )}
          />
          <Box
            sx={{
              display: "flex",
              "& > :not(style)": { m: 1, width: "25ch", overflowX: "hidden" },
            }}>
            <Button
              color="primary"
              variant="contained"
              type="submit"
              onClick={handleSubmit}
              className={classes.btnTest}
            >
              {props.edit ? "Update" : "Submit"}
            </Button>
            {props.edit ? (
              <Button
                color="secondary"
                variant="contained"
                type="submit"
                onClick={(e) => {
                  e.preventDefault();
                  setOpen(true);
                }}
                className={classes.btnTest}

              >
                <DeleteIcon />
              </Button>
            ) : null}
          </Box>
        </Container>

        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Project</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this project? All it's lists and
              cards and progress will be lost!!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setOpen(false);
              }}
              variant="contained"
              color="primary"
            >
              No
            </Button>
            <Button
              onClick={handleDelete}
              autoFocus
              variant="contained"
              color="secondary"
            >
              Yes, delete the project
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  } else {
    if (props.done) {
      return <Redirect to="/"></Redirect>;
    } else {
      return <p>Checking login status...</p>;
    }
  }
}

export default CreateProject;
