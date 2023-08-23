import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import Search from '../screens/Home/Search';
import UserPage from '../screens/Home/UserPage';
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
  const {t} = useTranslation('newPost');

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
          headerShown: true,
        }}
      />
      <Stack.Screen
        name={'UserPage'}
        component={UserPage}
        options={{
          headerShown: true,
        }}
      />

      {/* <Stack.Screen name="Nav" component={Nav} options={{headerShown: false}} /> */}
    </Stack.Navigator>
  );
};
export default SearchNavigator;
