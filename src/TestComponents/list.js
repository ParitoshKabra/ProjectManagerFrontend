import axios from 'axios';
import React from 'react';
import { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Stack from '@mui/material/Stack';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import { makeStyles } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/Add';
import { ButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { ListItemText } from '@material-ui/core';
import { ListItem } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { CreateCard } from './CreateCard';

const useStyles = makeStyles({
	btn: {
		fontSize: '16px',
		border: '50%'
	},
	container: {
		maxWidth: '148px',
		maxHeight: '200px',
		overflow: 'auto',
		border: '2px solid red'
	}
});

export const MyList = (props) => {
	const classes = useStyles();
	const [ listContent, setlistContent ] = useState({});
	const [ editCard, setEditCard ] = useState(false);
	const [cardUnderEdit, setCardUnderEdit] = useState({});
	const [open, setOpen] = useState(false);

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
	const deleteList = () => {
		setOpen(false);
		props.axiosInstance
			.delete('http://127.0.0.1:8000/trelloAPIs/lists/' + props.list.id + '/', {
				withCredentials: true
			})
			.then((res) => {
				console.log('List deleted successfully!', res);
				props.renderLists();
			})
			.catch((error) => {
				console.log(error);
			});
	}
	
	useEffect(() => {
		getList();
	}, []);
	useEffect(() =>{
		getList();
	}, [editCard])

	const EditCard = (card) => {
		setEditCard(true);
		setCardUnderEdit(card);
	};
	const ViewCard = () => {};
	
	const handleClose = () => {
		setEditCard(false);
		props.renderLists();
	};
	if (listContent) {
		console.log(listContent['list_cards']);
		let cards;
		if (listContent['list_cards']) {
			cards = listContent.list_cards.map((card) => {
				return (
					<ListItem>
						<ListItemText primary={card.title} />
						<ButtonGroup key={card.id}>
							<Button
								variant="outlined"
								onClick={(e) =>{EditCard(card);}}
								color="secondary"
								startIcon={<EditRoundedIcon />}
							/>
							<Button
								variant="outlined"
								onClick={ViewCard}
								color="secondary"
								startIcon={<VisibilityIcon />}
							/>
						</ButtonGroup>
					</ListItem>
				);
			});
		} else {
			cards = 'Loading cards...';
		}
		return (
			<Stack spacing={2} className={classes.conatainer}>
				<Typography variant="h6" gutterBottom align="center">
					{listContent.title}
				</Typography>
				<Stack spacing={1.2}>{cards}</Stack>

				<ButtonGroup>
					<Button
						color="primary"
						variant="outlined"
						className={classes.btn}
						onClick={() => {
							props.history.push('/createCard/' + props.list.id + '/' + props.list.lists_project);
						}}
					>
						<AddCircleIcon />
					</Button>
					<Button
						color="secondary"
						variant="contained"
						onClick={() => {
							setOpen(true);
						}}
						disabled={props.project['admins'].indexOf(props.user.id) === -1}
					>
						<DeleteIcon />
					</Button>
				</ButtonGroup>
				<Dialog onClose={handleClose} open={editCard}>
					<DialogTitle>Edit Card</DialogTitle>
					<DialogContent>
						<CreateCard {...props} edit={editCard} card={cardUnderEdit} handleClose={handleClose}></CreateCard>
					</DialogContent> 
				</Dialog>
				<Dialog
				open={open}
				onClose={()=>{setOpen(false)}}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">Delete List</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						Are you sure you want to delete this list?
						All it's cards will be lost!!
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={()=>{setOpen(false)}} variant="contained" color="primary">No</Button>
					<Button onClick={deleteList} autoFocus variant="contained" color="secondary">
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
