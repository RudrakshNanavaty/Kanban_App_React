import axiosClient from './axiosClient';

const authApi = {
	signup: async (params) => {
		return await axiosClient.post('auth/signup', params);
	},
	login: async (params) => {
		return await axiosClient.post('auth/login', params);
	},
	verifyToken: async () => {
		return await axiosClient.post('auth/verify-token');
	}
};

export default authApi;
