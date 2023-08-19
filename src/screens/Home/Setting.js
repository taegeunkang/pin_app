import {
  View,
  StyleSheet,
  Text,
  FlatList,
  SafeAreaView,
  Pressable,
} from 'react-native';
import {useTheme} from '../../hooks';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigation}) => {
  const {Fonts, Images} = useTheme();

  const logout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('refreshToken');
    navigation.reset({routes: [{name: 'Login'}]});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, backgroundColor: '#FFFFFF'}}>
        <Pressable
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: '#F2F4F6',
            }}>
            <Text style={Fonts.contentMediumMedium}>알림</Text>
          </View>
        </Pressable>

        <Pressable
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Pressable
            onPress={logout}
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: '#F2F4F6',
            }}>
            <Text style={Fonts.contentMediumMedium}>로그아웃</Text>
          </Pressable>
        </Pressable>

        <Pressable
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: '#F2F4F6',
            }}>
            <Text style={Fonts.contentMediumMedium}>회원탈퇴</Text>
          </View>
        </Pressable>

        <Pressable
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: '#F2F4F6',
            }}>
            <Text style={Fonts.contentMediumMedium}>개인정보 처리 방침</Text>
          </View>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
