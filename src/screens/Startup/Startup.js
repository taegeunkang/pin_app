import React, {useEffect} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {setDefaultTheme} from '../../store/theme';
import {useTheme} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {API_URL} from '../../utils/constants';

const Startup = ({navigation}) => {
  const {Layout, Gutters, Fonts} = useTheme();

  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
      }, 2000),
    );
    setDefaultTheme({theme: 'default', darkMode: null});

    let token = await AsyncStorage.getItem('token');
    let refreshToken = await AsyncStorage.getItem('refreshToken');
    console.log(token);
    if (token && token.length > 0 && refreshToken && refreshToken.length > 0) {
      const result1 = checkLogin(token);
      console.log('???');
      console.log('토큰 유효성 ' + result1 ? 'Vaild' : 'UnValid');
      // 토큰이 만료되었을 때 -> 리프레시 토큰으로 재발급 시도
      if (!result1) {
        console.log('reissue');
        reIssue(token, refreshToken);
      }
    } else {
      navigation.reset({
        index: 0,
        routes: [{name: 'Login'}],
      });
    }
  };
  // 토큰 체크 후 리프레시 토큰까지 만료되었으면 로그인 홈으로 옮긴다.
  const checkLogin = async token => {
    let response = await fetch(API_URL + '/user/check', {
      method: 'POST',
      headers: {Authorization: 'Bearer ' + token},
    });
    console.log(response.status);
    switch (response.status) {
      case 200:
        navigation.reset({routes: [{name: 'Home'}]});
        break;
      case 400:
        return false;
    }
  };

  // 토큰 재발급에도 실패하면 로그인 홈으로 이동
  // 아직 테스트 안했음
  const reIssue = async (token, refreshToken) => {
    let response = await fetch(API_URL + '/user/refresh', {
      method: 'POST',
      body: JSON.stringify({token: token, refreshToken: refreshToken}),
    });
    switch (response.status) {
      case 200:
        let responseJson = await response.json();
        AsyncStorage.setItem('token', responseJson['token']);
        AsyncStorage.setItem('refreshToken', response['refreshToken']);
        break;
      default:
        AsyncStorage.removeItem('token');
        AsyncStorage.removeItem('refreshToken');
        navigation.reset({
          index: 0,
          routes: [{name: 'Login'}],
        });
    }
  };

  useEffect(() => {
    init();
  }, []);
  return (
    <View style={[Layout.fill, Layout.colCenter]}>
      <ActivityIndicator size={'large'} style={[Gutters.largeVMargin]} />
      <Text style={Fonts.textCenter}>hhh</Text>
    </View>
  );
};

export default Startup;
