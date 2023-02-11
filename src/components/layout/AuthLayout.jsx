import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Container, Box, Typography } from '@mui/material';
import authUtils from '../../utils/authUtils';
import Loading from '../common/Loading';
import assets from '../../assets';

const AuthLayout = props => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const checkAuth = async () => {
			const isAuth = await authUtils.isAuthenticated();

			if (!isAuth) setLoading(false);
			else navigate('/');
		};

		checkAuth();
	}, [navigate]);

	return loading ? (
		<Loading fullHeight />
	) : (
		<Container>
			<Box
				sx={{
					mt: '10vh',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
				}}
			>
				<Box sx={{ display: 'flex' }}>
					<img
						src={assets.images.logo}
						style={{
							width: '100px',
							margin: '0 15px 2vh 0',
						}}
						alt='Logo'
					/>
					<Typography variant='h2'>Kanban</Typography>
				</Box>
				<Outlet />
			</Box>
		</Container>
	);
};

export default AuthLayout;
