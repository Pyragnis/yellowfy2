// searchReducer.js

// Initial state
const initialState = {
    searchQuery: '',
  };
  
  // Action types
  const SET_SEARCH_QUERY = 'SET_SEARCH_QUERY';
  
  // Action creators
  export const setSearchQuery = (query) => ({
    type: SET_SEARCH_QUERY,
    payload: query,
  });
  
  // Reducer function
  const searchReducer = (state = initialState, action) => {
    switch (action.type) {
      case SET_SEARCH_QUERY:
        return {
          ...state,
          searchQuery: action.payload,
        };
      default:
        return state;
    }
  };
  
  export default searchReducer;
  