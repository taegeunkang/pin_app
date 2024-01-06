import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'map',
  initialState: {map: []},
  reducers: {
    setInitialMapPost: (state, {payload: {post}}) => {
      if (post != undefined) {
        state.post = post;
      }
    },
    appendMapPost: (state, {payload: {post}}) => {
      if (post != undefined) {
        state.post = state.post.concat(post);
      }
    },
    removeMapPost: (state, {payload: {postId}}) => {
      const a = state.post;
      let b = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i].postId == postId) {
          continue;
        }
        b.push(a[i]);
      }
      state.post = b;
    },
  },
});
export const {setInitialMapPost, appendMapPost, removeMapPost} = slice.actions;
export default slice.reducer;
