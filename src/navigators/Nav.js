import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import {useTranslation} from 'react-i18next';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import AlertNavigator from './AlertNavigator';
import {Image, View} from 'react-native';
import {useTheme} from '../hooks';
import MapNavigator from './MapNavigator';
import MyPageNavigator from './MyPageNavigator';
import SearchNavigator from './SearchNavigator';
const Tab = createBottomTabNavigator();
const Nav = () => {
  const {t} = useTranslation('content');
  const {Images, Fonts, Colors} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          if (route.name == 'MapNavigator') {
            return focused ? (
              <Image
                source={Images.pinSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <Image
                source={Images.pinNotSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name == t('nav.search')) {
            return focused ? (
              <Image
                source={Images.searchSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <Image
                source={Images.searchNotSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name == 'Medias') {
            return focused ? (
              <Image
                source={Images.uploadSelect}
                style={{
                  width: responsiveWidth(30),
                  height: responsiveHeight(30),
                }}
              />
            ) : (
              <Image
                source={Images.uploadNotSelect}
                style={{
                  width: responsiveWidth(30),
                  height: responsiveHeight(30),
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name == 'MyPageNavigator') {
            return focused ? (
              <Image
                source={Images.userSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <Image
                source={Images.userNotSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            );
          } else if (route.name == t('nav.alram')) {
            return focused ? (
              <Image
                source={Images.bellSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            ) : (
              <Image
                source={Images.bellNotSelect}
                style={{
                  width: responsiveWidth(28),
                  height: responsiveHeight(28),
                  resizeMode: 'contain',
                }}
              />
            );
          }
        },
        tabBarStyle: {
          backgroundColor: Colors.contentBackground,
          position: 'relative',
        },
      })}>
      <Tab.Screen
        name="MapNavigator"
        component={MapNavigator}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={t('nav.search')}
        component={SearchNavigator}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="Medias"
        component={TempComponent}
        listeners={({navigation}) => ({
          tabPress: e => {
            e.preventDefault();
            navigation.push('UploadPost');
          },
        })}
        options={{
          tabBarLabelStyle: {
            color: Colors.transparent,
          },
          headerShown: false,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name={'MyPageNavigator'}
        component={MyPageNavigator}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name={t('nav.alram')}
        component={AlertNavigator}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

// 임시 컴포넌트
function TempComponent() {
  return <View style={{display: 'none'}} />;
}
export default Nav;
