import { useState } from 'react';
import authApi from '../api/authApi';
import { Box, TextField, Link, InputAdornment } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import { useNavigate } from 'react-router-dom';
import { VpnKey, PersonRounded } from '@mui/icons-material';

const SignUp = () => {
	const navigate = useNavigate();

	const [loading, setLoading] = useState(false);
	const [usernameErrorText, setUsernameErrorText] = useState('');
	const [passwordErrorText, setPasswordErrorText] = useState('');
	const [confirmPasswordErrorText, setConfirmPasswordErrorText] =
		useState('');

	const handleSubmit = async (event) => {
		event.preventDefault();
		setUsernameErrorText('');
		setPasswordErrorText('');
		setConfirmPasswordErrorText('');

		const data = new FormData(event.target);
		const username = data.get('username').trim();
		const password = data.get('password').trim();
		const confirmPassword = data.get('confirmPassword').trim();

		let error = false;

		if (username === '') {
			error = true;
			setUsernameErrorText('Please provide your username.');
		}
		if (password === '') {
			error = true;
			setPasswordErrorText('Please enter your pasword.');
		}
		if (confirmPassword === '') {
			error = true;
			setConfirmPasswordErrorText('Enter password again to confirm.');
		}
		if (confirmPassword !== password) {
			error = true;
			setConfirmPasswordErrorText("The passwords don't match.");
		}

		if (error) return;

		setLoading(true);

		try {
			let res = await authApi.signup({
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
				if (e.param === 'confirmPassword')
					setConfirmPasswordErrorText(e.msg);
			});
			setLoading(false);
		}
	};

	return (
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
				<h1>Sign Up</h1>
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
					id='confirmPasssword'
					label='Confirm Password'
					name='confirmPassword'
					type='password'
					disabled={loading}
					error={confirmPasswordErrorText !== ''}
					helperText={confirmPasswordErrorText}
				/>
				<LoadingButton
					fullWidth
					sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
					variant='contained'
					type='submit'
					loading={loading}
				>
					SIGN UP
				</LoadingButton>
				<p>
					Already have an account?{' '}
					<Link
						href='/login'
						underline='hover'
						sx={{ textTransform: 'none' }}
					>
						Login
					</Link>
				</p>
			</Box>
	);
};

export default SignUp;
