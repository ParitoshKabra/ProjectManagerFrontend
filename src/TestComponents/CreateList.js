import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Input from '@mui/material/Input';
import IconButton from '@mui/material/IconButton';
import AddTaskIcon from '@mui/icons-material/AddTask';
import { Alert } from '@mui/material';
import Collapse from '@mui/material/Collapse';
import CloseIcon from '@mui/icons-material/Close';
import { AlertTitle } from '@mui/material';
import { Button } from '@mui/material';
import Cookies from 'universal-cookie';
<<<<<<< HEAD
import { Redirect } from 'react-router';
const ariaLabel = { 'aria-label': 'description' };
const cookies = new Cookies();

const MyAlert = ({ TitleMsg, TitleDetail, disableAlertState , setTitleMsg, setTitleDetail}) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			disableAlertState();
		}, 2000);
=======

const ariaLabel = { 'aria-label': 'description' };
const cookies = new Cookies();

const MyAlert = ({ TitleMsg, TitleDetail, disableAlertState }) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			disableAlertState();
		}, 5000);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		return () => {
			clearTimeout(timeout);
		};
	}, []);
	const [ open, setOpen ] = useState(true);
	return (
		<Box sx={{ width: '100%' }}>
			<Collapse in={open}>
				<Alert
					action={
						<IconButton
							aria-label="close"
							color="inherit"
							size="small"
							onClick={() => {
								setOpen(false);
							}}
						>
							<CloseIcon fontSize="inherit" />
						</IconButton>
					}
					severity={TitleMsg}
					sx={{ mb: 2 }}
				>
					<AlertTitle>{TitleMsg}</AlertTitle>
					{TitleDetail} — <strong>check it out!</strong>
				</Alert>
			</Collapse>
			<Button
				disabled={open}
				variant="outlined"
				onClick={() => {
					setOpen(true);
				}}
			>
				Re-open
			</Button>
		</Box>
	);
};

function CreateList(props) {
	const [ title, setTitle ] = useState('');
	const [ submit, setSubmit ] = useState(false);
<<<<<<< HEAD
	const [ TitleMsg, setTitleMsg ] = useState('error');
	const [ TitleDetail, setTitleDetail ] = useState('');
	const [ showAlert, setShowAlert ] = useState(false);
	const [created, setCreated] = useState(false);
=======
	const [ TitleMsg, setTitleMsg ] = useState('none');
	const [ TitleDetail, setTitleDetail ] = useState('');
	const [ showAlert, setShowAlert ] = useState(false);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41

	useEffect(
		() => {
			props.renderLists();
		},
		[ submit ]
	);
<<<<<<< HEAD
	
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
	const disableAlertState = () => {
		setShowAlert(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmit(false);
		console.log(TitleMsg);
<<<<<<< HEAD
		let array = props.project['project_lists'].map(item=>item.title);
		
		if(array.indexOf(title) === -1){
			setCreated(false);
			setTitleMsg('success');
			setTitleDetail('List created successfully!');
			console.log("came herere");
		}
		if (TitleMsg === 'success' && !created) {
=======
		if (TitleMsg === 'success') {
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
			const data = {
				title: title,
				lists_project: props.project.id
			};
			console.log(data);
			console.log(cookies.get('csrftoken'));
			props.axiosInstance
				.post('http://127.0.0.1:8000/trelloAPIs/lists/', data, {
					headers: {
						'X-CSRFToken': cookies.get('csrftoken'),
						'Content-Type': 'application/json',
						'X-Requested-With': 'XMLHttpRequest'
					}
				})
				.then((response) => {
					console.log(response.data);
					// redirect user to omniport to authenticate again
					setShowAlert(true);
					setSubmit(true);
<<<<<<< HEAD
					setCreated(true);
=======
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
<<<<<<< HEAD
			console.log('error in title', created, TitleMsg);
      		setShowAlert(true);
=======
			console.log('error in title');
      setShowAlert(true);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		}
	};
	const handleCreateList = (e) => {
		setTitleMsg('success');
<<<<<<< HEAD
		setCreated(false);
		setTitleDetail('List created successfully!');
    	setShowAlert(false);
=======
		setTitleDetail('List created successfully!');
    setShowAlert(false);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		console.log(e.target.value);
		setTitle(e.target.value);
		let title_proxy = e.target.value;
		let titles = props.project['project_lists'].map((item) => item.title);

		if (titles.indexOf(title_proxy) !== -1) {
			setTitleMsg('error');
			setTitleDetail('Choose a different title for the list');
		}
		if (title_proxy === '') {
			setTitleMsg('error');
			setTitleDetail('title cannot be empty');
		}
	};
<<<<<<< HEAD
	if(props.loginStatus){
		return (
=======
	return (
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
		<Box
			component="form"
			sx={{
				'& > :not(style)': { m: 1 }
			}}
			noValidate
			autoComplete="off"
		>
			
			<Input placeholder="Add a new list" inputProps={ariaLabel} onChange={handleCreateList} />
			<IconButton
				color="primary"
				aria-label="add task"
				component="span"
				type="submit"
				onClick={(e) => {
					handleSubmit(e);
				}}
			>
				<AddTaskIcon />
			</IconButton>
      {showAlert && (
<<<<<<< HEAD
				<MyAlert TitleMsg={TitleMsg} TitleDetail={TitleDetail} disableAlertState={disableAlertState} setTitleDetail={setTitleDetail} setTitleMsg={setTitleMsg} />
			)}
			
		</Box>
    
	);
}else{
		if(props.done){
			return <Redirect to="/" />
		}
		else{
			return <p>Checking login status....</p>
		}
	}
=======
				<MyAlert TitleMsg={TitleMsg} TitleDetail={TitleDetail} disableAlertState={disableAlertState} />
			)}
		</Box>
    
	);
>>>>>>> e8a6a70312667255803e9b7390bd405d21002f41
}

export default CreateList;
