import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'newPost',
  initialState: {newPost: false},
  reducers: {
    setInitialNewPost: state => {
      state.newPost = false;
    },
    updateNewPost: (state, {payload: {newState}}) => {
      state.newPost = newState;
    },
  },
});
export const {setInitialNewPost, updateNewPost} = slice.actions;
export default slice.reducer;
