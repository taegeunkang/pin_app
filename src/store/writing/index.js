import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'writing',
  initialState: {writing: {text: '', location: '', media: [], private: false}},

  reducers: {
    setInitialWriting: state => {
      state.writing.text = '';
      state.writing.location = '';
      state.writing.media = [];
      state.writing.private = false;
    },
    saveText: (state, {payload: {text}}) => {
      state.writing.text = text;
    },
    saveLocation: (state, {payload: {location}}) => {
      state.writing.location = location;
    },
    saveMedia: (state, {payload: {media}}) => {
      state.writing.media = media;
    },
    savePrivate: (state, {payload: {isPrivate}}) => {
      state.writing.private = isPrivate;
    },
  },
});
export const {
  setInitialWriting,
  saveText,
  saveLocation,
  saveMedia,
  savePrivate,
} = slice.actions;
export default slice.reducer;
