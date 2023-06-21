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
    if (token && token.length > 0 && refreshToken && refreshToken.length > 0) {
      const result1 = await checkLogin(token);

      if (result1) {
        navigation.reset({routes: [{name: 'Home'}]});
      } else {
        // console.log('토큰 만료 재발급 시도 ');
        const result = await reIssue(token, refreshToken);
        if (!result) {
          navigation.reset({
            index: 0,
            routes: [{name: 'Login'}],
          });
        } else {
          navigation.reset({routes: [{name: 'Home'}]});
        }
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
    switch (response.status) {
      case 200:
        const res = await response.json();
        console.log('check successful id : ' + res['id']);
        await AsyncStorage.setItem('id', JSON.stringify(res['id']));

        return true;
      case 400:
        return false;
    }
  };

  // 토큰 재발급에도 실패하면 로그인 홈으로 이동
  const reIssue = async (token, refreshToken) => {
    let response = await fetch(API_URL + '/user/refresh', {
      method: 'POST',
      body: JSON.stringify({token: token, refreshToken: refreshToken}),
      headers: {
        Authorization: 'Bearer ' + refreshToken,
        'Content-Type': 'Application/json',
      },
    });
    const result = await response.json();
    if (response.status == 200) {
      console.log('성공');
      await AsyncStorage.setItem('token', result['token']);
      await AsyncStorage.setItem('refreshToken', result['refreshToken']);
      return true;
    } else {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      return false;
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
