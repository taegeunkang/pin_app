import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {useTranslation} from 'react-i18next';
import HeaderLeftButton from '../components/HeaderLeftButton';
import {responsiveWidth, responsiveHeight} from '../components/Scale';
import Alram from '../screens/Home/Alram';
import Setting from '../screens/Home/Setting';
import {useTheme} from '../hooks';
const Stack = createStackNavigator();

// @refresh reset
const AlertNavigator = ({navigation}) => {
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
        name="Alram"
        component={Alram}
        options={{
          headerShown: true,
          headerTitle: t('nav.alram'),
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
export default AlertNavigator;
