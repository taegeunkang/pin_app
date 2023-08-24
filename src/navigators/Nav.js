import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/Home/Home';
import Alram from '../screens/Home/Alram';
import {useTranslation} from 'react-i18next';
import Search from '../screens/Home/Search';
import {Colors} from '../theme/Variables';
import {WithLocalSvg} from 'react-native-svg';
import HomeIcon from '../theme/assets/images/nav/home.svg';
import HomeIconNot from '../theme/assets/images/nav/home-not.svg';
import MyPageIcon from '../theme/assets/images/nav/mypage.svg';
import MyPageIconNot from '../theme/assets/images/nav/mypage-not.svg';
import BellIcon from '../theme/assets/images/nav/bell.svg';
import BellIconNot from '../theme/assets/images/nav/bell-not.svg';
import SearchIcon from '../theme/assets/images/nav/search.svg';
import SearchIconNot from '../theme/assets/images/nav/search-not.svg';
import {useTheme} from '../hooks';
import {Image} from 'react-native';
import Content from './Content';
import UploadPost from './UploadPost';
import {responsiveHeight, responsiveWidth} from '../components/Scale';
import AlertNavigator from './AlertNavigator';
import SearchNavigator from './SearchNavigator';
import UserDetail from './UserDetailNavigator';
const Tab = createBottomTabNavigator();
const Nav = () => {
  const {t} = useTranslation('content');
  const {Images} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          if (route.name == 'Home') {
            return focused ? (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={HomeIcon}
              />
            ) : (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={HomeIconNot}
              />
            );
          } else if (route.name == t('nav.search')) {
            return focused ? (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={SearchIcon}
              />
            ) : (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={SearchIconNot}
              />
            );
          } else if (route.name == 'Medias') {
            return focused ? (
              <Image
                source={Images.createBtnNot}
                style={{
                  width: responsiveWidth(35),
                  height: responsiveHeight(35),
                }}
              />
            ) : (
              <Image
                source={Images.createBtnNot}
                style={{
                  width: responsiveWidth(35),
                  height: responsiveHeight(35),
                }}
              />
            );
          } else if (route.name == t('nav.mypage')) {
            return focused ? (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={MyPageIcon}
              />
            ) : (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={MyPageIconNot}
              />
            );
          } else if (route.name == t('nav.alram')) {
            return focused ? (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={BellIcon}
              />
            ) : (
              <WithLocalSvg
                width={responsiveWidth(25)}
                height={responsiveHeight(25)}
                asset={BellIconNot}
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
