import {combineTransition} from 'react-native-reanimated';
import {API_URL} from './constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';

export const reIssue = async () => {
  const emailAddress = await AsyncStorage.getItem('emailAddress');
  const refreshToken = await AsyncStorage.getItem('refreshToken');

  console.log('재발급 시도', emailAddress, refreshToken);

  let response = await fetch(API_URL + '/user/refresh', {
    method: 'POST',
    headers: {
      Authorization: 'Bearer ' + refreshToken,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      emailAddress: emailAddress,
      refreshToken: 'Bearer ' + refreshToken,
    }),
  });
  console.log('상태 ', response.status);
  const result = await response.json();
  if (response.status == 200) {
    await AsyncStorage.setItem('token', result['token']);
    await AsyncStorage.setItem('refreshToken', result['refreshToken']);
    // Alert.alert("재발급 완료")
    return true;
  } else {
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('refreshToken');
    return false;
  }
};
