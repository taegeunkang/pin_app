import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import {useTranslation} from 'react-i18next';
import {Colors} from '../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import HomeIcon from '../theme/assets/images/light/pin-select.svg';
import HomeIconNot from '../theme/assets/images/light/pin-not-select.svg';
import BellIcon from '../theme/assets/images/light/bell-select.svg';
import BellIconNot from '../theme/assets/images/light/bell-not-select.svg';
import SearchIcon from '../theme/assets/images/light/search-select.svg';
import SearchIconNot from '../theme/assets/images/light/search-not-select.svg';
import UploadIcon from '../theme/assets/images/light/upload-select.svg';
import UploadIconNot from '../theme/assets/images/light/upload-not-select.svg';
import UserIcon from '../theme/assets/images/light/user-select.svg';
import UserIconNot from '../theme/assets/images/light/user-not-select.svg';
import {Image} from 'react-native';
import Content from './Content';
import UploadPost from './UploadPost';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import AlertNavigator from './AlertNavigator';
import SearchNavigator from './SearchNavigator';
const Tab = createBottomTabNavigator();
const Nav = () => {
  const {t} = useTranslation('content');
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          if (route.name == 'Home') {
            return focused ? (
              <HomeIcon
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            ) : (
              <HomeIconNot
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            );
          } else if (route.name == t('nav.search')) {
            return focused ? (
              <SearchIcon
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            ) : (
              <SearchIconNot
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            );
          } else if (route.name == 'Medias') {
            return focused ? (
              <UploadIcon
                width={responsiveWidth(35)}
                height={responsiveHeight(35)}
              />
            ) : (
              <UploadIconNot
                width={responsiveWidth(35)}
                height={responsiveHeight(35)}
              />
            );
          } else if (route.name == t('nav.mypage')) {
            return focused ? (
              <UserIcon
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            ) : (
              <UserIconNot
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            );
          } else if (route.name == t('nav.alram')) {
            return focused ? (
              <BellIcon
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            ) : (
              <BellIconNot
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
              />
            );
          }
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
        },
        tabBarActiveTintColor: '#1A1E27',
        tabBarInactiveTintColor: '#6D7582',
        headerStyle: {backgroundColor: '#FFFFFF'},
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
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
        component={UploadPost}
        options={{
          tabBarLabelStyle: {
            color: Colors.transparent,
          },
          headerShown: false,
          unmountOnBlur: true,
        }}
      />

      <Tab.Screen
        name={t('nav.mypage')}
        component={Content}
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

export default Nav;
