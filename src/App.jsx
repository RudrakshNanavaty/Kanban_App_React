import { BrowserRouter, Route, Routes } from 'react-router-dom';
// MUI
import { CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
// Fonts
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Local Files
import AppLayout from './components/layout/AppLayout';
import AuthLayout from './components/layout/AuthLayout';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Board from './pages/Board';
import assets from './assets';

function App() {
	const theme = createTheme({
		palette: assets.palette,
		shape: {
			borderRadius: 10,
		},
	});

	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<AuthLayout />}>
						<Route path='/login' element={<Login />} />
						<Route path='/signup' element={<SignUp />} />
					</Route>

					<Route path='/' element={<AppLayout />}>
						<Route index element={<Home />} />
						<Route path='/boards' element={<Home />} />
						<Route path='/boards/:boardId' element={<Board />} />
					</Route>
				</Routes>
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
