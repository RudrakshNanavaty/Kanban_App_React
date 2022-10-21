import axiosClient from './axiosClient';

const boardApi = {
	getAll: async () => await axiosClient.get('boards'),

	create: async () => await axiosClient.post('boards'),

	updatePosition: async (params) => await axiosClient.put('boards', params),

	getOne: async (id) => await axiosClient.get(`boards/${id}`),

	deleteBoard: async (id) => await axiosClient.delete(`boards/${id}`),

	update: async (id, params) => await axiosClient.put(`boards/${id}`, params),

	getFavourites: async () => await axiosClient.get('boards/favourites'),

	updateFavouritePosition: async (params) =>
		await axiosClient.put('boards/favourites', params)
};

export default boardApi;
