import React from "react";
import { Redirect } from "react-router";
import CreateList from "./CreateList";
import Button from "@mui/material/Button";
import axios from "axios";
import { MyList } from "./list";
import { Grid } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { Typography, Container } from "@mui/material";
import { withStyles } from "@mui/styles";
import CreateProject from "./CreateProject";
import { DialogTitle, Dialog, DialogContent } from "@mui/material/";
import MakeAdmin from "./MakeAdmin";
import PeopleIcon from "@mui/icons-material/People";
const styles = (theme) => ({
  btn: {
    "&.MuiButtonBase-root.MuiButton-root": {
      borderRadius: "100%",
      width: "60px",
      height: "60px",
      margin: "10px 5px",
    },
  },
  btnGrp: {
    display: "flex",
    justifyContent: "flex-end",
    width: "95%",
  },
  container: {
    // display: "flex",
    // flexDirection: "column",
    position: "relative",
    height: "100%",
  },
});
class ListProject extends React.Component {
  constructor(props) {
    super(props);
    this.state = { projectContent: null, editProject: false, editAdmin: false };
    this.renderLists = this.renderLists.bind(this);
    this.handleCloseProjectEdit = this.handleCloseProjectEdit.bind(this);
    this.handleCloseMakeAdmin = this.handleCloseMakeAdmin.bind(this);
  }
  handleCloseMakeAdmin() {
    this.setState({ editAdmin: false }, this.renderLists);
  }
  componentDidMount() {
    this.props.checkLoginStatus();
    this.props.getUser();
    this.renderLists();
  }
  async componentWillReceiveProps(nextProps) {
    if (this.props.match.params.id !== nextProps.match.params.id) {
      console.log("entered inside this if damn ");
      await this.props.checkLoginStatus();
      await this.props.getUser();
      await this.renderLists();
    }
  }
  renderLists() {
    console.log("I was triggered!!");
    axios
      .get(
        "http://127.0.0.1:8000/trelloAPIs/projects/" +
          this.props.match.params.id,
        { withCredentials: true }
      )
      .then((response) => {
        console.log(
          "I got a response of project in listproject: ",
          response.data
        );
        this.setState({ projectContent: response.data });
      })
      .catch((error) => {
        console.log(error);
      });
  }
  handleCloseProjectEdit() {
    this.setState({ editProject: false }, this.renderLists);
  }
  render() {
    const { classes } = this.props;
    if (this.props.loginStatus) {
      if (this.state.projectContent) {
        return (
          <React.Fragment>
            <Container
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "1% 0",
              }}
            >
              <Typography variant="h5" component="h5">
                {this.state.projectContent.title}
              </Typography>
              <CreateList
                {...this.props}
                project={this.state.projectContent}
                renderLists={this.renderLists}
              ></CreateList>
            </Container>
            <Grid container spacing={2}>
              {this.state.projectContent["project_lists"].map((list) => {
                return (
                  <Grid item xs={6} md={4} key={list.id}>
                    <MyList
                      {...this.props}
                      list={list}
                      project={this.state.projectContent}
                      renderLists={this.renderLists}
                    />
                  </Grid>
                );
              })}
            </Grid>
            <div className={classes.btnGrp}>
              <Button
                color="primary"
                variant="contained"
                className={classes.btn}
                onClick={() => {
                  this.setState({ editProject: true });
                }}
                disabled={
                  !this.props.isDiffUser
                    ? this.state.projectContent.admins.indexOf(
                        this.props.user.id
                      ) === -1
                    : true
                }
              >
                <EditIcon />
              </Button>
              <Button
                color="secondary"
                variant="contained"
                className={classes.btn}
                onClick={(e) => {
                  this.setState({ editAdmin: true });
                }}
              >
                <PeopleIcon />
              </Button>
            </div>

            <Dialog
              onClose={this.handleCloseProjectEdit}
              open={this.state.editProject}
              style={{ minWidth: 450, maxWidth: 600 }}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <DialogTitle>Edit Project</DialogTitle>
              <DialogContent>
                <CreateProject
                  {...this.props}
                  edit={this.state.editProject}
                  project={this.state.projectContent}
                  handleClose={this.handleCloseProjectEdit}
                ></CreateProject>
              </DialogContent>
            </Dialog>
            <Dialog
              onClose={this.handleCloseMakeAdmin}
              open={this.state.editAdmin}
            >
              <DialogContent>
                <MakeAdmin
                  {...this.props}
                  edit={this.state.editAdmin}
                  project={this.state.projectContent}
                  handleClose={this.handleCloseMakeAdmin}
                ></MakeAdmin>
              </DialogContent>
            </Dialog>
          </React.Fragment>
          // <React.Fragment>
          // <Container className={classes.container}>
          //
          //
          // </React.Fragment>
        );
      } else {
        return <p>Loading Lists...</p>;
      }
    } else {
      console.log(this.props.done, this.props.loginStatus);
      if (this.props.done) {
        return <Redirect to="/" />;
      } else {
        return <p>Checking login status...</p>;
      }
    }
  }
}
export default withStyles(styles)(ListProject);
