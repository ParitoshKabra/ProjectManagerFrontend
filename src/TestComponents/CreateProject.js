import React from 'react';
import { TextField } from '@material-ui/core';
import { Box } from '@mui/material';
import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { MenuItem } from '@mui/material';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import { Checkbox } from '@mui/material';
import { ListItemIcon, ListItemText } from '@mui/material';
import { OutlinedInput } from '@mui/material';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import { useHistory } from 'react-router';
import Cookies from 'universal-cookie';
import axios from 'axios';

const cookies = new Cookies();
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

function CreateProject(props) {
	const [ title, setTitle ] = useState('');
	const [ descp, setDescp ] = useState('');
	const [ members, setMembers ] = useState([]);
	const [ reg_members, setRegMembers ] = useState([]);
	const [ errorTitle, setErrorTitle ] = useState(false);
	const [ errorTitleMsg, setErrorTitleMsg ] = useState('');
	const history = useHistory();
	const getRegisteredMembers = () => {
		axios
			.get('http://127.0.0.1:8000/trelloAPIs/users_all/', { withCredentials: true })
			.then((res) => {
				console.log(res.data);
				setRegMembers(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (!props.loginStatus) {
			props.history.push('/');
		}
		getRegisteredMembers();
	}, []);

	const handleSelectChange = (event) => {
		setMembers(event.target.value);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			created_by: props.user.id,
			members: members,
			title: title,
			descp: descp,
			admins: []
		};
		console.log(data);
		props.axiosInstance
			.post('http://127.0.0.1:8000/trelloAPIs/projects/', data, {
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
				color="primary"
				InputLabelProps={{
					shrink: true
				}}
				onChange={(e) => {
					setTitle(e.target.value);
					// handleCreateCard(e);
				}}
				error={errorTitle}
				helperText={errorTitleMsg}
			/>
			<CKEditor
				editor={ClassicEditor}
				data=""
				onReady={(editor) => {
					// You can store the "editor" and use when it is needed.
					console.log('Editor is ready to use!', editor);
				}}
				onChange={(event, editor) => {
					const data = editor.getData();
					setDescp(data);
					console.log({ event, editor, data });
				}}
			/>
			<Select
				labelId="demo-multiple-checkbox-label"
				id="demo-multiple-checkbox"
				multiple
				value={members}
				input={<OutlinedInput label="Members" />}
				onChange={handleSelectChange}
				renderValue={(members) => members.join(', ')}
			>
				{reg_members.map((option) => {
					return (
						<MenuItem key={option.id} value={option.id}>
							<Checkbox checked={members.indexOf(option.id) > -1} color="secondary" />

							<ListItemText primary={option.username} />
						</MenuItem>
					);
				})}
			</Select>
			<Button color="secondary" variant="contained" type="submit" onClick={handleSubmit}>
				Submit
			</Button>
		</Box>
	);
}

export default CreateProject;
