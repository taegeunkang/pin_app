import {useTranslation} from 'react-i18next';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '../../hooks';
import {Colors, FontSize} from '../../theme/Variables';
import {useState, useRef, useEffect} from 'react';
import {check_email} from '../../utils/email';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SubmitButton from '../../components/SubmitButton';
import InputBox from '../../components/InputBox';
import {responsiveWidth, responsiveHeight} from '../../components/Scale';

// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import { login, loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
// messaging().setBackgroundMessageHandler(async remoteMessage => {
//   console.log('Background remote message: ', remoteMessage);
// });
// messaging().onMessage(async remoteMessage => {
//   console.log('[Remote Message] ', JSON.stringify(remoteMessage));
// });

const Login = ({navigation}) => {
  const {t} = useTranslation('login');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [wrongId, setWrongId] = useState(false);
  const [wrongRes, setWrongRes] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {Layout, Images, Fonts, Colors} = useTheme();
  const inputRef = useRef(null);

  const loginSubmit = async () => {
    if (!id && !password) {
      return;
    }
    if (!check_email(id)) {
      setWrongId(true);
      return;
    }

    if (id.length >= 0 && password.length >= 0) {
      setLoading(true);
      let response = await fetch(API_URL + '/user/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          emailAddress: id,
          password: password,
        }),
      });
      let status = response['status'];
      response = await response.json();
      if (status == 200) {
        await AsyncStorage.setItem('token', response.token);
        await AsyncStorage.setItem('refreshToken', response.refreshToken);
        await AsyncStorage.setItem('emailAddress', response.emailAddress);
        await AsyncStorage.setItem('id', response.id.toString());
        if (response.isFirstLogin) {
          navigation.navigate('ProfileInitialSetting');
          return;
        }

        navigation.reset({routes: [{name: 'Home'}]});
      } else {
        switch (response['code']) {
          case 'U01':
            setWrongId(false);
            setWrongRes(true);
            setWrongPassword(false);
            break;
          case 'U02':
            setWrongId(false);
            setWrongRes(false);
            setWrongPassword(true);
            break;
          default:
            alert('서버 에러!');
        }
      }
      setLoading(false);
    }
  };

  // oauth 로그인 기능 -> 추가 예정

  // const kakaoSignin = async () => {
  //   try {
  //     console.log('called');
  //     const token = await loginWithKakaoAccount();
  //     console.log(token);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const googleSigin = async () => {
  //   try {
  //     await GoogleSignin.hasPlayServices();
  //     const userInfo = await GoogleSignin.signIn();
  //     const token = await GoogleSignin.getTokens();
  //     await googleGetToken(token['accessToken'], 'google');
  //     navigation.reset({ routes: [{ name: 'Home' }] });
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const googleGetToken = async (accessToken, provider) => {
  //   let response = await fetch(API_URL + '/user/login/oauth', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify({
  //       provider: provider,
  //       accessToken: accessToken,
  //     }),
  //   });

  //   let status = response['status'];
  //   response = await response.json();
  //   // console.log(resposne);
  //   console.log(status);
  //   if (status == 200) {
  //     AsyncStorage.setItem('token', response['token']);
  //     AsyncStorage.setItem('refreshToken', response['refreshToken']);
  //     AsyncStorage.setItem('emailAddress', response['emailAddress']);
  //     AsyncStorage.setItem('provider', 'google');
  //   } else {
  //     alert(t('oauth.error'));
  //   }
  // };

  const styles = StyleSheet.create({
    loginInput: {
      width: responsiveWidth(370),
      height: responsiveHeight(48),
      borderRadius: responsiveWidth(12),
      backgroundColor: Colors.inputBackground,
      paddingHorizontal: responsiveWidth(10),
      color: Colors.inputContent,
    },
    forgetSentence: {
      width: responsiveWidth(370),
      color: Colors.inputPlaceHolder,
      marginBottom: responsiveHeight(40),
      marginTop: responsiveHeight(20),
    },
    snsLoginSenetence: {
      fontSize: FontSize.small,
      color: Colors.DarkGray,
      marginTop: responsiveHeight(30),
    },
    wrongInput: {
      color: Colors.warn,
      width: responsiveWidth(370),
    },
  });

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <View style={{backgroundColor: Colors.contentBackground, flex: 1}}>
        <View
          style={{
            width: '100%',
            height: responsiveHeight(200),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={Images.pLogo}
            style={{
              width: responsiveWidth(200),
              height: responsiveHeight(120),
              resizeMode: 'contain',
            }}
          />
        </View>

        <View style={(Layout.fullWidth, Layout.center)}>
          <InputBox
            title={'이메일'}
            placeholder={t('input.id')}
            onChangeText={e => setId(e.toLowerCase())}
            value={id}
            isWrong={wrongId || wrongRes}
            ref={inputRef}
          />
          {wrongId && (
            <View style={{height: responsiveHeight(15)}}>
              <Text style={[styles.wrongInput, Fonts.contentRegualrMedium]}>
                {t('wrongId')}
              </Text>
            </View>
          )}
          {wrongRes && (
            <View style={{height: responsiveHeight(15)}}>
              <Text style={[styles.wrongInput, Fonts.contentRegualrMedium]}>
                {t('wrongInfo')}
              </Text>
            </View>
          )}
          {!wrongId && !wrongRes && (
            <View style={{height: responsiveHeight(15)}} />
          )}
          <View style={{marginTop: responsiveHeight(5)}} />

          <InputBox
            title={'비밀번호'}
            placeholder={t('input.password')}
            onChangeText={e => setPassword(e)}
            value={password}
            isWrong={wrongPassword}
            passwordInvisible={true}
            ref={inputRef}
          />

          {wrongPassword && (
            <View style={{height: responsiveHeight(15)}}>
              <Text style={styles.wrongInput}>{t('wrongPassword')}</Text>
            </View>
          )}
          {!wrongPassword && <View style={{height: responsiveHeight(15)}} />}
          <Text style={[Fonts.contentRegualrMedium, styles.forgetSentence]}>
            {t('forget')}
          </Text>
          <SubmitButton
            onPress={loginSubmit}
            title={t('loginBtn')}
            loading={loading}
          />

          {/* SNS 로그인*/}

          {/* <Text style={styles.snsLoginSenetence}>{t('snsLogin')}</Text>
        <Sns googleSigin={googleSigin} kakaoSignin={kakaoSignin} /> */}

          <TouchableOpacity
            style={{
              width: responsiveWidth(180),
              height: responsiveHeight(35),
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: responsiveHeight(30),
            }}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={1}>
            <Text
              style={[
                Fonts.contentRegualrMedium,
                {color: Colors.inputPlaceHolder},
              ]}>
              {t('registerTitle')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;
