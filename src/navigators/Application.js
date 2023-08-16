import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  Button,
  Pressable,
  Text,
  View,
} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Startup from '../screens/Startup/Startup';
import {useTheme} from '../hooks';
// import ContentNavigator from './Content';
import NavNavigator from './Nav';
import {useFlipper} from '@react-navigation/devtools';
import Login from '../screens/Login/Login';
import Register from '../screens/Login/Register';
import Congraturation from '../screens/Login/Congraturation';
import {useTranslation} from 'react-i18next';
import {Colors} from '../theme/Variables';
// import Home from '../screens/Home/Home';
const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const {t} = useTranslation('login');
  const {Layout, darkMode, NavigationTheme} = useTheme();
  const {colors} = NavigationTheme;
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  return (
    <View style={[Layout.fill, {backgroundColor: colors.card}]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{headerShown: true}}>
          <Stack.Screen
            name="Startup"
            component={Startup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Login" component={Login} options={{title: ''}} />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: t('header.register'),
              headerTintColor: '#353C49',
              headerTitleStyle: {color: '#353C49'},
              headerBackTitleVisible: false,
            }}
          />
          <Stack.Screen
            name="Congraturation"
            component={Congraturation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="Home"
            component={NavNavigator}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
export default ApplicationNavigator;
