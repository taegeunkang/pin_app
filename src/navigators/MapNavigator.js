import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import MyPage from '../screens/Home/MyPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Detail from '../screens/Home/Detail';
import Detail1 from '../screens/Home/Detail1';
import {Colors} from '../theme/Variables';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import ProfileImage from '../screens/Home/ProfileImage';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
import UserPage from '../screens/Home/UserPage';
import DetailMention from '../screens/Home/DetailMention';
const Stack = createStackNavigator();

// @refresh reset
const MapNavigator = props => {
  const {t} = useTranslation('myPage');
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: true,
        headerBackTitleVisible: false,
        headerTitleStyle: {
          color: '#1A1E27',
          fontFamily: 'SpoqaHanSansNeo-Bold',
          fontSize: responsiveWidth(14),
          lineHeight: responsiveHeight(24),
          letterSpacing: responsiveWidth(-0.6),
        },
        headerBackImage: () => <HeaderLeftButton />,
        headerStyle: {backgroundColor: Colors.white},
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
        name="MapUser"
        component={Detail1}
        initialParams={props}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.detail'),
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="MapUserPage"
        component={UserPage}
        options={{headerShown: true, headerTitle: '프로필'}}
      />
      <Stack.Screen
        name="FollowerList"
        component={FollowerList}
        options={{
          headerShown: true,
          headerTitle: t('profile.follower'),
        }}
      />
      <Stack.Screen
        name="FollowingList"
        component={FollowingList}
        options={{
          headerShown: true,
          headerTitle: t('profile.following'),
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.detail'),
        }}
      />
      <Stack.Screen
        name="DetailMention"
        component={DetailMention}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('post.friends'),
        }}
      />
      <Stack.Screen
        name="ProfileImage"
        component={ProfileImage}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.profileImage'),
        }}
      />
      <Stack.Screen
        name="BackgroundImage"
        component={BackgroundImage}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.backgroundImage'),
        }}
      />
      <Stack.Screen
        name="Nickname"
        component={Nickname}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.nickname'),
        }}
      />
      <Stack.Screen
        name="Setting"
        component={Detail}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('profile.setting'),
        }}
      />
    </Stack.Navigator>
  );
};
export default MapNavigator;
