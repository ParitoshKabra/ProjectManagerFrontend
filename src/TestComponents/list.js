import axios from "axios";
import React from "react";
import { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { makeStyles } from "@mui/styles";
import Typography from "@mui/material/Typography";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { ButtonGroup } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemText } from "@mui/material";
import { ListItemButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import Cookies from "js-cookie";
import ReadMoreIcon from "@mui/icons-material/ReadMore";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@material-ui/core";
import { CreateCard } from "./CreateCard";
const useStyles = makeStyles({
  btn: {
    fontSize: "16px",
    border: "50%",
  },
  container: {
    height: "300px",
    overflow: "auto",
    padding: "15px",
    alignItems: "center",
    padding: "10px 0",
    background: "linear-gradient(to right, #d9a7c7, #fffcdc)",
  },
  card: {
    padding: "8px 4px",
    width: "100%",
    paddingLeft: "10px",
    paddingRight: "10px",
    background: "white",
    "&:hover": {},
  },
  buttonGroup: {
    "&.MuiButtonGroup-root": {
      marginTop: "auto",
    },
  },
});

export const MyList = (props) => {
  const classes = useStyles();
  const [listContent, setlistContent] = useState({});
  const [editCard, setEditCard] = useState(false);
  const [cardUnderEdit, setCardUnderEdit] = useState({});
  const [open, setOpen] = useState(false);
  const [shadow, setShadow] = useState(2);
  const [currCard, setCurrCard] = useState(null);
  const [overflow, setOverFlow] = useState(false);
  const getList = () => {
    axios
      .get("http://127.0.0.1:8000/trelloAPIs/lists/" + props.list.id, {
        withCredentials: true,
      })
      .then((response) => {
        console.log("Inside list");
        console.log(response.data);
        setlistContent(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const deleteList = async () => {
    setOpen(false);
    let csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    console.log(csrftoken);
    Cookies.set("csrftoken", csrftoken);
    console.log("after cookie is set");
    props.axiosInstance
      .delete("http://127.0.0.1:8000/trelloAPIs/lists/" + props.list.id + "/", {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })
      .then((res) => {
        console.log("List deleted successfully!", res);
        props.renderLists();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getList();
  }, []);
  useEffect(() => {
    getList();
  }, [editCard]);

  const EditCard = (card) => {
    setEditCard(true);
    setCardUnderEdit(card);
  };
  const ViewCard = (id) => {
    !props.isDiffUser
      ? props.history.push(`/project/${props.project.id}/${id}`)
      : props.history.push(
          `/project/user/${props.diffUser.id}/${props.project.id}/${id}`
        );
  };

  const handleClose = () => {
    setEditCard(false);
    console.log("Inside handleClose", editCard);
    getList();
  };
  const isOverflown = (ele) => {
    console.log(ele);
    return (
      ele.scrollHeight > ele.clientHeight || ele.scrollWidth > ele.clientWidth
    );
  };
  if (listContent) {
    let cards;
    if (listContent["list_cards"]) {
      cards = listContent.list_cards.map((card) => {
        return (
          <Paper
            elevation={
              currCard === null || currCard.id === card.id ? shadow : 2
            }
            sx={{ width: "99%" }}
          >
            <div>
              <ListItemButton
                className={classes.card}
                key={card.id}
                onMouseOver={() => {
                  setShadow(10);
                  setCurrCard(card);
                }}
                onMouseOut={() => {
                  setCurrCard(null);
                  setShadow(2);
                }}
              >
                <ListItemText primary={card.title} />
                <ButtonGroup variant="outlined">
                  <IconButton
                    variant="outlined"
                    onClick={(e) => {
                      EditCard(card);
                    }}
                    color="secondary"
                    disabled={
                      props.isDiffUser ||
                      (!(card.created_by === props.user.id) &&
                        props.project.admins.indexOf(props.user.id) === -1)
                    }
                  >
                    <EditRoundedIcon />
                  </IconButton>
                  <IconButton
                    variant="outlined"
                    onClick={() => {
                      ViewCard(card.id);
                    }}
                    color="secondary"
                  >
                    <VisibilityIcon />
                  </IconButton>
                </ButtonGroup>
              </ListItemButton>
            </div>
          </Paper>
        );
      });
    } else {
      cards = "Loading cards...";
    }

    return (
      <Stack
        spacing={2}
        className={classes.container}
        justify={"center"}
        onMouseOver={(e) => {
          setOverFlow(isOverflown(e.currentTarget));
        }}
      >
        <Typography variant="h6" gutterBottom align="center">
          {listContent.title}
        </Typography>
        <Stack
          spacing={1.2}
          sx={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            maxHeight: "100%",
          }}
        >
          {cards}
        </Stack>

        <ButtonGroup className={classes.buttonGroup}>
          <IconButton
            color="primary"
            className={classes.btn}
            onClick={() => {
              props.history.push(
                "/createCard/" + props.list.lists_project + "/" + props.list.id
              );
            }}
          >
            <AddCircleIcon />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => {
              setOpen(true);
            }}
            disabled={
              !props.isDiffUser
                ? props.project["admins"].indexOf(props.user.id) === -1
                : !props.user.is_superuser
            }
          >
            <DeleteIcon />
          </IconButton>
          {overflow ? (
            <IconButton
              color="primary"
              className={classes.btn}
              onClick={() => {
                console.log("Will display more items when overflow!!");
              }}
            >
              <ReadMoreIcon />
            </IconButton>
          ) : null}
        </ButtonGroup>
        <Dialog onClose={handleClose} open={editCard}>
          <DialogTitle>Editing Card: {cardUnderEdit.title}</DialogTitle>
          <DialogContent>
            <CreateCard
              {...props}
              edit={editCard}
              card={cardUnderEdit}
              handleClose={handleClose}
            ></CreateCard>
          </DialogContent>
        </Dialog>
        <Dialog
          open={open}
          onClose={() => {
            setOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">Delete List</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this list? All it's cards will be
              lost!!
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
              onClick={deleteList}
              autoFocus
              variant="contained"
              color="secondary"
            >
              Yes, delete the list
            </Button>
          </DialogActions>
        </Dialog>
      </Stack>
    );
  } else {
    return <div>Loading List...</div>;
  }
};
