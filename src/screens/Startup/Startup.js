import React, {useEffect} from 'react';
import {ActivityIndicator, View, Text} from 'react-native';
import {setDefaultTheme} from '../../store/theme';
import {useTheme} from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    // 서버에 요청 보내서 유효한 토큰인지 확인하는 로직 추가 필요
    if (token && token.length > 0) {
      navigation.reset({routes: [{name: 'Home'}]});
    } else {
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
