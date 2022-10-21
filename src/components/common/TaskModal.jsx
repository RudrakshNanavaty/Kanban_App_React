//MUI
import {
	Backdrop,
	Box,
	Fade,
	IconButton,
	Modal,
	TextField
} from '@mui/material';
import { DeleteRounded } from '@mui/icons-material';
// React
import React, { useState, useRef, useEffect } from 'react';
// local files
import taskApi from '../../api/taskApi';

const modalStyle = {
	p: '20px',
	outline: 'none',
	position: 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: '50%',
	backgroundColor: 'background.light',
	height: '80%',
	borderRadius: '24px',
	overflow: 'auto'
};

let timer;
const timeout = 500;
let isModalClosed = false;

const TaskModal = props => {
	const boardId = props.boardId;
	const [task, setTask] = useState(props.task);
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const editorWrapperRef = useRef();

	useEffect(() => {
		setTask(props.task);
		setTitle(props.task !== undefined ? props.task.title : '');
		setContent(props.task !== undefined ? props.task.content : '');
		if (props.task !== undefined) {
			isModalClosed = false;

			setTimeout(() => {
				if (editorWrapperRef.current) {
					const box = editorWrapperRef.current;
					box.querySelector(
						'.ck-editor__editable_inline'
					).style.height = box.offsetHeight - 50 + 'px';
				}
			}, timeout);
		}
	}, [props.task]);

	const onClose = () => {
		isModalClosed = true;
		props.onUpdate(task);
		props.onClose();
	};

	const deleteTask = async () => {
		try {
			await taskApi.delete(boardId, task.id);
			props.onDelete(task);
			setTask(undefined);
		} catch (err) {
			alert(err);
		}
	};

	const updateTitle = async e => {
		clearTimeout(timer);
		const newTitle = e.target.value;
		timer = setTimeout(async () => {
			try {
				await taskApi.update(boardId, task.id, { title: newTitle });
			} catch (err) {
				alert(err);
			}
		}, timeout);

		task.title = newTitle;
		setTitle(newTitle);
		props.onUpdate(task);
	};

	const updateContent = async e => {
		clearTimeout(timer);
		const data = e.target.value;

		if (!isModalClosed) {
			timer = setTimeout(async () => {
				try {
					await taskApi.update(boardId, task.id, { content: data });
				} catch (err) {
					alert(err);
				}
			}, timeout);

			task.content = data;
			setContent(data);
			props.onUpdate(task);
		}
	};

	return (
		<Modal
			open={task !== undefined}
			onClose={onClose}
			closeAfterTransition
			BackdropComponent={Backdrop}
			BackdropProps={{ timeout: 500 }}
		>
			<Fade in={task !== undefined}>
				<Box sx={modalStyle}>
					{/* Modal Header */}
					<Box
						sx={{
							mb: '12px',
							pl: '12px',
							width: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between',
							backgroundColor: props.isFavourite
								? 'warning.main'
								: 'primary.main',
							borderRadius: '12px'
						}}
					>
						{/* Task Title */}
						<TextField
							placeholder='Untitled'
							value={title}
							fullWidth
							sx={{
								flexGrow: 1,
								input: {
									color: 'text.dark'
								},
								'& .MuiOutlinedInput-input': { padding: 0 },
								'& .MuiOutlinedInput-notchedOutline': {
									border: 'unset '
								},
								'& .MuiOutlinedInput-root': {
									fontSize: '2rem',
									fontWeight: 'bold'
								}
							}}
							onChange={updateTitle}
						/>

						{/* Delete Task Button */}
						<IconButton
							sx={{
								color: 'text.dark',
								'&:hover': {
									color: 'error.main'
								}
							}}
							onClick={deleteTask}
						>
							<DeleteRounded fontSize='large' />
						</IconButton>
					</Box>

					{/* Modal TextField */}
					<TextField
						value={content}
						placeholder='Add a decription to your task...'
						fullWidth
						multiline
						sx={{
							backgroundColor: '#ffffff12',
							borderRadius: '12px',
							'& .MuiOutlinedInput-input': {
								padding: '0px 12px'
							},
							'& .MuiOutlinedInput-notchedOutline': {
								border: 'unset'
							},
							'& .MuiOutlinedInput-root': {
								fontSize: '1.25rem'
							}
						}}
						onChange={e => updateContent(e)}
					/>
				</Box>
			</Fade>
		</Modal>
	);
};

export default TaskModal;
