import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Stack from '@mui/material/Stack';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/Add';


const useStyles = makeStyles({
    btn: {
        fontSize: "16px",
		border: "50%"
    }
});

export const MyList = (props) => {
	const classes = useStyles();
	const [ listContent, setlistContent ] = useState({});
	const getList = () => {
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/lists/' + props.list.id, { withCredentials: true })
			.then((response) => {
				console.log('Inside list');
				console.log(response.data);
				setlistContent(response.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	useEffect(() => {
		getList();
	}, []);

	if (listContent) {
		console.log(listContent['list_cards']);
		let cards;
		if (listContent['list_cards']) {
			cards = listContent.list_cards.map((card) => {
				return (
					<Button variant="outlined" color="secondary" key={card.id} endIcon={<EditRoundedIcon/>} >
						{card.title}
					</Button>

				);
			});
		} else {
			cards = 'Loading cards...';
		}
		return (
			<Stack spacing={2} maxWidth="148px" width="148px" border="2px solid red">
				<Typography variant="h6" gutterBottom align="center">{listContent.title}</Typography>
				<Stack spacing={1.2}>{cards}</Stack>

				<Button color="primary" variant="outlined" className={classes.btn} onClick={()=>{
					props.history.push("/createCard/"+props.list.id+"/"+props.list.lists_project)
				}}>
					<AddCircleIcon />
				</Button>
			</Stack>
		);
	} else {
		return <div>Loading List...</div>;
	}
};
