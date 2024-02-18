import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {map: []},
  reducers: {
    setInitialMapPost: (state, {payload: {post}}) => {
      if (post != undefined) {
        state.map = post;
      }
    },
    appendMapPost: (state, {payload: {post}}) => {
      if (post != undefined) {
        state.map = state.map.concat(post);
      }
    },
    removeMapPost: (state, {payload: {postId}}) => {
      const a = state.map;
      let b = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i].postId == postId) {
          continue;
        }
        b.push(a[i]);
      }
      state.map = Array.from(b);
    },
  },
});
export const {setInitialMapPost, appendMapPost, removeMapPost} = slice.actions;
export default slice.reducer;
