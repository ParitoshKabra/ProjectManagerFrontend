import axios from "axios";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import { Divider } from "@material-ui/core";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { red } from "@mui/material/colors";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Moment from "react-moment";
import { Button } from "@material-ui/core";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Box } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Grow from "@mui/material/Grow";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const createDOMPurify = require("dompurify");

const DOMPurify = createDOMPurify(window);
const useStyles = makeStyles((theme) => ({
  btn: {
    backgroundColor: "#ef5350",
    "&.MuiButtonBase-root.MuiButton-root": {
      marginLeft: 0,
    },
  },
  cardSent: {
    "&.MuiPaper-root.MuiCard-root": {
      margin: "10px",
      marginLeft: "auto",
      maxWidth: "345px",
      backgroundColor: "#84f5c2",
    },
  },
  cardNormal: {
    "&.MuiPaper-root.MuiCard-root": {
      margin: "10px",
      marginRight: "auto",
      maxWidth: "345px",
    },
  },
}));

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return !expand ? (
    <Button variant="contained" color="primary" {...other}>
      View comments
    </Button>
  ) : (
    <Button variant="contained" color="primary" {...other}>
      <CancelIcon />
    </Button>
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
  const [comment, setComment] = useState("");
  const ref = React.useRef(card);
  React.useEffect(() => {
    ref.current = card;
  }, [card]);
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  React.useEffect(async () => {
    const client = new W3CWebSocket("ws://127.0.0.1:8000/ws/test/");
    client.onopen = () => {
      console.log("Websocket Connection established");
    };
    client.onmessage = (message) => {
      const card_ = ref.current;
      console.log("Server responded with a message: ", message);
      let msg = JSON.parse(message.data);
      // analyze(msg);
      if (msg.hasOwnProperty("comment")) {
        console.log("entered to print cmment: ", msg.comment, card_);
        if (Object.keys(card_).length !== 0) {
          card_.comments_in_card.push(msg["comment"]);
          console.log(card_);
          setCard({ ...card_ });
        }
      }
    };
    client.onclose = () => {
      console.log("Server disconnected");
    };
    client.onerror = (err) => {
      alert("Server errored out with:", err);
    };
    setSocket(client);
    await getCard();

    return client.onclose;
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
    let cmnts;
    if (card.hasOwnProperty("comments_in_card")) {
      cmnts = card.comments_in_card.map((cmnt) => (
        <Card
          className={
            cmnt.commented_by.id === props.user.id
              ? classes.cardSent
              : classes.cardNormal
          }
          key={cmnt.id}
        >
          <CardHeader
            avatar={
              <Avatar sx={{ bgcolor: red[500] }} aria-label="card">
                {cmnt.commented_by.username[0]}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={cmnt.commented_by.username}
          />
          <CardContent>
            <Typography
              variant="body2"
              color="text.secondary"
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(cmnt.comment),
              }}
            ></Typography>
          </CardContent>
        </Card>
      ));
    }
    let boolDisplay = expanded ? "block" : "none";
    return (
      <Card>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: red[500] }} aria-label="card">
              R
            </Avatar>
          }
          action={
            <IconButton aria-label="settings">
              <MoreVertIcon />
            </IconButton>
          }
          title={card.title}
        />
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
        <CardActions disableSpacing>
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
                  console.log({ event, editor, data });
                }}
                data={comment}
                label
              />
              <Button
                type="submit"
                variant="contained"
                className={classes.btn}
                onClick={(e) => {
                  e.preventDefault();
                  const data = {
                    message: {
                      commented_by: props.user.id,
                      commented_tym: new Date(),
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
