import {
  CLEAR_CURRENT_POST,
  CREATE,
  DELETE,
  END_LOADING,
  FETCH_ALL,
  FETCH_POST,
  LIKE,
  SET_ERROR,
  START_LOADING,
  UPDATE,
} from '../constants/actionTypes';

import * as api from '../api';

const getErrorMessage = (error) => error?.response?.data?.message || error.message || 'Unexpected request error.';

export const getPosts = (filters = {}) => async (dispatch) => {
  dispatch({ type: START_LOADING });

  try {
    const { data } = await api.fetchPosts(filters);
    dispatch({ type: FETCH_ALL, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    return [];
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const getPost = (id) => async (dispatch) => {
  dispatch({ type: START_LOADING });

  try {
    const { data } = await api.fetchPost(id);
    dispatch({ type: FETCH_POST, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  } finally {
    dispatch({ type: END_LOADING });
  }
};

export const createPost = (post) => async (dispatch) => {
  try {
    const { data } = await api.createPost(post);
    dispatch({ type: CREATE, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  }
};

export const updatePost = (id, post) => async (dispatch) => {
  try {
    const { data } = await api.updatePost(id, post);
    dispatch({ type: UPDATE, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  }
};

export const likePost = (id) => async (dispatch) => {
  try {
    const { data } = await api.likePost(id);
    dispatch({ type: LIKE, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  }
};

export const bookmarkPost = (id) => async (dispatch) => {
  try {
    const { data } = await api.toggleBookmarkPost(id);
    dispatch({ type: UPDATE, payload: data });
    dispatch({ type: SET_ERROR, payload: '' });
    return data;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  }
};

export const deletePost = (id) => async (dispatch) => {
  try {
    await api.deletePost(id);
    dispatch({ type: DELETE, payload: id });
    dispatch({ type: SET_ERROR, payload: '' });
    return id;
  } catch (error) {
    dispatch({ type: SET_ERROR, payload: getErrorMessage(error) });
    throw error;
  }
};

export const clearCurrentPost = () => ({ type: CLEAR_CURRENT_POST });
