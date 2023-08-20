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
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import ProfileInitialSetting from '../screens/Login/ProfileInitialSetting';
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
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerTintColor: '#1A1E27',
            headerTitleStyle: {
              color: '#1A1E27',
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
            },
            headerBackTitleVisible: false,
            cardStyleInterpolator: ({current, next, layouts}) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateX: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.width, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}>
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
            name="ProfileInitialSetting"
            component={ProfileInitialSetting}
            options={{
              headerShown: true,
              headerTitle: t('profileSetting'),
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
