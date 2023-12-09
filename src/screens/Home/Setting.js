import {View, Text, SafeAreaView, Pressable} from 'react-native';
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
        <Pressable
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
        </Pressable>

        <Pressable
          style={{
            width: '100%',
            height: responsiveHeight(55),
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.contentBackground,
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
              borderBottomColor: Colors.screenBackground,
            }}>
            <Text style={[Fonts.contentMediumMedium, {color: Colors.textBold}]}>
              로그아웃
            </Text>
          </Pressable>
        </Pressable>

        <Pressable
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
        </Pressable>

        <Pressable
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
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Setting;
