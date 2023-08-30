import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import Alram from '../screens/Home/Alram';
import Setting from '../screens/Home/Setting';
const Stack = createStackNavigator();

// @refresh reset
const Content = () => {
  const {t} = useTranslation('content');
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
        headerStyle: {backgroundColor: '#FFFFFF'},
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
        name="Alram"
        component={Alram}
        options={{
          headerShown: true,
          headerTitle: t('nav.alram'),
          headerTitleStyle: {
            color: '#1A1E27',
            fontFamily: 'SpoqaHanSansNeo-Bold',
            fontSize: responsiveWidth(14),
            lineHeight: responsiveHeight(24),
            letterSpacing: responsiveWidth(-0.6),
          },
        }}
      />
      <Stack.Screen
        name="Setting"
        component={Setting}
        options={{
          headerBackTitleVisible: false,
          headerTitle: t('nav.setting'),
        }}
      />
    </Stack.Navigator>
  );
};
export default Content;
