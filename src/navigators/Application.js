import React from 'react';
import {StatusBar, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
import Startup from '../screens/Startup/Startup';

import {useTheme} from '../hooks';
// import ContentNavigator from './Content';
import NavNavigator from './Nav';
import {useFlipper} from '@react-navigation/devtools';
import Login from '../screens/Login/Login';
import Register from '../screens/Login/Register';
import Congraturation from '../screens/Login/Congraturation';
import {useTranslation} from 'react-i18next';
import ProfileInitialSetting from '../screens/Login/ProfileInitialSetting';
import MapNavigator from './MapNavigator';

import Search from '../screens/Home/Search';
import SelectPic from '../screens/Home/SelectPic';
import Preview from '../screens/Home/Preview';
import WriteContent from '../screens/Home/WriteContent';
import FindingFriends from '../screens/Home/FindingFriends';
import FindingLocation from '../screens/Home/FindingLocation';
import SearchNavigator from './SearchNavigator';
import {useSelector} from 'react-redux';
import SelectLocation from '../screens/Home/SelectLocation';

const Stack = createStackNavigator();
// @refresh reset
const ApplicationNavigator = () => {
  const {t} = useTranslation(['login', 'myPage', 'newPost', 'content']);
  const {Layout, darkMode, NavigationTheme, Fonts, Colors} = useTheme();
  const navigationRef = useNavigationContainerRef();

  useFlipper(navigationRef);
  return (
    <View style={[Layout.fill, {backgroundColor: Colors.card}]}>
      <NavigationContainer theme={NavigationTheme} ref={navigationRef}>
        <Stack.Navigator
          screenOptions={{
            headerShown: true,
            headerTintColor: Colors.headerTitle,
            headerTitleStyle: {
              color: Colors.headerTitle,
              ...Fonts.contentMediumBold,
            },
            headerStyle: {backgroundColor: Colors.contentBackground},
            headerBackTitleVisible: false,
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
            name="Startup"
            component={Startup}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen name="Login" component={Login} options={{title: ''}} />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              title: t('login:header.register'),
            }}
          />
          <Stack.Screen
            name="Congraturation"
            component={Congraturation}
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="ProfileInitialSetting"
            component={ProfileInitialSetting}
            options={{
              headerShown: true,
              headerTitle: t('login:profileSetting'),
            }}
          />
          <Stack.Screen
            name={'검색'}
            component={Search}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Home"
            component={NavNavigator}
            options={{headerShown: false}}
          />

          <Stack.Screen
            name="MapNavigator"
            component={MapNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="UploadPost"
            component={SelectPic}
            options={{
              headerShown: true,
              headerTitle: '업로드',
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
              transitionSpec: {
                open: {
                  animation: 'timing',
                  config: {duration: 250}, // Adjust the duration as needed
                },
                close: {
                  animation: 'timing',
                  config: {duration: 250}, // Adjust the duration as needed
                },
              },
            }}
          />
          <Stack.Screen
            name="SearchLocation"
            component={SelectLocation}
            options={{
              headerShown: false,
              headerTitle: '',
              presentation: 'transparentModal',
              cardStyleInterpolator: ({current, layouts}) => {
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
            }}
          />
          <Stack.Screen
            name="Preview"
            component={Preview}
            options={{
              headerBackTitleVisible: false,
              title: t('newPost:media.preview'),
              presentation: 'transparentModal',
              cardStyleInterpolator: ({current, layouts}) => {
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
            }}
          />
          <Stack.Screen
            name="WriteContent"
            component={WriteContent}
            options={{
              headerBackTitleVisible: false,
              title: t('newPost:media.write'),
              presentation: 'transparentModal',
              cardStyleInterpolator: ({current, closing, layouts}) => {
                const isClosing = closing.__getValue() === 1;
                if (isClosing) {
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
                } else {
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
                }
              },
            }}
          />
          <Stack.Screen
            name="FindingLocation"
            component={FindingLocation}
            options={{
              headerBackTitleVisible: false,
              title: t('newPost:media.location'),
              presentation: 'transparentModal',
              cardStyleInterpolator: ({current, layouts}) => {
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
            }}
          />
          <Stack.Screen
            name="FindingFriends"
            component={FindingFriends}
            options={{
              headerBackTitleVisible: false,
              title: t('newPost:media.friends'),
              presentation: 'transparentModal',
              cardStyleInterpolator: ({current, layouts}) => {
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
            }}
          />

          <Stack.Screen
            name="SearchNavigator"
            component={SearchNavigator}
            options={{headerShown: true, headerTitle: '프로필'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
};
export default ApplicationNavigator;
