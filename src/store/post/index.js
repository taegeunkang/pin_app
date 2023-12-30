import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'post',
  initialState: {post: []},
  reducers: {
    setInitialPost: (state, {payload: {post}}) => {
      if (post != undefined) {
        state.post = Array.from(post);
      }
    },
    appendPost: (state, {payload: {post}}) => {
      state.post = post ? state.post.concat(post) : state.post;
    },
    removePost: (state, {payload: {postId}}) => {
      const a = state.post;
      let b = [];
      for (let i = 0; i < a.length; i++) {
        if (a[i].postId == postId) {
          continue;
        }
        b.push(a[i]);
      }

      state.post = Array.from(b);
    },
    likeToggle: (state, {payload: {postId}}) => {
      let idx = -1;

      for (let i = 0; i < state.post.length; i++) {
        if (state.post[i].postId == postId) {
          idx = i;
        }
      }

      state.post[idx] = {
        ...state.post[idx],
        liked: !state.post[idx].liked,
      };
      console.log(2);
    },
    setLikeCount: (state, {payload: {postId, count}}) => {
      let idx = -1;

      for (let i = 0; i < state.post.length; i++) {
        if (state.post[i].postId == postId) {
          idx = i;
        }
      }
      state.post[idx] = {
        ...state.post[idx],
        likesCount: count,
      };
    },

    setCommentCount: (state, {payload: {postId, count}}) => {
      let idx = -1;

      for (let i = 0; i < state.post.length; i++) {
        if (state.post[i].postId == postId) {
          idx = i;
        }
      }

      state.post[idx] = {
        ...state.post[idx],
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
