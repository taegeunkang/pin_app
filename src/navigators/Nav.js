import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import Home from '../screens/Home/Home';
import Alram from '../screens/Home/Alram';
import {useTranslation} from 'react-i18next';
import MyPage from '../screens/Home/MyPage';
import Upload from '../screens/Home/Upload';
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
import {shadow} from 'react-native-paper';
const Tab = createBottomTabNavigator();
const Nav = () => {
  const {t} = useTranslation('content');
  const {Images} = useTheme();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarShowLabel: false,
        tabBarIcon: ({focused}) => {
          if (route.name == t('nav.home')) {
            return focused ? (
              <WithLocalSvg width={25} height={25} asset={HomeIcon} />
            ) : (
              <WithLocalSvg width={25} height={25} asset={HomeIconNot} />
            );
          } else if (route.name == t('nav.search')) {
            return focused ? (
              <WithLocalSvg width={25} height={25} asset={SearchIcon} />
            ) : (
              <WithLocalSvg width={25} height={25} asset={SearchIconNot} />
            );
          } else if (route.name == 'upload') {
            return focused ? (
              <Image
                source={Images.createBtn}
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            ) : (
              <Image
                source={Images.createBtnNot}
                style={{
                  width: 35,
                  height: 35,
                }}
              />
            );
          } else if (route.name == t('nav.mypage')) {
            return focused ? (
              <WithLocalSvg width={25} height={25} asset={MyPageIcon} />
            ) : (
              <WithLocalSvg width={25} height={25} asset={MyPageIconNot} />
            );
          } else if (route.name == t('nav.alram')) {
            return focused ? (
              <WithLocalSvg width={25} height={25} asset={BellIcon} />
            ) : (
              <WithLocalSvg width={25} height={25} asset={BellIconNot} />
            );
          }
        },
        tabBarStyle: {
          backgroundColor: Colors.white,
        },
        tabBarActiveTintColor: '#1A1E27',
        tabBarInactiveTintColor: '#6D7582',
      })}>
      <Tab.Screen
        name={t('nav.home')}
        component={Home}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={t('nav.search')}
        component={Search}
        options={{
          headerShown: false,
        }}
      />

      <Tab.Screen
        name="upload"
        component={Upload}
        options={{
          tabBarLabelStyle: {
            color: Colors.transparent,
          },
        }}
      />
      <Tab.Screen
        name={t('nav.mypage')}
        component={MyPage}
        options={{headerShown: false}}
      />
      <Tab.Screen name={t('nav.alram')} component={Alram} />
    </Tab.Navigator>
  );
};

export default Nav;
