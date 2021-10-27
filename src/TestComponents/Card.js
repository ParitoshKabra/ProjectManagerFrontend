import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Divider from "@mui/material/Divider";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import List from "@mui/material/List";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Moment from "react-moment";
import Button from "@mui/material/Button";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Grow from "@mui/material/Grow";
import Stack from "@mui/material/Stack";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import Menu from "@mui/material/Menu";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItem from "@mui/material/ListItem";
import Tooltip from "@mui/material/Tooltip";
import { makeStyles } from "@mui/styles";
import Paper from "@mui/material/Paper";
import moment from "moment";
const createDOMPurify = require("dompurify");

const DOMPurify = createDOMPurify(window);
const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: "#ef5350",
    "&.MuiButtonBase-root.MuiButton-root": {
      marginLeft: 0,
    },
  },
  listbtn: {
    "&.MuiButtonBase-root.MuiListItemButton-root": {
      paddingLeft: "5px",
    },
  },
  btnGrp: {
    display: "flex",
    flexDirection: "row",
    width: "auto",
  },
  cmntEdit: {
    border: "2px solid black",
  },
  memBtn: {
    "&.MuiButtonBase-root.MuiButton-root": {
      textTransform: "none",
      borderRadius: 20,
      minWidth: "100px",
      paddingLeft: 0,
      paddingRight: 0,
    },
    "& .MuiButton-label": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  cardSent: {
    "&.MuiList-root": {
      margin: "10px",
      marginLeft: "auto",
    },
  },
  cardNormal: {
    "&.MuiList-root": {
      margin: "10px",
      marginRight: "auto",
    },
  },
  menu: {
    "&.MuiList-root.MuiList-padding.MuiMenu-list": {
      display: "flex",
      flexDirection: "column",
      width: "20ch",
    },
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  const classes = useStyles();
  return !expand ? (
    <Button
      variant="contained"
      color="primary"
      {...other}
      className={classes.btn_test}
    >
      View comments
    </Button>
  ) : (
    <IconButton variant="contained" color="primary" {...other}>
      <CancelIcon />
    </IconButton>
  );
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));
function MyCard(props) {
  const classes = useStyles();
  const [card, setCard] = useState({});
  const [socket, setSocket] = useState(null);
  const [project, setProject] = useState({});
  const [expanded, setExpanded] = React.useState(false);
  const [updateComment, setUpdateComment] = React.useState({});
  const editor_ = React.useRef(null);
  const [comment, setComment] = useState("");
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [testOpen, setTestOpen] = React.useState(-1);
  const open = Boolean(anchorEl);
  const handleCommentClick = (event, id) => {
    setAnchorEl(event.currentTarget);
    setTestOpen(id);
  };
  const handleCommentClose = (e) => {
    setAnchorEl(null);
    setUpdateComment({});
    setTestOpen(-1);
  };
  const handleCommentCloseOnDelete = async (id) => {
    setAnchorEl(null);
    setTestOpen(-1);
    console.log("when deleting: ", id);
    let csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    console.log(csrftoken);
    props.axiosInstance
      .delete("http://127.0.0.1:8000/trelloAPIs/post_comments/" + id + "/", {
        withCredentials: true,
        headers: {
          "X-CSRFToken": csrftoken,
        },
      })
      .then((res) => {
        console.log("Comment deleted successsfully");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const handleCommentCloseOnUpdate = async (id, comment1) => {
    let csrftoken = await axios
      .get("http://127.0.0.1:8000/trelloAPIs/csrf_token", {
        withCredentials: true,
      })
      .then((res) => res.data["csrftoken"])
      .catch((err) => {
        console.log(err);
      });
    console.log(csrftoken);
    const data = {
      commented_by: props.user.id,
      comment_tym: new Date(),
      comment: comment1,
      card_comments: card.id,
    };
    await props.axiosInstance
      .put("http://127.0.0.1:8000/trelloAPIs/post_comments/" + id + "/", data, {
        headers: {
          "X-CSRFToken": csrftoken,
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
      })
      .then((response) => {
        console.log("Update Successful");
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
    handleCommentClose();
    setComment("");
  };
  let timerID = null;
  const ref = React.useRef(card);
  React.useEffect(() => {
    ref.current = card;
  }, [card]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  React.useEffect(async () => {
    let client;
    const connect = () => {
      client = new W3CWebSocket("ws://127.0.0.1:8000/ws/test/");
      client.onopen = () => {
        console.log("connection established!!!!!!!!!!!!!!!!!!!!!!!!!!");
        if (timerID !== null) {
          window.clearInterval(timerID);

          timerID = null;
        }
      };
      client.onmessage = (message) => {
        const card_ = ref.current;
        let msg = JSON.parse(message.data);
        if (msg["info"] === "created") {
          if (Object.keys(card_).length !== 0) {
            card_.comments_in_card.push(msg["comment"]);
            console.log("message received: ", card_);
            setCard({ ...card_ });
          }
        } else if (msg["info"] === "modified") {
          if (Object.keys(card_).length !== 0) {
            console.log("comment modified");
            for (let i = 0; i < card_["comments_in_card"].length; i++) {
              if (card_["comments_in_card"][i].id === msg["comment"]["id"]) {
                card_["comments_in_card"].splice(i, 1);
              }
            }
            card_.comments_in_card.push(msg["comment"]);
            setCard({ ...card_ });
          }
        } else if (msg["info"] === "deleted") {
          if (Object.keys(card_).length !== 0) {
            console.log(
              "comment deleted message received",
              msg["comment"]["id"]
            );
            for (let i = 0; i < card_["comments_in_card"].length; i++) {
              if (card_["comments_in_card"][i].id === msg["comment"]["id"]) {
                card_["comments_in_card"].splice(i, 1);
              }
            }
            setCard({ ...card_ });
          }
        }
      };
      client.onclose = () => {
        if (timerID === null) {
          console.log("Server disconnected");
          timerID = setInterval(connect, 5000);
        }
      };
      client.onerror = (err) => {
        alert("Server errored out with:", err);
      };
      setSocket(client);
    };
    connect();
    await getCard();

    return client.close;
  }, []);

  const getCard = async () => {
    const out_card = await axios
      .get(
        "http://127.0.0.1:8000/trelloAPIs/cards/" + props.match.params.cardId,
        { withCredentials: true }
      )
      .then((res) => {
        console.log("Card: ", res.data);
        return res.data;
      })
      .catch((exception) => {
        console.log(exception);
        return exception;
      });
    setCard(out_card);
    const out_proj = await axios
      .get(
        "http://127.0.0.1:8000/trelloAPIs/projects/" +
          props.match.params.projectId,
        { withCredentials: true }
      )
      .then((res) => {
        return res.data;
      })
      .catch((exception) => {
        console.log(exception);
        return exception;
      });
    setProject(out_proj);
  };

  if (props.loginStatus) {
    let cmnts, members_assigned;
    if (card.hasOwnProperty("comments_in_card")) {
      cmnts = card.comments_in_card.map((cmnt, index) => {
        let sent =
          cmnt.commented_by.id === props.user.id
            ? classes.cardSent
            : classes.cardNormal;
        let currTime = moment(new Date());
        let cmnt_tym = moment(cmnt.comment_tym);
        let updated;
        if (Object.keys(updateComment).length !== 0) {
          updated = updateComment.id === cmnt.id ? classes.cmntEdit : "";
        } else {
          updated = "";
        }
        const cmnt_classes = `${sent} ${updated}`;
        return (
          <Paper
            elevation={4}
            sx={{
              backgroundColor: `${
                cmnt.commented_by.id === props.user.id ? "#84f5c2" : "white"
              }`,
              width: "50%",
              marginLeft: `${
                cmnt.commented_by.id === props.user.id ? "auto" : ""
              }`,
            }}
          >
            <List className={cmnt_classes} key={index.toString()}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: "#f50057" }}>
                    {cmnt.commented_by.username.toUpperCase()[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <React.Fragment>
                      <Typography
                        component={"span"}
                        style={{ fontSize: "16px" }}
                      >
                        {cmnt.commented_by.username}
                      </Typography>
                      <Typography
                        variant="span"
                        color="text.secondary"
                        style={{ marginLeft: "10px", fontSize: "14px" }}
                      >
                        {currTime.diff(cmnt_tym, "days") < 1 ? (
                          moment(cmnt.comment_tym).fromNow()
                        ) : (
                          <Moment format="MMMM Do YYYY, h:mm a">
                            {cmnt_tym}
                          </Moment>
                        )}
                      </Typography>
                    </React.Fragment>
                  }
                  secondary={
                    <React.Fragment>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(cmnt.comment),
                        }}
                      ></Typography>
                    </React.Fragment>
                  }
                />
                {props.user.id === cmnt.commented_by.id ? (
                  <React.Fragment>
                    <IconButton
                      aria-label="more"
                      id="long-Button"
                      aria-controls="long-menu"
                      aria-expanded={open ? "true" : undefined}
                      aria-haspopup="true"
                      onClick={(e) => {
                        handleCommentClick(e, cmnt.id);
                      }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Menu
                      id="long-menu"
                      anchorEl={anchorEl}
                      open={cmnt.id === testOpen}
                      onClose={(e) => {
                        console.log(
                          "closing comment menu",
                          cmnt.id,
                          cmnt.comment
                        );

                        handleCommentClose(e);
                      }}
                      PaperProps={{
                        style: {
                          width: "20ch",
                        },
                      }}
                      MenuListProps={{
                        style: {
                          display: "flex",
                          flexDirection: "column",
                        },
                      }}
                    >
                      <ListItemButton
                        onClick={() => {
                          console.log(
                            "Wish to delete comment",
                            cmnt.comment,
                            cmnt.id
                          );
                          handleCommentCloseOnDelete(cmnt.id);
                        }}
                        className={classes.listbtn}
                      >
                        <ListItemText primary={"Delete"} />
                      </ListItemButton>
                      <ListItemButton
                        onClick={() => {
                          setAnchorEl(null);
                          setTestOpen(-1);
                          setUpdateComment(cmnt);
                          console.log(editor_.current);
                          console.log(cmnt.comment, cmnt.id);
                          window.scrollTo(0, editor_.current.offsetTop);
                        }}
                        className={classes.listbtn}
                      >
                        <ListItemText primary={"Edit"} />
                      </ListItemButton>
                    </Menu>
                  </React.Fragment>
                ) : null}
              </ListItem>
            </List>
          </Paper>
        );
      });
    }
    if (card.hasOwnProperty("assigned_to")) {
      members_assigned = card["assigned_to"].map((mem) => {
        return (
          <Chip
            avatar={
              <Avatar sx={{ bgcolor: red[500] }}>
                {mem.username.toUpperCase()[0]}
              </Avatar>
            }
            label={mem.username}
            variant="outlined"
          />
        );
      });
    }
    let boolDisplay = expanded ? "block" : "none";
    return (
      <Card>
        <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack>
            <Tooltip title="title" placement="left-start">
              <Typography variant="h6" component={"h3"}>
                {card.title}
              </Typography>
            </Tooltip>
          </Stack>
          <Stack>
            <Typography
              sx={{ fontSize: 14, textAlign: "center" }}
              color="text.secondary"
              gutterBottom
            >
              Members Assigned
            </Typography>
            <div className={classes.btnGrp}>{members_assigned}</div>
          </Stack>
        </CardContent>
        {/* <CardMedia
                    component="img"
                    height="194"
                    image="/static/images/cards/paella.jpg"
                    alt="Paella dish"
                /> */}
        <CardContent>
          <Typography
            variant="body2"
            color="text.secondary"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(card["descp"]),
            }}
          ></Typography>
        </CardContent>
        <CardContent>
          <Typography paragraph style={{ color: "red" }}>
            Due by:{" "}
            <Moment format="MMMM Do YYYY, h:mm a">{card.due_date}</Moment>
          </Typography>
        </CardContent>
        <Grow in={expanded}>
          <CardContent
            sx={{ maxHeight: "300px", overflow: "auto", display: boolDisplay }}
          >
            {cmnts}
          </CardContent>
        </Grow>

        <Divider />
        <CardActions disableSpacing sx={{ paddingLeft: "16px" }}>
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          ></ExpandMore>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
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
              <CKEditor
                editor={ClassicEditor}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log("Editor is ready to use!", editor);
                }}
                onChange={(event, editor) => {
                  const data = editor.getData();
                  setComment(data);
                  console.log(event);
                }}
                data={
                  Object.keys(updateComment).length !== 0
                    ? updateComment.comment
                    : comment
                }
                ref={editor_}
                label
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.btn}
                onClick={(e) => {
                  e.preventDefault();
                  if (Object.keys(updateComment).length !== 0) {
                    handleCommentCloseOnUpdate(updateComment.id, comment);
                    return;
                  }
                  const data = {
                    message: {
                      commented_by: props.user.id,
                      comment_tym: new Date(),
                      comment: comment,
                      card_comments: card.id,
                    },
                  };
                  console.log(data["message"], socket);
                  if (socket.readyState === 1) {
                    socket.send(JSON.stringify(data));
                  }
                  setComment("");
                }}
                className={classes.btn_test}
              >
                save
              </Button>
            </Box>
          </CardContent>
        </Collapse>
      </Card>
    );
  } else {
    if (props.done) {
      return <Redirect to="/" />;
    } else {
      return <p>Checking login status...</p>;
    }
  }
}

export default MyCard;
