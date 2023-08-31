import React, {useEffect, useState} from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import MyPage from '../screens/Home/MyPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Medias from '../screens/Home/Medias';
import Preview from '../screens/Home/Preview';
import WriteContent from '../screens/Home/WriteContent';
import FindingLocation from '../screens/Home/FindingLocation';
import HeaderLeftButton from '../components/HeaderLeftButton';
import FindingFriends from '../screens/Home/FindingFriends';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import {useTheme} from '../hooks';
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
const UploadPost = ({navigation}) => {
  const {t} = useTranslation('newPost');
  const {Fonts, Colors, Images} = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        presentation: 'card',
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
        name={t('media.title')}
        component={Medias}
        options={{
          headerShown: true,
        }}
      />
      <Stack.Screen
        name="Preview"
        component={Preview}
        options={{headerBackTitleVisible: false, title: t('media.preview')}}
      />
      <Stack.Screen
        name="WriteContent"
        component={WriteContent}
        options={{headerBackTitleVisible: false, title: t('media.write')}}
      />
      <Stack.Screen
        name="FindingLocation"
        component={FindingLocation}
        options={{headerBackTitleVisible: false, title: t('media.location')}}
      />
      <Stack.Screen
        name="FindingFriends"
        component={FindingFriends}
        options={{headerBackTitleVisible: false, title: t('media.friends')}}
      />
      {/* <Stack.Screen name="Nav" component={Nav} options={{headerShown: false}} /> */}
    </Stack.Navigator>
  );
};
export default UploadPost;
