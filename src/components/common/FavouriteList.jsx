import { Box, ListItem, ListItemButton, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from 'react-router-dom';
import boardApi from '../../api/boardApi';
import { setFavouriteList } from '../../redux/features/favouriteSlice';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { StarRounded } from '@mui/icons-material';

const FavouriteList = () => {
	const dispatch = useDispatch();
	const list = useSelector((state) => state.favourites.value);
	const [activeIndex, setActiveIndex] = useState(0);
	const { boardId } = useParams();

	useEffect(() => {
		const getBoards = async () => {
			try {
				const res = await boardApi.getFavourites();
				dispatch(setFavouriteList(res));
			} catch (err) {
				alert(err);
			}
		};
		getBoards();
	}, [dispatch]);

	useEffect(() => {
		const index = list.findIndex((e) => e.id === boardId);
		setActiveIndex(index);
	}, [list, boardId]);

	// for drag/drop of boards in sidebar
	const onDragEnd = async ({ source, destination }) => {
		const newList = [...list];
		const [removed] = newList.splice(source.index, 1);
		newList.splice(destination.index, 0, removed);

		const activeItem = newList.findIndex((e) => e.id === boardId);
		setActiveIndex(activeItem);

		dispatch(setFavouriteList(newList));

		try {
			await boardApi.updateFavouritePosition({ boards: newList });
		} catch (err) {
			alert(err);
		}
	};

	return (
		<Box>
			{/* Heading */}
			<ListItem>
				<Box
					sx={{
						width: '100%',
						display: 'flex',
						alignItems: 'center'
					}}
					color='warning.main'
				>
					<StarRounded sx={{ mr: '10px' }} />

					<Typography
						fontSize='large'
						variant='body1'
						fontWeight='700'
					>
						Favourites
					</Typography>
				</Box>
			</ListItem>

			{/* Favourite boards that user can drag/drop */}
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
							{list.map((item, index) => (
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
												ml: '40px',
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
		</Box>
	);
};

export default FavouriteList;
