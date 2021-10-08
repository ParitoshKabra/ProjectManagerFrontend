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

const ariaLabel = { 'aria-label': 'description' };
const cookies = new Cookies();

export const MyAlert = ({ TitleMsg, TitleDetail, disableAlertState }) => {
	useEffect(() => {
		const timeout = setTimeout(() => {
			disableAlertState();
		}, 2000);
		return () => {
			clearTimeout(timeout);
		};
	}, []);
	const [open, setOpen] = useState(true);
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
	const [title, setTitle] = useState('');
	const [submit, setSubmit] = useState(false);
	const [TitleMsg, setTitleMsg] = useState('error');
	const [TitleDetail, setTitleDetail] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [created, setCreated] = useState(false);

	useEffect(
		() => {
			props.renderLists();
		},
		[submit]
	);

	const disableAlertState = () => {
		setShowAlert(false);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		setSubmit(false);
		console.log(TitleMsg);
		if (TitleMsg === 'success' && !created) {
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
					setCreated(true);
					setTitle('');
				})
				.catch((error) => {
					console.log(error);
				});
		} else {
			console.log('error in title');
			setShowAlert(true);
		}
	};
	const handleCreateList = (e) => {
		setTitleMsg('success');
		setCreated(false);
		setTitleDetail('List created successfully!');
		setShowAlert(false);
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
	return (
		<Box
			component="form"
			sx={{
				'& > :not(style)': { m: 1 }
			}}
			noValidate
			autoComplete="off"
		>

			<Input placeholder="Add a new list" inputProps={ariaLabel} onChange={handleCreateList} value={title} />
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
				<MyAlert TitleMsg={TitleMsg} TitleDetail={TitleDetail} disableAlertState={disableAlertState} handleCreateList={handleCreateList} />
			)}

		</Box>

	);
}

export default CreateList;
