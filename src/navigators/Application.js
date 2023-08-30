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
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
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
import {Colors} from '../theme/Variables';
import MapNavigator from './MapNavigator';
import UserPage from '../screens/Home/UserPage';
import ProfileImage from '../screens/Home/ProfileImage';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
import DetailMention from '../screens/Home/DetailMention';
import Detail from '../screens/Home/Detail';
import Search from '../screens/Home/Search';
const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const {t} = useTranslation(['login', 'myPage']);
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
            headerStyle: {backgroundColor: Colors.white},
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
              title: t('login:header.register'),
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
              headerTitle: t('login:profileSetting'),
            }}
          />
          <Stack.Screen
            name={'검색'}
            component={Search}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Home"
            component={NavNavigator}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="MapNavigator"
            component={MapNavigator}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="UserPage"
            component={UserPage}
            options={{headerShown: true, headerTitle: '프로필'}}
          />

          <Stack.Screen
            name="FollowerList"
            component={FollowerList}
            options={{
              headerShown: true,
              headerTitle: t('myPage:profile.follower'),
            }}
          />
          <Stack.Screen
            name="FollowingList"
            component={FollowingList}
            options={{
              headerShown: true,
              headerTitle: t('myPage:profile.following'),
            }}
          />
          <Stack.Screen
            name="Detail"
            component={Detail}
            options={{
              headerBackTitleVisible: false,
              headerTitle: t('myPage:profile.detail'),
            }}
          />
          <Stack.Screen
            name="DetailMention"
            component={DetailMention}
            options={{
              headerBackTitleVisible: false,
              headerTitle: t('myPage:post.friends'),
            }}
          />
          <Stack.Screen
            name="ProfileImage"
            component={ProfileImage}
            options={{
              headerBackTitleVisible: false,
              headerTitle: t('myPage:profile.profileImage'),
            }}
          />
          <Stack.Screen
            name="BackgroundImage"
            component={BackgroundImage}
            options={{
              headerBackTitleVisible: false,
              headerTitle: t('myPage:profile.backgroundImage'),
            }}
          />
          <Stack.Screen
            name="Nickname"
            component={Nickname}
            options={{
              headerBackTitleVisible: false,
              headerTitle: t('myPage:profile.nickname'),
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
export default ApplicationNavigator;
