import {createSlice} from '@reduxjs/toolkit';

const slice = createSlice({
  name: 'friends',
  initialState: {friends: []},
  reducers: {
    setInitialFriends: state => {
      state.friends = [];
    },
    addFriends: (state, {payload: {user}}) => {
      state.friends.push(user);
    },
    subFriends: (state, {payload: {user}}) => {
      let tmp = [];
      for (let i = 0; i < state.friends.length; i++) {
        if (state.friends[i].userId == user.userId) {
          continue;
        }
        tmp.push(user);
      }
      state.friends = tmp;
    },
  },
});
export const {setInitialFriends, addFriends, subFriends} = slice.actions;
export default slice.reducer;
