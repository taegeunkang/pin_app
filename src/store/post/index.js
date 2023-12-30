import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'post',
  initialState: {post: []},
  reducers: {
    setInitialPost: (state, {payload: {post}}) => {
      state.post = post;
    },
    appendPost: (state, {payload: {post}}) => {
      state.post = state.post.concat(post);
    },
    likeToggle: (state, {payload: {postId}}) => {
      state.post[postId] = {
        ...state.post[postId],
        liked: !state.post[postId].liked,
      };
    },
    addLikeCount: (state, {payload: postId}) => {
      state.post[postId] = {
        ...state.post[postId],
        likesCount: state.post[postId].likesCount + 1,
      };
    },
    subLikeCount: (state, {payload: postId}) => {
      if (state.post[postId].likesCount - 1 < 0) {
        return;
      }
      state.post[postId] = {
        ...state.post[postId],
        likesCount: state.post[postId].likesCount - 1,
      };
    },
    addCommentCount: (state, {payload: postId}) => {
      state.post[postId] = {
        ...state.post[postId],
        commentsCount: state.post[postId].commentsCount + 1,
      };
    },
    subCommentCount: (state, {payload: postId}) => {
      if (state.post[postId].commentsCount - 1 < 0) {
        return;
      }
      state.post[postId] = {
        ...state.post[postId],
        commentsCount: state.post[postId].commentsCount - 1,
      };
    },
  },
});
export const {addVal, subVal} = slice.actions;
export default slice.reducer;
