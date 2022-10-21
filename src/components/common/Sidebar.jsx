//MUI
import {
	List,
	Box,
	Typography,
	IconButton,
	ListItem,
	ListItemButton
} from '@mui/material';
import { Logout, AddRounded, GridViewRounded } from '@mui/icons-material';
// React
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// Redux
import { setBoards } from '../../redux/features/boardSlice';
// Local files
import boardApi from '../../api/boardApi';
import FavouriteList from './FavouriteList';

const Sidebar = () => {
	const user = useSelector((state) => state.user.value);
	const boards = useSelector((state) => state.board.value);

	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { boardId } = useParams();
	const [activeIndex, setActiveIndex] = useState(0);

	// get all boards from database
	useEffect(() => {
		const getBoards = async () => {
			try {
				const res = await boardApi.getAll();
				dispatch(setBoards(res));
			} catch (err) {
				console.log(err);
			}
		};
		getBoards();
	}, [dispatch]);

	// navigate to '/boards/boardId'
	useEffect(() => {
		const activeItem = boards.findIndex((e) => e.id === boardId);

		if (boards.length > 0 && boardId === undefined)
			navigate(`/boards/${boards[0].id}`);
		setActiveIndex(activeItem);
	}, [boards, boardId, navigate]);

	// remove JWT when user logs out
	const logout = () => {
		localStorage.removeItem('token');
		navigate('/login');
	};

	// for drag and drop of boards in the sidebar
	const onDragEnd = async ({ source, destination }) => {
		const newList = [...boards];

		const [removed] = newList.splice(source.index, 1);
		newList.splice(destination.index, 0, removed);

		const activeItem = newList.findIndex((e) => e.id === boardId);

		setActiveIndex(activeItem);
		dispatch(setBoards(newList));

		try {
			await boardApi.updatePosition({ boards: newList });
		} catch (err) {
			console.log(err);
		}
	};

	const addBoard = async () => {
		try {
			const res = await boardApi.create();
			const newList = [res, ...boards];

			dispatch(setBoards(newList));
			navigate(`/boards/${res.id}`);
		} catch (err) {
			console.log(err);
		}
	};

	// rendering the sidebar
	return (
		<Box
			sx={{
				p: '12px',
				height: '100%',
				borderRadius: 'inherit',
				backgroundColor: 'background.light'
			}}
		>
			<List sx={{ p: '0px' }}>
				{/* Username and logout button at the top of sidebar */}
				<ListItem sx={{ p: '0px' }}>
					<Box
						sx={{
							pl: '10px',
							width: '100%',
							height: '40px',
							borderRadius: '14px',
							backgroundColor: 'primary.main',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'space-between'
						}}
					>

						{/* Username */}
						<Typography
							variant='h6'
							fontWeight='700'
							color='text.dark'
							sx={{
								whiteSpace: 'nowrap',
								overflow: 'hidden',
								textOverflow: 'ellipsis'
							}}
						>
							{user.username}
						</Typography>

						{/* Logout Button */}
						<IconButton onClick={logout}>
							<Logout
								sx={{
									color: 'background.default'
								}}
							/>
						</IconButton>
					</Box>
				</ListItem>

				<Box sx={{ mt: '10px' }} />

				{/* Favourites */}
				<FavouriteList />

				{/* All Boards */}
				<ListItem>
					<Box
						sx={{
							width: '100%',
							display: 'flex',
							alignItems: 'center'
						}}
						fontSize='large'
						color='primary.dark'
					>
						<GridViewRounded sx={{ mr: '10px' }} />

						<Typography
							fontSize='large'
							variant='body1'
							fontWeight='700'
						>
							All Boards
						</Typography>

						<IconButton
							sx={{
								ml: 'auto',
								color: 'primary.dark'
							}}
							onClick={addBoard}
						>
							<AddRounded />
						</IconButton>
					</Box>
				</ListItem>

				{/* displaying boards that user can drag/drop */}
				<DragDropContext onDragEnd={onDragEnd}>
					<Droppable
						key={'list-board-droppable-key'}
						droppableId={'list-board-droppable'}
					>
						{(provided) => (
							<div
								ref={provided.innerRef}
								{...provided.droppableProps}
							>
								{boards.map((item, index) => (
									<Draggable
										key={item.id}
										draggableId={item.id}
										index={index}
									>
										{(provided, snapshot) => (
											<ListItemButton
												ref={provided.innerRef}
												{...provided.dragHandleProps}
												{...provided.draggableProps}
												selected={index === activeIndex}
												component={Link}
												to={`/boards/${item.id}`}
												sx={{
													ml: '36px',
													borderRadius: '14px',
													cursor: snapshot.isDragging
														? 'grab'
														: 'pointer!important'
												}}
											>
												<Typography
													variant='body1'
													fontSize='large'
													sx={{
														whiteSpace: 'nowrap',
														overflow: 'hidden',
														textOverflow: 'ellipsis'
													}}
												>
													{item.icon} {item.title}
												</Typography>
											</ListItemButton>
										)}
									</Draggable>
								))}
								{provided.placeholder}
							</div>
						)}
					</Droppable>
				</DragDropContext>
			</List>
		</Box>
	);
};

export default Sidebar;
