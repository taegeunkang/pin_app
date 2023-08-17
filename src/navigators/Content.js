import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import MyPage from '../screens/Home/MyPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Detail from '../screens/Home/Detail';
import {Colors} from '../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import {useTheme} from '../hooks';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
const Stack = createStackNavigator();

// @refresh reset
const Content = () => {
  const {t} = useTranslation('mypage');
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
      }}>
      <Stack.Screen
        name="MyPage"
        component={MyPage}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="FollowerList"
        component={FollowerList}
        options={{
          headerShown: true,
          headerTitle: '팔로워',
        }}
      />
      <Stack.Screen
        name="FollowingList"
        component={FollowingList}
        options={{
          headerShown: true,
          headerTitle: '팔로잉',
        }}
      />
      <Stack.Screen
        name="Detail"
        component={Detail}
        options={{headerBackTitleVisible: false}}
      />
    </Stack.Navigator>
  );
};
export default Content;
