import React from 'react';
import TextField from '@mui/material/TextField';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { Checkbox } from '@mui/material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { OutlinedInput } from '@mui/material';
<<<<<<< HEAD
import Cookies from 'universal-cookie';
import { useHistory } from 'react-router';
import { ButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { DialogTitle, DialogActions, Dialog, DialogContent, DialogContentText } from '@material-ui/core';
import { Alert } from '@mui/material';
import { Redirect } from 'react-router-dom';
const cookies = new Cookies();
=======
import Cookies from 'universal-cookie'
import { useHistory } from 'react-router';

const cookies = new Cookies()
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41

// import AdapterDateFns from '@mui/lab/AdapterDateFns';
// import LocalizationProvider from '@mui/lab/LocalizationProvider';
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
	PaperProps: {
		style: {
			maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
			width: 250
		}
	}
};

<<<<<<< HEAD
=======

>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
export const CreateCard = (props) => {
	// const [card, setcard] = useState({"card_list"})
	const [ title, setTitle ] = useState('');
	const [ errorTitle, setErrorTitle ] = useState(false);
	const [ errormsg, setErrorMsg ] = useState('');
<<<<<<< HEAD
	const [ alertMsg, setAlertMsg ] = useState('');
	const [ alert, setAlert ] = useState(false);
	const [ descp, setDescp ] = useState('none');
	const [ datetime, setDateTime ] = useState(new Date().toISOString());
	const [ assigned_to, setAssigned_to ] = useState([]);
	const [ assigned_toU, setAssigned_toU ] = useState([]); //how to fix this??
	const [ members, setMembers ] = useState({});
	const [open, setOpen] = useState(false)
	// created_by, list
	const [ errorassign, setErrorAssign ] = useState(false);
	const history = useHistory();
	const checkEdit = () => {
		console.log('Ia m checkEdit', props.edit, props.card);
		if (props.edit) {
			console.log(props.card);
			setTitle(props.card['title']);
			setDescp(props.card['descp']);
			setAssigned_to(props.card['assigned_to']);
			setDateTime(props.card['due_date']);
		}
	};
=======
	const [ descp, setDescp ] = useState('');
	const [ datetime, setDateTime ] = useState(new Date());
	const [ assigned_to, setAssigned_to ] = useState([]);
	const [ assigned_toU, setAssigned_toU ] = useState([]);
	const [ members, setMembers ] = useState({});
	// created_by, list
	const [ errorassign, setErrorAssign ] = useState(false);
	const history = useHistory();
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	const handleCreateCard = async (e) => {
		setErrorTitle(false);
		setErrorMsg('');
		let title_proxy = e.target.value;
		// console.log(title, descp);
<<<<<<< HEAD
		let list_id;
		if (props.edit) {
			list_id = props.card['cards_list'];
		} else {
			list_id = props.match.params.id;
		}
		console.log('list id: ', list_id);
		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/lists/' + list_id, { withCredentials: true })
			.then((response) => {
				console.log('titles in lists', response.data);
=======

		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/lists/' + props.match.params.id, { withCredentials: true })
			.then((response) => {
				console.log(response.data);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return error;
			});
<<<<<<< HEAD
		if (title_proxy === '') {
=======
		if(title_proxy === ''){
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			setErrorTitle(true);
		}
		res.list_cards.forEach((item) => {
			if (title_proxy === item.title) {
<<<<<<< HEAD
				if (!props.edit || title_proxy !== props.card.title) {
					setErrorMsg('Choose a different title');
					setErrorTitle(true);
				}
=======
				setErrorMsg('Choose a different title');
				setErrorTitle(true);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			}
		});
	};

	const getMembers = async () => {
<<<<<<< HEAD
		console.log(props.edit, props);
		let projectid;
		if (props.edit) {
			console.log('came here', props.match.params);
			projectid = props.match.params.id;
		} else {
			projectid = props.match.params.projectid;
		}
		console.log('projectid', projectid);
		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/project_members/' + projectid, {
				withCredentials: true
			})
			.then((response) => {
				console.log('members', response.data);
=======
		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/project_members/' + props.match.params.projectid, {
				withCredentials: true
			})
			.then((response) => {
				console.log(response.data);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return error;
			});
		// console.log(fetchUsername(res['members']));
		setMembers(res['members']);
	};

	useEffect(() => {
<<<<<<< HEAD
		if (!props.loginStatus) {
			props.history.push('/');
		}
		console.log('UseEffect is called');
		checkEdit();
		getMembers();
		props.getUser();
	}, []);

=======
		if(!props.loginStatus){
			props.history.push("/");
		}
		getMembers();
		props.getUser();
		
	}, []);
	
	useEffect(() => {}, []);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	// const fetchUsername = (array) => {
	// 	let usernames = [];
	// 	for (let i = 0; i < array.length; i++) {
	// 		usernames.push(array[i].username);
	// 	}
	// 	console.log(array.map((item) => item.username));
	// 	return usernames;
	// };

	let choices = [];
	if (Object.keys(members).length !== 0) {
		choices = members.map((option) => {
			return (
				<MenuItem key={option.id} value={option.id}>
					<ListItemIcon>
						<Checkbox checked={assigned_to.indexOf(option.id) > -1} color="secondary" />
					</ListItemIcon>
					<ListItemText primary={option.username} />
				</MenuItem>
			);
		});
	} else {
		choices = [
			<MenuItem>Val - 1</MenuItem>,
			<MenuItem>Val - 2</MenuItem>,
			<MenuItem>Val - 3</MenuItem>,
			<MenuItem>Val - 4</MenuItem>
		];
	}
<<<<<<< HEAD
	const deleteCard = (e) => {
		handleClose();
		props.handleClose();
		props.axiosInstance
			.delete('http://127.0.0.1:8000/trelloAPIs/cards/' + props.card.id + '/', { withCredentials: true })
			.then((res) => {
				console.log('Card deleted successsfully');
				props.handleClose();
			})
			.catch((error) => {
				console.log(error);
				setAlert(true);
				setAlertMsg(error);
			});
	};
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	const handleSelectChange = (event) => {
		console.log(event.target.value);
		console.log(assigned_toU, assigned_to);
		setErrorAssign(false);
<<<<<<< HEAD
		if (event.target.value.length === 0) {
=======
		if(event.target.value.length === 0){
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			setErrorAssign(true);
		}
		setAssigned_to(event.target.value);
		let usernames = [];
		for (let i = 0; i < event.target.value.length; i++) {
			members.forEach((item) => {
				if (item.id === event.target.value[i]) {
					usernames.push(item.username);
				}
			});
		}
		setAssigned_toU(usernames);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
<<<<<<< HEAD

=======
		
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		if (title === '') {
			setErrorMsg('Required');
			setErrorTitle(true);
		}
		if (assigned_to.length === 0) {
			setErrorAssign(true);
		}
		if (!errorassign && !errorTitle) {
<<<<<<< HEAD
			console.log(props);
			let data = {
=======
			console.log(props)
			const data = {
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				cards_list: props.match.params.id,
				created_by: props.user.id,
				assigned_to: assigned_to,
				title: title,
				descp: descp,
				due_date: datetime
			};
<<<<<<< HEAD

			console.log(cookies.get('csrftoken'));
			if (!props.edit) {
				props.axiosInstance
					.post('http://127.0.0.1:8000/trelloAPIs/cards/', data, {
						headers: {
							'X-CSRFToken': cookies.get('csrftoken'),
							'Content-Type': 'application/json',
							'X-Requested-With': 'XMLHttpRequest'
						}
					})
					.then((response) => {
						console.log(response.data);
						history.goBack();
					})
					.catch((error) => {
						console.log(error);
					});
			} else {
				data.cards_list = props.card['cards_list'];
				console.log('csrftoken', cookies.get('csrftoken'), data);
				props.axiosInstance
					.put('http://127.0.0.1:8000/trelloAPIs/cards/' + props.card.id + '/', data, {
						headers: {
							'X-CSRFToken': cookies.get('csrftoken'),
							'Content-Type': 'application/json',
							'X-Requested-With': 'XMLHttpRequest'
						}
					})
					.then((response) => {
						console.log('Update Successful');
						console.log(response.data);
					})
					.catch((error) => {
						console.log(error);
						setAlert(true)
						setAlertMsg(error)
					});
				props.handleClose();
			}
		}
	};
	const handleClose = (e) =>{
		console.log("Closing the card");
		setOpen(false);
	}
	if(props.loginStatus){
=======
			console.log(data);
			console.log(cookies.get("csrftoken"))
			props.axiosInstance
				.post('http://127.0.0.1:8000/trelloAPIs/cards/', data, {
					headers: {
					  'X-CSRFToken':  cookies.get("csrftoken"),
					  'Content-Type': 'application/json',
					  'X-Requested-With': 'XMLHttpRequest'
					}
				  })
				.then((response) => {
					console.log(response.data);
					history.goBack();
					
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	return (
		<Box
			component="form"
			sx={{
				display: 'flex',
				flexDirection: 'column',
				'& > :not(style)': { m: 1, width: '25ch' }
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
					shrink: true
				}}
<<<<<<< HEAD
				value={title}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				onChange={(e) => {
					setTitle(e.target.value);
					handleCreateCard(e);
				}}
				error={errorTitle}
				helperText={errormsg}
			/>
			<TextField
				id="standard-multiline-flexible"
				label="Description"
				variant="outlined"
				color="secondary"
				InputLabelProps={{
					shrink: true
				}}
<<<<<<< HEAD
				value={descp}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				multiline
				onChange={(e) => setDescp(e.target.value)}
				rows={4}
			/>
			<TextField
				id="datetime-local"
				label="Due-Date"
				type="datetime-local"
				InputLabelProps={{
					shrink: true
				}}
<<<<<<< HEAD
				value={datetime}
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				variant="outlined"
				color="secondary"
				sx={{ width: 250 }}
				onChange={(e) => {
					setDateTime(e.target.value);
				}}
			/>
			<Select
				labelId="demo-multiple-checkbox-label"
				id="demo-multiple-checkbox"
				multiple
				value={assigned_to}
				input={<OutlinedInput label="Assign To" />}
				onChange={handleSelectChange}
				renderValue={(assigned_toU) => assigned_toU.join(', ')}
				MenuProps={MenuProps}
				error={errorassign}
			>
				{choices}
			</Select>
<<<<<<< HEAD
			<ButtonGroup>
				<Button variant="contained" color="secondary" type="submit" onClick={handleSubmit}>
					{props.edit ? 'Update' : 'Submit'}
				</Button>
				<Button
					startIcon={<DeleteIcon/>}
					onClick={() =>{setOpen(true)}}
					disabled={!props.edit || props.user.id !== props.card.created_by}
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
					<Button onClick={handleClose} variant="contained" color="primary">No</Button>
					<Button onClick={deleteCard} autoFocus variant="contained" color="secondary">
						Yes, delete the card
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	
		//ui
	);
			}
			else{
				if(props.done){
					return <Redirect to="/"/>
				}
				else{
					return <p>Checking login status ....</p>
				}
			}
=======
			<Button variant="contained" color="secondary" type="submit" onClick={handleSubmit}>
				Submit
			</Button>
		</Box>
	);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
};
