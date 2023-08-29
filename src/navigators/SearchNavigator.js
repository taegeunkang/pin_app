import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import Search from '../screens/Home/Search';
import UserPage from '../screens/Home/UserPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import Detail from '../screens/Home/Detail';
import DetailMention from '../screens/Home/DetailMention';
import ProfileImage from '../screens/Home/ProfileImage';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
// import Nav from './Nav';
const Stack = createStackNavigator();

// const HeaderLeftButton = ({onPress}) => {
//   const {Images} = useTheme();
//   return (
//     <Image
//       source={Images.leftChevron}
//       style={{marginLeft: 5, width: 25, height: 25}}
//     />
//   );
// };
// @refresh reset
const SearchNavigator = () => {
  const {t} = useTranslation('myPage');

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        presentation: 'card',
        headerTitleStyle: {
          color: '#1A1E27',
          fontFamily: 'SpoqaHanSansNeo-Bold',
          fontSize: responsiveWidth(14),
          lineHeight: responsiveHeight(24),
          letterSpacing: responsiveWidth(-0.6),
        },
        headerBackImage: () => <HeaderLeftButton />,
        headerStyle: {backgroundColor: '#FFFFFF'},
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
        name={'검색'}
        component={Search}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={'UserPage'}
        component={UserPage}
        options={{
          headerShown: true,
          headerTitle: '프로필',
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FollowerList"
        component={FollowerList}
        options={{
          headerShown: true,
          headerTitle: t('profile.follower'),
          headerBackTitleVisible: false,
        }}
      />
      <Stack.Screen
        name="FollowingList"
        component={FollowingList}
        options={{
          headerShown: true,
          headerTitle: t('profile.following'),
          headerBackTitleVisible: false,
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
    </Stack.Navigator>
  );
};
export default SearchNavigator;
