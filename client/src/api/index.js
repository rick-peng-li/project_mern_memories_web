import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || '/api';
const url = `${API_URL}/posts`;

export const fetchPosts = (params = {}) => axios.get(url, { params });
export const fetchDiscoverPosts = () => axios.get(`${url}/discover`);
export const fetchBookmarkedPosts = () => axios.get(`${url}/bookmarks`);
export const fetchTagsOverview = () => axios.get(`${url}/tags`);
export const fetchCreatorsOverview = () => axios.get(`${url}/creators`);
export const fetchTimelineOverview = () => axios.get(`${url}/timeline`);
export const fetchPost = (id) => axios.get(`${url}/${id}`);
export const createPost = (newPost) => axios.post(url, newPost);
export const likePost = (id) => axios.patch(`${url}/${id}/like`);
export const toggleBookmarkPost = (id) => axios.patch(`${url}/${id}/bookmark`);
export const updatePost = (id, updatedPost) => axios.patch(`${url}/${id}`, updatedPost);
export const deletePost = (id) => axios.delete(`${url}/${id}`);
