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

const initialState = {
  currentPost: null,
  error: '',
  isLoading: false,
  items: [],
};

export default (state = initialState, action) => {
  switch (action.type) {
    case START_LOADING:
      return { ...state, isLoading: true };
    case END_LOADING:
      return { ...state, isLoading: false };
    case FETCH_ALL:
      return { ...state, items: action.payload };
    case FETCH_POST:
      return { ...state, currentPost: action.payload };
    case LIKE:
    case UPDATE:
      return {
        ...state,
        currentPost: state.currentPost?._id === action.payload._id ? action.payload : state.currentPost,
        items: state.items.map((post) => (post._id === action.payload._id ? action.payload : post)),
      };
    case CREATE:
      return {
        ...state,
        currentPost: action.payload,
        items: [action.payload, ...state.items],
      };
    case DELETE:
      return {
        ...state,
        currentPost: state.currentPost?._id === action.payload ? null : state.currentPost,
        items: state.items.filter((post) => post._id !== action.payload),
      };
    case SET_ERROR:
      return { ...state, error: action.payload };
    case CLEAR_CURRENT_POST:
      return { ...state, currentPost: null };
    default:
      return state;
  }
};
