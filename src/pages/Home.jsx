import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/material';
import { useDispatch } from 'react-redux';
import { setBoards } from '../redux/features/boardSlice';
import { useNavigate } from 'react-router-dom';
import boardApi from '../api/boardApi';
import { useState } from 'react';

const Home = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(false);

	const createBoard = async () => {
		setLoading(true);
		try {
			// calling boardApi to create new board
			const res = await boardApi.create();

			dispatch(setBoards([res]));

			navigate(`/boards/${res._id}`);
		} catch (err) {
			console.log(err);
		} finally {
			setLoading(false);
		}
	};

	return (
		// rendering homepage
		<Box
			sx={{
				height: '100%',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center'
			}}
		>
			<LoadingButton
				variant='contained'
				onClick={createBoard}
				loading={loading}
			>
				CREATE NEW BOARD
			</LoadingButton>
		</Box>
	);
};

export default Home;
