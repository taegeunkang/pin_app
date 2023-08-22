import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Pressable,
  TouchableWithoutFeedback,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState, useRef} from 'react';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import InputBox from '../../components/InputBox';
import {API_URL} from '../../utils/constants';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Nickname = ({navigation}) => {
  const [inpt, setInpt] = useState('');
  const {Fonts, Colors} = useTheme();
  const [duplicate, setDuplicate] = useState(false);
  const [empty, setEmpty] = useState(false);
  const [tooLong, setTooLong] = useState(false);
  const {t} = useTranslation('register');
  const inputRef = useRef(null);
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
    if (inpt.trim().length == 0) {
      setEmpty(true);
      setDuplicate(false);
      setTooLong(false);
      return;
    } else if (inpt.length > 8) {
      setEmpty(false);
      setDuplicate(false);
      setTooLong(true);
      return;
    }
    const response = await fetch(
      API_URL + `/user/nickname/update?nickname=${inpt}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: 'Bearer ' + (await AsyncStorage.getItem('token')),
        },
      },
    );
    switch (response.status) {
      case 200:
        navigation.pop();
        break;
      case 400:
        const r = await response.json();
        switch (r.code) {
          case 'U07':
            setDuplicate(true);
            setTooLong(false);
            setEmpty(false);
            break;
        }
        break;
    }
  };
  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <View style={{flex: 1, alignItems: 'center', backgroundColor: '#FFFFFF'}}>
        <View style={{marginTop: responsiveHeight(20)}} />
        <InputBox
          title={'닉네임'}
          placeholder={'닉네임 입력'}
          value={inpt}
          onChangeText={e => setInpt(e)}
          ref={inputRef}
          isWrong={duplicate || empty || tooLong}
        />
        {duplicate && (
          <View style={{width: responsiveWidth(370), alignItems: 'flex-start'}}>
            <Text
              style={[
                {
                  fontFamily: 'SpoqaHanSansNeo-Medium',
                  color: '#E44949',
                  fontSize: responsiveWidth(12),
                  lineHeight: responsiveHeight(18),
                  letterSpacing: responsiveWidth(-0.6),
                },
                {marginTop: responsiveHeight(5)},
              ]}>
              {t('input.duplicateNickname')}
            </Text>
          </View>
        )}
        {empty && (
          <View style={{width: responsiveWidth(370), alignItems: 'flex-start'}}>
            <Text
              style={[
                {
                  fontFamily: 'SpoqaHanSansNeo-Medium',
                  color: '#E44949',
                  fontSize: responsiveWidth(12),
                  lineHeight: responsiveHeight(18),
                  letterSpacing: responsiveWidth(-0.6),
                },
                {marginTop: responsiveHeight(5)},
              ]}>
              {'닉네임을 입력해 주세요.'}
            </Text>
          </View>
        )}
        {tooLong && (
          <View style={{width: responsiveWidth(370), alignItems: 'flex-start'}}>
            <Text
              style={[
                {
                  fontFamily: 'SpoqaHanSansNeo-Medium',
                  color: '#E44949',
                  fontSize: responsiveWidth(12),
                  lineHeight: responsiveHeight(18),
                  letterSpacing: responsiveWidth(-0.6),
                },
                {marginTop: responsiveHeight(5)},
              ]}>
              {t('input.nickname')}
            </Text>
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({});
export default Nickname;