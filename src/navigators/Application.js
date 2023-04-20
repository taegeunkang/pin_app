import React from 'react';
import { SafeAreaView, StatusBar, Button, Pressable, Text } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Startup from '../screens/Startup/Startup';
import { useTheme } from '../hooks';
import ContentNavigator from './Content';
import { useFlipper } from '@react-navigation/devtools';
import Login from '../screens/Login/Login';
// import Register from '../screens/Login/Register';
// import Home from '../screens/Home/Home';
const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const { Layout, darkMode, NavigationTheme } = useTheme();
  const { colors } = NavigationTheme;
  const navigationRef = useNavigationContainerRef();
  useFlipper(navigationRef);
  return (
    <SafeAreaView style={[Layout.fill, { backgroundColor: colors.card }]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <StatusBar barStyle={darkMode ? 'light-content' : 'dark-content'} />
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="Startup" component={Startup} />
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ title: '' }}
          />
          {/* <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: t('header.register'),
              headerTintColor: Colors.black,
              headerTitleStyle: { color: Colors.black },
            }}
          /> */}
          {/* <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: t('header.register'),
              headerTintColor: Colors.transparent,
              headerTitleStyle: { color: Colors.transparent },
              headerShown: false,
            }}
          /> */}
          {/* <Stack.Screen
            name="Home"
            component={ContentNavigator}
            options={{ headerShown: false }}
          /> */}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
};
export default ApplicationNavigator;
