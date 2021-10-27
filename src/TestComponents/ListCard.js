import React from "react";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";
import Button from "@mui/material/Button";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import Moment from "react-moment";
import Typography from "@mui/material/Typography";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";
import { CreateCard } from "./CreateCard";
const createDOMPurify = require("dompurify");

const DOMPurify = createDOMPurify(window);
function ListCard(props) {
  const [list, setList] = React.useState(null);
  const [cardUnderEdit, setCardUnderEdit] = React.useState(null);
  const [editCard, setEditCard] = React.useState(false);
  const [delCard, setDeleteCard] = React.useState(null);
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setEditCard(false);
    setCardUnderEdit(null);
    console.log("Inside handleClose", editCard);
    getList();
  };

  const handleDeleteClose = () => {
    setOpen(false);
  };

  const deleteCard = async (card) => {
    handleDeleteClose();
    const csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    props.axiosInstance
      .delete("http://127.0.0.1:8000/trelloAPIs/cards/" + card.id + "/", {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })
      .then((res) => {
        console.log("Card deleted successsfully");
        setDeleteCard(null);
        getList();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getList = () => {
    console.log("getting list...");
    axios
      .get(
        "http://127.0.0.1:8000/trelloAPIs/lists/" + props.match.params.listId,
        {
          withCredentials: true,
        }
      )
      .then((response) => {
        console.log("Inside list", response.data);
        setList(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };
  React.useEffect(() => {
    getList();
  }, []);

  return (
    <Grid
      container
      spacing={1}
      height={"100%"}
      sx={{ maxHeight: "100%", overflow: "auto" }}
    >
      {list !== null ? (
        list["list_cards"].map((card, index) => {
          return (
            <Grid item key={index} sm={4} xs={12}>
              <Paper elevation={3}>
                <List>
                  <ListItem>
                    <Tooltip title="title" placement="top">
                      <Typography variant="h6" component="h2">
                        {card.title}
                      </Typography>
                    </Tooltip>
                  </ListItem>
                  <ListItem>
                    <Accordion style={{ width: "100%" }}>
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
                          Detail
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography
                          variant="body2"
                          paragraph
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(card["descp"]),
                          }}
                        />
                      </AccordionDetails>
                    </Accordion>
                  </ListItem>
                  <ListItem
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                  >
                    <Typography component="div">Due by:</Typography>
                    <Typography component="div" style={{ color: "red" }}>
                      <Moment format="MMMM Do YYYY, h:mm a">
                        {card.due_date}
                      </Moment>
                    </Typography>
                  </ListItem>
                  <ListItem
                    style={{ display: "flex", justifyContent: "space-between" }}
                  >
                    <Button
                      variant="outlined"
                      startIcon={<EditRoundedIcon />}
                      color="primary"
                      onClick={() => {
                        setEditCard(true);
                        setCardUnderEdit(card);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<DeleteIcon />}
                      color="secondary"
                      onClick={() => {
                        setOpen(true);
                        setDeleteCard(card);
                      }}
                    >
                      Delete
                    </Button>
                  </ListItem>
                </List>
              </Paper>
            </Grid>
          );
        })
      ) : (
        <p>Loading cards...</p>
      )}
      {cardUnderEdit !== null ? (
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
      ) : null}
      <Dialog
        open={open}
        onClose={handleDeleteClose}
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
          <Button
            onClick={handleDeleteClose}
            variant="contained"
            color="primary"
          >
            No
          </Button>
          <Button
            onClick={() => {
              deleteCard(delCard);
            }}
            autoFocus
            variant="contained"
            color="secondary"
          >
            Yes, delete the card
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ListCard;
