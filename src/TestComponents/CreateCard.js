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
import Cookies from 'universal-cookie'
import { useHistory } from 'react-router';

const cookies = new Cookies()

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


export const CreateCard = (props) => {
	// const [card, setcard] = useState({"card_list"})
	const [ title, setTitle ] = useState('');
	const [ errorTitle, setErrorTitle ] = useState(false);
	const [ errormsg, setErrorMsg ] = useState('');
	const [ descp, setDescp ] = useState('');
	const [ datetime, setDateTime ] = useState(new Date());
	const [ assigned_to, setAssigned_to ] = useState([]);
	const [ assigned_toU, setAssigned_toU ] = useState([]);
	const [ members, setMembers ] = useState({});
	// created_by, list
	const [ errorassign, setErrorAssign ] = useState(false);
	const history = useHistory();
	const handleCreateCard = async (e) => {
		setErrorTitle(false);
		setErrorMsg('');
		let title_proxy = e.target.value;
		// console.log(title, descp);

		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/lists/' + props.match.params.id, { withCredentials: true })
			.then((response) => {
				console.log(response.data);
				return response.data;
			})
			.catch((error) => {
				console.log(error);
				return error;
			});
		if(title_proxy === ''){
			setErrorTitle(true);
		}
		res.list_cards.forEach((item) => {
			if (title_proxy === item.title) {
				setErrorMsg('Choose a different title');
				setErrorTitle(true);
			}
		});
	};

	const getMembers = async () => {
		const res = await axios
			.get('http://127.0.0.1:8000/trelloAPIs/project_members/' + props.match.params.projectid, {
				withCredentials: true
			})
			.then((response) => {
				console.log(response.data);
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
		if(!props.loginStatus){
			props.history.push("/");
		}
		getMembers();
		props.getUser();
		
	}, []);
	
	useEffect(() => {}, []);
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
	const handleSelectChange = (event) => {
		console.log(event.target.value);
		console.log(assigned_toU, assigned_to);
		setErrorAssign(false);
		if(event.target.value.length === 0){
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
		
		if (title === '') {
			setErrorMsg('Required');
			setErrorTitle(true);
		}
		if (assigned_to.length === 0) {
			setErrorAssign(true);
		}
		if (!errorassign && !errorTitle) {
			console.log(props)
			const data = {
				cards_list: props.match.params.id,
				created_by: props.user.id,
				assigned_to: assigned_to,
				title: title,
				descp: descp,
				due_date: datetime
			};
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
			<Button variant="contained" color="secondary" type="submit" onClick={handleSubmit}>
				Submit
			</Button>
		</Box>
	);
};
