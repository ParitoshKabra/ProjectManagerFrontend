import React from 'react';
import Button from '@material-ui/core/Button';
import axios from 'axios';

export class Logout extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (<Button variant="contained" onClick={() => {
            axios
                .get("http://127.0.0.1:8000/trelloAPIs/logout", { withCredentials: true })
                .then(response => {
                    this.props.handleLogout(response.data);
                    return response.data
                })
                .catch((error) => {
                    console.log(error)
                })
        }}>Logout</Button>);
    }
}