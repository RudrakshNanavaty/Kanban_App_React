import axios from 'axios';
import queryString from 'query-string';


const baseUrl = 'http://localhost:8001/api/v1';

const getToken = () => localStorage.getItem('token');

const axiosClient = axios.create({
	baseURL: baseUrl,
	paramsSerializer: (params) => queryString.stringify({ params })
});

axiosClient.interceptors.request.use(async (config) => {
	return {
		...config,
		headers: {
			'Content-Type': 'application/json',
			authorization: `Bearer ${getToken()}`
		}
	};
});

axiosClient.interceptors.response.use(
	(response) => {
		return response && response.data ? response.data : response;
	},
	(err) => {
		if (!err.response) return console.log(err);
		throw err.response;
	}
);

export default axiosClient;
