import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// MUI
import { Box, IconButton, TextField } from '@mui/material';
// icons
import {
	StarRounded,
	DeleteRounded,
	StarBorderRounded
} from '@mui/icons-material/';
// local files
import boardApi from '../api/boardApi';
import EmojiPicker from '../components/common/EmojiPicker';
import { setBoards } from '../redux/features/boardSlice';
import { setFavouriteList } from '../redux/features/favouriteSlice';
import Kanban from '../components/common/Kanban';


let timer;
const timeout = 500;

const Board = () => {
	const { boardId } = useParams();

	const [title, setTitle] = useState('');
	const [description, setDescription] = useState('');
	const [sections, setSections] = useState([]);
	const [isFavourite, setIsFavourite] = useState();
	const [icon, setIcon] = useState('');

	const dispatch = useDispatch();
	const navigate = useNavigate();

	const boards = useSelector(state => state.board.value);
	const favouriteList = useSelector(state => state.favourites.value);

	// Update if the board changes
	useEffect(() => {
		const getBoard = async () => {
			try {
				// getting board from DB
				const res = await boardApi.getOne(boardId);
				// storing board contents in components
				setTitle(res.title);
				setDescription(res.description);
				setSections(res.sections);
				setIsFavourite(res.favourite);
				setIcon(res.icon);
			} catch (err) {
				console.log(err);
			}
		};
		getBoard();
	}, [boardId]);

	// Change board icon
	const onIconChange = async newIcon => {
		let temp = [...boards];
		const index = temp.findIndex(e => e.id === boardId);
		temp[index] = { ...temp[index], icon: newIcon };

		if (isFavourite) {
			let tempFavourite = [...favouriteList];
			const favouriteIndex = tempFavourite.findIndex(
				e => e.id === boardId
			);
			tempFavourite[favouriteIndex] = {
				...tempFavourite[favouriteIndex],
				icon: newIcon
			};
			dispatch(setFavouriteList(tempFavourite));
		}

		setIcon(newIcon);
		dispatch(setBoards(temp));
		try {
			await boardApi.update(boardId, { icon: newIcon });
		} catch (err) {
			alert(err);
		}
	};

	// Update board title
	const updateTitle = e => {
		clearTimeout(timer);
		const newTitle = e.target.value;
		setTitle(newTitle);

		let temp = [...boards];
		const index = temp.findIndex(e => e.id === boardId);
		temp[index] = { ...temp[index], title: newTitle };

		if (isFavourite) {
			let tempFavourite = [...favouriteList];
			const favouriteIndex = tempFavourite.findIndex(
				e => e.id === boardId
			);
			tempFavourite[favouriteIndex] = {
				...tempFavourite[favouriteIndex],
				title: newTitle
			};
			dispatch(setFavouriteList(tempFavourite));
		}

		dispatch(setBoards(temp));

		timer = setTimeout(async () => {
			try {
				await boardApi.update(boardId, { title: newTitle });
			} catch (err) {
				alert(err);
			}
		}, timeout);
	};

	// Update board description
	const updateDescription = e => {
		clearTimeout(timer);
		const newDescription = e.target.value;
		setDescription(newDescription);

		timer = setTimeout(async () => {
			try {
				await boardApi.update(boardId, { description: newDescription });
			} catch (err) {
				alert(err);
			}
		}, timeout);
	};

	// Toggle favourite state of board
	const toggleFavourite = async () => {
		try {
			const board = await boardApi.update(boardId, {
				favourite: !isFavourite
			});
			let newFavouriteList = [...favouriteList];
			if (isFavourite) {
				newFavouriteList = newFavouriteList.filter(
					e => e.id !== boardId
				);
			} else {
				newFavouriteList.unshift(board);
			}
			dispatch(setFavouriteList(newFavouriteList));
			setIsFavourite(!isFavourite);
		} catch (err) {
			console.log(err);
		}
	};

	// Delete a board
	const deleteBoard = async () => {
		try {
			await boardApi.deleteBoard(boardId);

			if (isFavourite) {
				const newFavouriteList = favouriteList.filter(
					e => e.id !== boardId
				);

				dispatch(setFavouriteList(newFavouriteList));
			}

			const newList = boards.filter(e => e.id !== boardId);
			dispatch(setBoards(newList));

			if (newList.length === 0) {
				navigate('/boards');
			} else {
				navigate(`/boards/${newList[0].id}`);
			}
		} catch (err) {
			console.log(err);
		}
	};

	return (
		<Box
			sx={{
				p: '15px 20px',
				width: '100%',
				height: '100%',
				borderRadius: 'inherit',
				backgroundColor: 'background.light'
			}}
		>
			{/* Top Buttons */}
			<Box
				sx={{
					mb: '10px',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'space-between',
				}}
			>
				{/* Toggle Favourite button */}
				<IconButton onClick={toggleFavourite}>
					{isFavourite ? (
						<StarRounded color='warning' fontSize='large' />
					) : (
						<StarBorderRounded color='warning' fontSize='large' />
					)}
				</IconButton>

				{/* Delete button */}
				<IconButton variant='rounded' onClick={deleteBoard}>
					<DeleteRounded color='error' fontSize='large' />
				</IconButton>
			</Box>

			{/* Icon, Title and Description */}
			<Box sx={{ display: 'flex', flexDirection: 'column' }}>
				<Box sx={{ ml: '10px', display: 'flex' }}>
					{/* Icon */}
					<EmojiPicker icon={icon} onChange={onIconChange} />

					{/* Title */}
					<TextField
						value={title}
						onChange={updateTitle}
						placeholder='Untitled'
						variant='outlined'
						fullWidth
						sx={{
							ml: '12px',
							'& .MuiOutlinedInput-input': { padding: 0 },
							'& .MuiOutlinedInput-notchedOutline': {
								border: 'unset'
							},
							'& .MuiOutlinedInput-root': {
								fontSize: '2rem',
								fontWeight: '700'
							}
						}}
					/>
				</Box>

				{/* Description */}
				<TextField
					value={description}
					onChange={updateDescription}
					placeholder='Add a description...'
					variant='outlined'
					multiline
					fullWidth
					sx={{
						'& .MuiOutlinedInput-input': { padding: 0 },
						'& .MuiOutlinedInput-notchedOutline': {
							border: 'unset'
						},
						'& .MuiOutlinedInput-root': { fontSize: '1rem' }
					}}
				/>
			</Box>

			{/* Kanban Board */}
			<Kanban data={sections} boardId={boardId} isFavourite={isFavourite} />
		</Box>
	);
};

export default Board;
