// React
import { useState, useEffect } from 'react';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// MUI
import {
	Box,
	Button,
	Card,
	IconButton,
	TextField,
	Typography
} from '@mui/material';
import { AddRounded, DeleteRounded } from '@mui/icons-material';
// local files
import sectionApi from '../../api/sectionApi';
import taskApi from '../../api/taskApi';
import TaskModal from './TaskModal';

let timer;
const timeout = 500;

const Kanban = props => {
	const boardId = props.boardId;
	const [data, setData] = useState([]);
	const [selectedTask, setSelectedTask] = useState(undefined);

	useEffect(() => {
		setData(props.data);
	}, [props.data]);

	// Enable Drag and Drop of tasks
	const onDragEnd = async ({ source, destination }) => {
		if (!destination) return;

		const sourceColIndex = data.findIndex(e => e.id === source.droppableId);
		const destinationColIndex = data.findIndex(
			e => e.id === destination.droppableId
		);

		const sourceCol = data[sourceColIndex];
		const destinationCol = data[destinationColIndex];

		const sourceSectionId = sourceCol.id;
		const destinationSectionId = destinationCol.id;

		const sourceTasks = [...sourceCol.tasks];
		const destinationTasks = [...destinationCol.tasks];

		if (source.droppableId !== destination.droppableId) {
			const [removed] = sourceTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);

			data[sourceColIndex].tasks = sourceTasks;
			data[destinationColIndex].tasks = destinationTasks;
		} else {
			const [removed] = destinationTasks.splice(source.index, 1);
			destinationTasks.splice(destination.index, 0, removed);

			data[destinationColIndex].tasks = destinationTasks;
		}

		try {
			await taskApi.updatePosition(boardId, {
				resourceList: sourceTasks,
				destinationList: destinationTasks,
				resourceSectionId: sourceSectionId,
				destinationSectionId: destinationSectionId
			});
			setData(data);
		} catch (err) {
			alert(err);
		}
	};

	// function to add a new section to the board
	const createSection = async () => {
		try {
			const section = await sectionApi.create(boardId);
			setData([...data, section]);
		} catch (err) {
			console.log(err);
		}
	};

	// Delete a section from the board
	const deleteSection = async sectionId => {
		try {
			await sectionApi.delete(boardId, sectionId);
			const newData = [...data].filter(e => e.id !== sectionId);
			setData(newData);
		} catch (err) {
			console.log(err);
		}
	};

	// Update the title of a section
	const updateSectionTitle = async (e, sectionId) => {
		clearTimeout(timer);
		const newTitle = e.target.value;
		const newData = [...data];
		const index = newData.findIndex(e => e.id === sectionId);

		newData[index].title = newTitle;
		setData(newData);

		timer = setTimeout(async () => {
			try {
				await sectionApi.update(boardId, sectionId, {
					title: newTitle
				});
			} catch (err) {
				console.log(err);
			}
		}, timeout);
	};

	// add a task
	const addTask = async sectionId => {
		try {
			const task = await taskApi.create(boardId, { sectionId });

			const newData = [...data];

			const index = newData.findIndex(e => e.id === sectionId);
			newData[index].tasks.unshift(task);

			setData(newData);
		} catch (err) {
			console.log(err);
		}
	};

	const onUpdateTask = task => {
		const newData = [...data];
		const sectionIndex = newData.findIndex(e => e.id === task.section.id);
		const taskIndex = newData[sectionIndex].tasks.findIndex(
			e => e.id === task.id
		);
		newData[sectionIndex].tasks[taskIndex] = task;
		setData(newData);
	};

	const onDeleteTask = task => {
		const newData = [...data];
		const sectionIndex = newData.findIndex(e => e.id === task.section.id);
		const taskIndex = newData[sectionIndex].tasks.findIndex(
			e => e.id === task.id
		);
		newData[sectionIndex].tasks.splice(taskIndex, 1);
		setData(newData);
	};

	return (
		<Box>
			{/* Section divider */}
			<Box
				sx={{
					m: 0,
					p: 0,
					display: 'flex',
					borderRadius: '24px',
					backgroundColor: '#ffffff24',
					alignItems: 'center',
					justifyContent: 'space-between'
				}}
			>
				{/* ADD SECTION button */}
				<Button
					variant='contained'
					onClick={createSection}
					sx={{
						borderRadius: 'inherit',
						color: 'text.dark',
						fontWeight: 'bold',
						backgroundColor: props.isFavourite
							? 'warning.main'
							: 'primary.main',
						'&:hover': {
							backgroundColor: props.isFavourite
								? 'warning.main'
								: 'primary.main'
						}
					}}
				>
					ADD SECTION
				</Button>
				{/* Section Counter */}
				<Box
					sx={{
						p: '6px 10px',
						backgroundColor: '#ffffff32',
						borderRadius: 'inherit'
					}}
				>
					{data.length} Sections
				</Box>
			</Box>

			{/* Kanban Board */}
			<DragDropContext onDragEnd={onDragEnd}>
				<Box
					sx={{
						display: 'flex',
						alignItems: 'flex-start',
						width: 'calc(100vw - 400px)',
						overflowX: 'auto'
					}}
				>
					{data.map(section => (
						<div
							key={section.id}
							style={{
								width: '300px',
								marginRight: '24px',
								borderRadius: '24px'
							}}
						>
							<Droppable
								key={section.id}
								droppableId={section.id}
							>
								{provided => (
									// All Sections
									<Box
										ref={provided.innerRef}
										{...provided.droppableProps}
										sx={{
											mt: '24px',
											p: '12px',
											width: '300px',
											borderRadius: '24px',
											backgroundColor: '#ffffff12'
										}}
									>
										{/* Section Title and Buttons */}
										<Box
											sx={{
												pl: '14px',
												display: 'flex',
												alignItems: 'center',
												justifyContent: 'space-between',
												backgroundColor:
													props.isFavourite
														? 'warning.main'
														: 'primary.main',
												borderRadius: '12px'
											}}
										>
											{/* Section Title */}
											<TextField
												placeholder='Untitled'
												value={section.title}
												sx={{
													flexGrow: 1,
													input: {
														color: 'text.dark'
													},
													'& .MuiOutlinedInput-input':
														{ padding: 0 },
													'& .MuiOutlinedInput-notchedOutline':
														{ border: 'unset ' },
													'& .MuiOutlinedInput-root':
														{
															fontSize: '1.25rem',
															fontWeight: 'bold'
														}
												}}
												onChange={e => {
													updateSectionTitle(
														e,
														section.id
													);
												}}
											/>

											{/* Add Task Button */}
											<IconButton
												sx={{
													color: 'text.dark'
												}}
												onClick={() =>
													addTask(section.id)
												}
											>
												<AddRounded />
											</IconButton>

											{/* Delete Section Button */}
											<IconButton
												sx={{
													color: 'text.dark',
													'&:hover': {
														color: 'error.main'
													}
												}}
												onClick={() =>
													deleteSection(section.id)
												}
											>
												<DeleteRounded />
											</IconButton>
										</Box>

										{/* Tasks */}
										{section.tasks.map((task, index) => (
											<Draggable
												key={task.id}
												draggableId={task.id}
												index={index}
											>
												{(provided, snapshot) => (
													<Card
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														sx={{
															p: '12px',
															mt: '12px',
															cursor: snapshot.isDragging
																? 'grab'
																: 'pointer!important',
															backgroundColor:
																'#0000007a',
															borderRadius: '12px'
														}}
														onClick={() => {
															setSelectedTask(
																task
															);
														}}
													>
														<Typography fontSize='large'>
															{task.title}
														</Typography>
													</Card>
												)}
											</Draggable>
										))}
										{provided.placeholder}
									</Box>
								)}
							</Droppable>
						</div>
					))}
				</Box>
			</DragDropContext>
			<TaskModal
				task={selectedTask}
				boardId={boardId}
				isFavourite={props.isFavourite}
				onClose={() => setSelectedTask(undefined)}
				onUpdate={onUpdateTask}
				onDelete={onDeleteTask}
			/>
		</Box>
	);
};

export default Kanban;
