import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState, useRef} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import InputBox from '../../components/InputBox';
import {API_URL} from '../../utils/constants';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProfileInitialSetting = ({navigation}) => {
  const [inpt, setInpt] = useState('');
  const {Fonts, Colors} = useTheme();
  const [duplicate, setDuplicate] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [tooLong, setTooLong] = useState(false);
  const inputRef = useRef(null);

  const {t} = useTranslation('login');
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={submit}
          style={{
            backgroundColor: Colors.transparent,
            width: responsiveWidth(60),
            height: responsiveHeight(30),
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: responsiveWidth(14),
              lineHeight: responsiveHeight(24),
              letterSpacing: responsiveWidth(-0.6),
              color: '#4880EE',
            }}>
            완료
          </Text>
        </TouchableOpacity>
      ),
    });
  });

  const submit = async () => {
    if (inpt == '' || inpt.trim() == '') {
      setEmpty(true);
      return;
    } else if (inpt.trim().length > 10) {
      setTooLong(true);
      return;
    }

    const response = await fetch(API_URL + '/user/profile/init', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
      },
      body: JSON.stringify({nickname: inpt.trim()}),
    });

    switch (response.status) {
      case 200:
        navigation.reset({routes: [{name: 'Home'}]});
        break;

      case 400:
        const a = await response.json();
        if (a.code == 'U07') {
          setDuplicate(true);
          return;
        }
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <SafeAreaView
        style={{flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF'}}>
        <View style={{marginTop: responsiveHeight(20)}} />
        <InputBox
          title={t('input.nickname')}
          placeholder={t('input.nicknamePlaceholder')}
          value={inpt}
          onChangeText={e => setInpt(e)}
          ref={inputRef}
          isWrong={empty || duplicate}
        />
        {duplicate && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              marginTop: responsiveHeight(5),
            }}>
            <Text
              style={{
                fontFamily: 'SpoqaHanSansNeo-Medium',
                color: '#E44949',
                fontSize: responsiveWidth(12),
                lineHeight: responsiveHeight(18),
                letterSpacing: responsiveWidth(-0.6),
              }}>
              {t('nickname.duplicate')}
            </Text>
          </View>
        )}

        {empty && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              marginTop: responsiveHeight(5),
            }}>
            <Text
              style={{
                fontFamily: 'SpoqaHanSansNeo-Medium',
                color: '#E44949',
                fontSize: responsiveWidth(12),
                lineHeight: responsiveHeight(18),
                letterSpacing: responsiveWidth(-0.6),
              }}>
              {t('nickname.empty')}
            </Text>
          </View>
        )}

        {tooLong && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              marginTop: responsiveHeight(5),
            }}>
            <Text
              style={{
                fontFamily: 'SpoqaHanSansNeo-Medium',
                color: '#E44949',
                fontSize: responsiveWidth(12),
                lineHeight: responsiveHeight(18),
                letterSpacing: responsiveWidth(-0.6),
              }}>
              {t('nickname.tooLong')}
            </Text>
          </View>
        )}

        {/* <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-end',
            marginBottom: responsiveHeight(30),
          }}>
          <SubmitButton onPress={submit} title={t('nickname.next')} />
        </View> */}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({});
export default ProfileInitialSetting;
