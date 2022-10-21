// React
import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
// MUI
import { Box, Grid } from '@mui/material';
// local files
import authUtils from '../../utils/authUtils';
import Loading from '../common/Loading';
import Sidebar from '../common/Sidebar';
import { setUser } from '../../redux/features/userSlice';

const AppLayout = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const user = await authUtils.isAuthenticated();

			// go back to login if user doesn't exist
			if (!user) navigate('/login');
			else {
				dispatch(setUser(user));
				setLoading(false);
			}
		};

		checkAuth();
	}, [navigate, dispatch]);

	return loading ? (
		<Loading fullHeight />
	) : (
		<Box sx={{ p: '2.5vh', height: '100vh' }}>
			<Grid container columnSpacing={'2.5vh'} sx={{ height: '100%' }}>
				<Grid item xs={2} sx={{ borderRadius: '24px' }}>
					<Sidebar />
				</Grid>

				<Grid item xs={10} sx={{ borderRadius: '24px' }}>
					<Outlet />
				</Grid>
			</Grid>
		</Box>
	);
};

export default AppLayout;
