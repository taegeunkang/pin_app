import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import MyPage from '../screens/Home/MyPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import ProfileImage from '../screens/Home/ProfileImage';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
import DetailMention from '../screens/Home/DetailMention';
import Home from '../screens/Home/Home';
import Detail from '../screens/Home/Detail';
import {useTheme} from '../hooks';
import UserPage from '../screens/Home/UserPage';
const Stack = createStackNavigator();

// @refresh reset
const MapNavigator = props => {
  const {t} = useTranslation('myPage');
  const {Fonts, Colors} = useTheme();
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: Colors.headerTitle,
          ...Fonts.contentMediumBold,
        },
        headerStyle: {backgroundColor: Colors.contentBackground},
        headerBackImage: () => (
          <HeaderLeftButton onPress={() => props.navigation.pop()} />
        ),
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
        name="Map"
        component={Home}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="MapDetail"
        component={Detail}
        options={{
          headerShown: true,
          headerTitle: '게시글',
          presentation: 'transparentModal',
          cardStyleInterpolator: ({current, layouts}) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateY: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.height, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      />

      <Stack.Screen
        name="UserPage"
        component={UserPage}
        options={{
          headerShown: true,
          headerTitle: '프로필',
        }}
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
  );
};
export default MapNavigator;
