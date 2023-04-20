import React, { useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import { setDefaultTheme } from '../../store/theme';
import { useTheme } from '../../hooks';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Startup = ({ navigation }) => {
  const { Layout, Gutters, Fonts } = useTheme();

  const init = async () => {
    await new Promise(resolve =>
      setTimeout(() => {
        resolve(true);
      }, 2000),
    );
    setDefaultTheme({ theme: 'default', darkMode: null });

    let token = await AsyncStorage.getItem('token');
    if (token && token.length > 0) {
      // navigation.reset({ routes: [{ name: 'Home' }] });
      // navigation.push('Content');
    } else {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
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
