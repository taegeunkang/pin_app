import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'post',
  initialState: {post: {}},
  reducers: {
    setInitialPost: (state, {payload: {userId, post}}) => {
      if (userId != undefined && post != undefined) {
        state.post[userId] = post;
      }
    },
    appendPost: (state, {payload: {userId, post}}) => {
      if (userId != undefined && post != undefined) {
        state.post[userId] = state.post[userId].concat(post);
      }
    },
    removePost: (state, {payload: {userId, postId}}) => {
      const a = state.post[userId];
      let b = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i].postId == postId) {
          continue;
        }
        b.push(a[i]);
      }

      state.post[userId] = Array.from(b);
    },
    likeToggle: (state, {payload: {userId, postId}}) => {
      let idx = -1;

      for (let i = 0; i < state.post[userId].length; i++) {
        if (state.post[userId][i].postId === postId) {
          idx = i;
        }
      }

      state.post[userId][idx] = {
        ...state.post[userId][idx],
        liked: !state.post[userId][idx].liked,
      };
    },
    setLikeCount: (state, {payload: {userId, postId, count}}) => {
      let idx = -1;

      for (let i = 0; i < state.post[userId].length; i++) {
        if (state.post[userId][i].postId == postId) {
          idx = i;
        }
      }
      state.post[userId][idx] = {
        ...state.post[userId][idx],
        likesCount: count,
      };
    },

    setCommentCount: (state, {payload: {userId, postId, count}}) => {
      let idx = -1;

      for (let i = 0; i < state.post[userId].length; i++) {
        if (state.post[userId][i].postId == postId) {
          idx = i;
        }
      }

      state.post[userId][idx] = {
        ...state.post[userId][idx],
        commentsCount: count,
      };
    },
  },
});
export const {
  setInitialPost,
  appendPost,
  likeToggle,
  setLikeCount,
  setCommentCount,
} = slice.actions;
export default slice.reducer;
