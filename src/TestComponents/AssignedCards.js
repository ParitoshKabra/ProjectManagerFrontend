import React from 'react'
import { Redirect } from 'react-router';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Moment from 'react-moment';
import { Container } from '@mui/material';
const createDOMPurify = require('dompurify');

const DOMPurify = createDOMPurify(window);
function AssignedCards(props) {
    if (props.loginStatus) {
        if (Object.keys(props.user).length !== 0) {
            return (
                <React.Fragment>
                    {props.user.assigned_cards.map(card => (
                        <Card sx={{ margin: "10px", zIndex: "100" }} variant="outlined" key={card.id}>
                            <CardContent sx={{ display: "flex", justifyContent: "space-between" }}>

                                <Container>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Card Title
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {card.title}
                                    </Typography>
                                </Container>
                                <Container sx={{ textAlign: "end" }}>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Project
                                    </Typography>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {card.cards_list.lists_project.title}
                                    </Typography>
                                </Container>

                            </CardContent>
                            <CardContent>
                                <Container>
                                    <Typography variant="h6" component="span" style={{ color: "red", fontWeight: "bold" }}>Due Date: </Typography>
                                    <Typography variant="h6" component="span" style={{ color: "#0f1217" }}><Moment format="MMMM Do YYYY, h:mm a">{card.due_date}</Moment></Typography>
                                </Container>
                            </CardContent>
                            <CardContent>
                                <Container>
                                    <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                                        Card Description
                                    </Typography>
                                    <Typography variant='body2' paragraph dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(card['descp']) }} />
                                </Container>
                            </CardContent>
                            <CardActions>
                                <Container sx={{ display: "flex", justifyContent: "space-between" }}>
                                    <Button size="small" variant="contained" style={{ backgroundColor: "#4def5b", color: "black" }} onClick={() => {
                                        props.history.push(`/project/${card.cards_list.lists_project.id}/${card.id}`);
                                    }}>View Card</Button>
                                    <Button size="small" variant="contained" style={{ backgroundColor: "#ff0d51", color: "white" }} onClick={() => {
                                        props.history.push(`/project/${card.cards_list.lists_project.id}`);
                                    }}>See Project</Button>
                                </Container>
                            </CardActions>
                        </Card>
                    ))}
                </React.Fragment>
            );
        }
        else {
            return <p>Loading cards ...</p>
        }
    }
    else {
        if (props.done) {
            return <Redirect to="/" />;
        }
        else {
            return <p>Checking login status...</p>
        }
    }
}

export default AssignedCards
