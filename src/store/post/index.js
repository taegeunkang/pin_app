import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'post',
  initialState: {post: {}},
  reducers: {
    setInitialPostReset: state => {
      state.post = {};
    },
    setInitialPost: (state, {payload: {userId, post}}) => {
      if (userId != undefined && post != undefined) {
        state.post[userId] = post;
      }
    },
    appendPost: (state, {payload: {userId, post}}) => {
      if (state.post[userId]) {
        for (let i = 0; i > state.post[userId].length; i++) {
          if (state.post[userId][i].postId == post.postId) {
            return;
          }
        }
      }

      if (userId != undefined && post != undefined) {
        if (state.post[userId])
          state.post[userId] = state.post[userId].concat(post);
        else state.post[userId] = [post];
      }
    },
    removePost: (state, {payload: {userId, postId}}) => {
      state.post[userId] = state.post[userId].filter(
        item => item.postId !== postId,
      );
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
  setInitialPostReset,
  setInitialPost,
  appendPost,
  likeToggle,
  setLikeCount,
  setCommentCount,
} = slice.actions;
export default slice.reducer;
