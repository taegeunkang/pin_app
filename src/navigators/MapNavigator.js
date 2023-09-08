import React from 'react';
import {Image, Text, TouchableOpacity} from 'react-native';
import MyPage from '../screens/Home/MyPage';
import FollowerList from '../screens/Home/FollowerList';
import FollowingList from '../screens/Home/FollowingList';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import Detail from '../screens/Home/Detail';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import ProfileImage from '../screens/Home/ProfileImage';
import BackgroundImage from '../screens/Home/BackgroundImage';
import Nickname from '../screens/Home/Nickname';
import UserPage from '../screens/Home/UserPage';
import DetailMention from '../screens/Home/DetailMention';
import Home from '../screens/Home/Home';
import {useTheme} from '../hooks';
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
    </Stack.Navigator>
  );
};
export default MapNavigator;
