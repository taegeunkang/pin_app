import {View, Text, SafeAreaView, TouchableOpacity} from 'react-native';
import {useTheme} from '../../hooks';
import {ScrollView} from 'react-native-gesture-handler';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Setting = ({navigation}) => {
  const {Fonts, Images, Colors} = useTheme();

  const logout = () => {
    AsyncStorage.removeItem('token');
    AsyncStorage.removeItem('refreshToken');
    navigation.reset({routes: [{name: 'Login'}]});
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView style={{flex: 1, backgroundColor: Colors.contentBackground}}>
        <TouchableOpacity
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: Colors.screenBackground,
            }}>
            <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
              알림
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
          }}
          onPress={logout}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: Colors.screenBackground,
            }}>
            <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
              로그아웃
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: Colors.screenBackground,
            }}>
            <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
              회원탈퇴
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
          }}>
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(55),
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              borderBottomWidth: responsiveHeight(3),
              borderBottomColor: Colors.screenBackground,
            }}>
            <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
              개인정보 처리 방침
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
