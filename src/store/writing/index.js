import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'writing',
  initialState: {
    writing: {
      text: '',
      location: '',
      media: [],
      private: false,
      latitude: 0.0,
      longitude: 0.0,
    },
  },

  reducers: {
    setInitialWriting: state => {
      state.writing.text = '';
      state.writing.location = '';
      state.writing.media = [];
      state.writing.private = false;
      state.writing.latitude = 0.0;
      state.writing.longitude = 0.0;
    },
    saveText: (state, {payload: {text}}) => {
      state.writing.text = text;
    },
    saveLocation: (state, {payload: {location, latitude, longitude}}) => {
      state.writing.location = location;
      state.writing.latitude = latitude;
      state.writing.longitude = longitude;
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
