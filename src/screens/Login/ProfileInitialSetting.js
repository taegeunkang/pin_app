import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
} from 'react-native';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useLayoutEffect, useState, useRef} from 'react';
import {useTheme} from '../../hooks';
import InputBox from '../../components/InputBox';
import {API_URL} from '../../utils/constants';
import {useTranslation} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {reIssue} from '../../utils/login';
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
            style={[
              Fonts.contentMediumBold,
              {
                color: Colors.primary,
              },
            ]}>
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
        switch (a['code']) {
          case 'U07':
            setDuplicate(true);
            break;
          case 'U08':
            await reIssue();
            await submit();
        }
        break;
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <SafeAreaView
        style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: Colors.contentBackground,
        }}>
        <View style={{marginTop: responsiveHeight(20)}} />
        <InputBox
          title={t('input.nickname')}
          placeholder={t('input.nicknamePlaceholder')}
          value={inpt}
          onChangeText={e => setInpt(e.toLowerCase())}
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
              style={[
                Fonts.contentRegualrMedium,
                {
                  color: Colors.warn,
                },
              ]}>
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
              style={[
                Fonts.contentRegualrMedium,
                {
                  color: Colors.warn,
                },
              ]}>
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
              style={[
                Fonts.contentRegualrMedium,
                {
                  color: Colors.warn,
                },
              ]}>
              {t('nickname.tooLong')}
            </Text>
          </View>
        )}
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

export default ProfileInitialSetting;
