import React from "react";
import TextField from "@mui/material/TextField";
import { MenuItem } from "@mui/material";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import { Checkbox } from "@mui/material";
import { ListItemIcon, ListItemText } from "@mui/material";
import { Box } from "@mui/material";
import { useState, useEffect } from "react";
import axios from "axios";
import { OutlinedInput } from "@mui/material";
import Cookies from "universal-cookie";
import { useHistory } from "react-router";
import { ButtonGroup } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ckeditor.css";
import {
  DialogTitle,
  DialogActions,
  Dialog,
  DialogContent,
  DialogContentText,
} from "@material-ui/core";
import { Alert } from "@mui/material";
import { Redirect } from "react-router-dom";
import Autocomplete from "@mui/material/Autocomplete";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import Moment from "react-moment";
import moment from "moment";
const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;
const cookies = new Cookies();

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

export const CreateCard = (props) => {
  // const [card, setcard] = useState({"card_list"})
  const [title, setTitle] = useState("");
  const [errorTitle, setErrorTitle] = useState(false);
  const [errormsg, setErrorMsg] = useState("");
  const [alertMsg, setAlertMsg] = useState("");
  const [alert1, setAlert] = useState(false);
  const [descp, setDescp] = useState("none");
  const [completed, setCompleted] = useState(false);
  const [datetime, setDateTime] = useState(
    moment(new Date()).add(5, "days").format("YYYY-MM-DDTHH:mm")
  );
  const [assigned_to, setAssigned_to] = useState([]);
  const [members, setMembers] = useState([]);
  const [editMembers, setEditMembers] = useState([]);
  const [open, setOpen] = useState(false);
  // created_by, list
  const [errorassign, setErrorAssign] = useState(false);
  let csrftoken = null;
  const history = useHistory();
  const checkEdit = (mems) => {
    console.log("Ia m checkEdit", props.edit, props.card);
    if (props.edit) {
      console.log(props.card);
      setTitle(props.card["title"]);
      setCompleted(props.card["completed"]);
      setDescp(props.card["descp"]);
      setAssigned_to(props.card["assigned_to"]);
      let date_ = moment(props.card["due_date"]).format("YYYY-MM-DDTHH:mm");
      console.log(date_);
      setDateTime(date_);
      if (mems !== undefined) {
        let array = [];
        props.card["assigned_to"].forEach((elem) => {
          for (let index = 0; index < mems.length; index++) {
            if (elem === mems[index].id) {
              array.push(mems[index]);
            }
          }
        });
        setEditMembers(array);
      }
    }
  };
  const handleCreateCard = async (e) => {
    setErrorTitle(false);
    setErrorMsg("");
    let title_proxy = e.target.value;
    // console.log(title, descp);
    let list_id;
    if (props.edit) {
      list_id = props.card["cards_list"];
    } else {
      list_id = props.match.params.id;
    }
    console.log("list id: ", list_id);
    const res = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/lists/" + list_id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("titles in lists", response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    if (title_proxy === "") {
      setErrorTitle(true);
    }
    res.list_cards.forEach((item) => {
      if (title_proxy === item.title) {
        if (!props.edit || title_proxy !== props.card.title) {
          setErrorMsg("Choose a different title");
          setErrorTitle(true);
        }
      }
    });
  };

  const getMembers = async () => {
    console.log(props.edit, props);
    let projectid;
    if (props.edit) {
      console.log("came here", props.match.params);
      projectid = props.match.params.id;
    } else {
      projectid = props.match.params.projectid;
    }
    console.log("projectid", projectid);
    const res = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/project_members/" + projectid, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("members", response.data);
        return response.data;
      })
      .catch((error) => {
        console.log(error);
        return error;
      });
    // console.log(fetchUsername(res['members']));
    setMembers(res["members"]);
    checkEdit(res["members"]);
  };

  useEffect(() => {
    console.log("UseEffect is called");
    getMembers();
    checkEdit();
    props.getUser();
  }, []);

  const deleteCard = async (e) => {
    handleClose();
    props.handleClose();
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
      .delete("http://127.0.0.1:8000/trelloAPIs/cards/" + props.card.id + "/", {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })
      .then((res) => {
        console.log("Card deleted successsfully");
        props.handleClose();
      })
      .catch((error) => {
        console.log(error);
        setAlert(true);
        setAlertMsg(error);
      });
  };
  const handleSelectChange = (event, values) => {
    setErrorAssign(false);
    if (values.length === 0) {
      setErrorAssign(true);
    }
    // setAssigned_to(event.target.value);
    let assign_list = values.map((item) => item.id);
    setAssigned_to(assign_list);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title === "") {
      setErrorMsg("Required");
      setErrorTitle(true);
    }
    if (assigned_to.length === 0) {
      setErrorAssign(true);
    }
    if (!errorassign && !errorTitle) {
      let data = {
        cards_list: props.match.params.id,
        created_by: props.user.id,
        assigned_to: assigned_to,
        title: title,
        descp: descp,
        due_date: datetime,
        completed: completed,
        completed_time: new Date(),
      };
      console.log("came here before getting csrftoken");
      csrftoken = await axios
        .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
          withCredentials: true,
        })
        .then((res) => {
          console.log(res.data);
          return res.data["csrftoken"];
        })
        .catch((err) => {
          console.log(err);
        });
      if (csrftoken === undefined) {
        alert("Logout and re-authorize :|");
      }
      if (!props.edit) {
        props.axiosInstance
          .post("http://127.0.0.1:8000/trelloAPIs/cards/", data, {
            headers: {
              "X-CSRFToken": csrftoken,
              "Content-Type": "application/json",
              "X-Requested-With": "XMLHttpRequest",
            },
          })
          .then((response) => {
            history.goBack();
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        data.cards_list = props.card["cards_list"];
        console.log("csrftoken", csrftoken, data);
        props.axiosInstance
          .put(
            "http://127.0.0.1:8000/trelloAPIs/cards/" + props.card.id + "/",
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
            console.log("Update Successful");
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
            setAlert(true);
            setAlertMsg(error);
          });
        props.handleClose();
      }
    }
  };
  const handleClose = (e) => {
    console.log("Closing the card");
    setOpen(false);
  };
  if (props.loginStatus) {
    return (
      <Box
        component="form"
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          "& > :not(style)": { m: 1, width: "25ch" },
        }}
        noValidate
        autoComplete="off"
      >
        <TextField
          id="filled-basic"
          label="Title"
          variant="outlined"
          color="secondary"
          InputLabelProps={{
            shrink: true,
          }}
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            handleCreateCard(e);
          }}
          style={{ width: 400 }}
          error={errorTitle}
          helperText={errormsg}
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
        <TextField
          id="datetime-local"
          label="Due-Date"
          type="datetime-local"
          InputLabelProps={{
            shrink: true,
          }}
          value={datetime}
          variant="outlined"
          color="secondary"
          style={{ width: 400 }}
          onChange={(e) => {
            setDateTime(e.target.value);
          }}
        />

        <Autocomplete
          multiple
          id="checkboxes-tags-demo"
          options={members}
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
              label="Checkboxes"
              placeholder="Members..."
            />
          )}
        />
        <div>
          <Checkbox
            icon={icon}
            checkedIcon={checkedIcon}
            style={{ marginRight: 8 }}
            checked={completed}
            disabled={!props.edit}
            onChange={(e) => {
              setCompleted(!completed);
            }}
          />
          {"completed?"}
        </div>
        <ButtonGroup>
          <Button
            variant="contained"
            color="secondary"
            type="submit"
            onClick={handleSubmit}
          >
            {props.edit ? "Update" : "Submit"}
          </Button>
          <Button
            startIcon={<DeleteIcon />}
            onClick={() => {
              setOpen(true);
            }}
            disabled={
              !props.edit ||
              props.user.id !== props.card.created_by ||
              props.isDiffUser
            }
          />
        </ButtonGroup>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete Card</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this card?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} variant="contained" color="primary">
              No
            </Button>
            <Button
              onClick={deleteCard}
              autoFocus
              variant="contained"
              color="secondary"
            >
              Yes, delete the card
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      //ui
    );
  } else {
    if (props.done) {
      return <Redirect to="/" />;
    } else {
      return <p>Checking login status ....</p>;
    }
  }
};
