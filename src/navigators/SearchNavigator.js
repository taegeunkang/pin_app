import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import {useTheme} from '../hooks';
import MyPage from '../screens/Home/MyPage';
import Detail from '../screens/Home/Detail';
import ProfileImage from '../screens/Home/ProfileImage';
import DetailMention from '../screens/Home/DetailMention';
import FollowingList from '../screens/Home/FollowingList';
import FollowerList from '../screens/Home/FollowerList';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
import Search from '../screens/Home/Search';
import UserPage from '../screens/Home/UserPage';
const Stack = createStackNavigator();

// @refresh reset
const SearchNavigator = ({navigation}) => {
  const {t} = useTranslation('content');
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
          <HeaderLeftButton onPress={() => navigation.pop()} />
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
        name="Search"
        component={Search}
        options={{
          headerShown: false,
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
        name="BackgroundImage"
        component={BackgroundImage}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('myPage:profile.backgroundImage'),
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
        name="Nickname"
        component={Nickname}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('myPage:profile.nickname'),
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
    </Stack.Navigator>
  );
};
export default SearchNavigator;
