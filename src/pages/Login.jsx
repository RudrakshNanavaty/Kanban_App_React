import { useState } from 'react';
import { Box, TextField, Link, InputAdornment } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import authApi from '../api/authApi';
import { useNavigate } from 'react-router-dom';
import { VpnKey, PersonRounded } from '@mui/icons-material';

const Login = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrorText, setUsernameErrorText] = useState('');
	const [passwordErrorText, setPasswordErrorText] = useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setUsernameErrorText('');
		setPasswordErrorText('');

		const data = new FormData(event.target);
		const username = data.get('username').trim();
		const password = data.get('password').trim();

		let error = false;

		if (username === '') {
			error = true;
			setUsernameErrorText('Please provide your username.');
		}
		if (password === '') {
			error = true;
			setPasswordErrorText('Please enter your pasword.');
		}

		if (error) return;

		setLoading(true);

		try {
			let res = await authApi.login({
				username,
				password
			});
			setLoading(false);

			localStorage.setItem('token', res.token);
			navigate('/');
		} catch (err) {
			const errors = err.data.errors;

			errors.forEach((e) => {
				if (e.param === 'username') setUsernameErrorText(e.msg);
				if (e.param === 'password') setPasswordErrorText(e.msg);
			});
			setLoading(false);
		}
	};

	return (
		<div>
			<Box
				component='form'
				sx={{
					p: '2vh 2vw',
					mt: 1,
					backgroundColor: 'background.light',
					borderRadius: '20px'
				}}
				onSubmit={handleSubmit}
				noValidate
				width='25vw'
				display='flex'
				flexDirection='column'
				alignItems='center'
				justifyContent='center'
			>
				<h1>Login</h1>
				<TextField
					margin='normal'
					required
					autoFocus
					fullWidth
					sx={{
						'& .MuiOutlinedInput-root': {
							'& > fieldset': {
								borderWidth: '2px'
							}
						},
						'& .MuiOutlinedInput-input': {
							paddingLeft: '14px'
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<PersonRounded />
							</InputAdornment>
						)
					}}
					id='username'
					label='Username'
					name='username'
					disabled={loading}
					error={usernameErrorText !== ''}
					helperText={usernameErrorText}
				/>
				<TextField
					margin='normal'
					required
					fullWidth
					sx={{
						'& .MuiOutlinedInput-root': {
							'& > fieldset': {
								borderWidth: '2px'
							}
						},
						'& .MuiOutlinedInput-input': {
							paddingLeft: '14px'
						}
					}}
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<VpnKey />
							</InputAdornment>
						)
					}}
					id='passsword'
					label='Password'
					name='password'
					type='password'
					disabled={loading}
					error={passwordErrorText !== ''}
					helperText={passwordErrorText}
				/>
				<LoadingButton
					fullWidth
					sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
					variant='contained'
					type='submit'
					loading={loading}
				>
					LOGIN
				</LoadingButton>
				<p>
					Don't have an account?{' '}
					<Link
						href='/signup'
						underline='hover'
						sx={{ textTransform: 'none' }}
					>
						Create one
					</Link>
				</p>
			</Box>
		</div>
	);
};

export default Login;
