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
import Detail from '../screens/Home/Detail';
import {Colors} from '../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import {useTheme} from '../hooks';
import Medias from '../screens/Home/Medias';
import Preview from '../screens/Home/Preview';
import WriteContent from '../screens/Home/WriteContent';
import FindingLocation from '../screens/Home/FindingLocation';
import HeaderLeftButton from '../components/HeaderLeftButton';
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
const UploadPost = () => {
  const {t} = useTranslation('newPost');

  return (
    <Stack.Navigator
      screenOptions={{
        headerBackTitleVisible: true,
        presentation: 'card',
        headerTitleStyle: {color: '#1A1E27'},
        headerBackImage: () => <HeaderLeftButton />,
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
    </Stack.Navigator>
  );
};
export default UploadPost;
