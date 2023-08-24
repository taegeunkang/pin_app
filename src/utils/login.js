import {API_URL} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const reIssue = async () => {
  const token = await AsyncStorage.getItem('token');
  const refreshToken = await AsyncStorage.getItem('refreshToken');
  
  let response = await fetch(API_URL + '/user/refresh', {
    method: 'POST',
    body: JSON.stringify({
      token: 'Bearer ' + token,
      refreshToken: 'Bearer ' + refreshToken,
    }),
    headers: {
      Authorization: 'Bearer ' + refreshToken,
      'Content-Type': 'Application/json',
    },
  });
  const result = await response.json();
  if (response.status == 200) {
    await AsyncStorage.setItem('token', result['token']);
    await AsyncStorage.setItem('refreshToken', result['refreshToken']);
    return true;
  } else {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    return false;
  }
};
