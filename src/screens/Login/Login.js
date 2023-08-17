import {useTranslation} from 'react-i18next';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import Button from '../../theme/components/login/Button';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../hooks';
import {Colors, FontSize} from '../../theme/Variables';
// import Sns from '../../theme/components/Sns';
import {useState, useRef} from 'react';
// import TextBox from 'react-native-password-eye';
import {check_email} from '../../utils/email';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Logo from '../../theme/assets/images/p-logo-transparent.svg';
import SubmitButton from '../../components/SubmitButton';
import InputBox from '../../components/InputBox';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import { login, loginWithKakaoAccount } from '@react-native-seoul/kakao-login';
const Login = ({navigation}) => {
  const {t} = useTranslation('login');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [wrongId, setWrongId] = useState(false);
  const [wrongRes, setWrongRes] = useState(false);
  const [wrongPassword, setWrongPassword] = useState(false);
  const {Common, Fonts, Gutters, Layout, Images} = useTheme();

  const inputRef = useRef(null);
  const loginSubmit = async () => {
    if (!id && !password) {
      return;
    }
    if (!check_email(id)) {
      setWrongId(true);
      return;
    }
    setWrongId(false);
    setWrongRes(false);
    setWrongPassword(false);
    if (id.length >= 0 && password.length >= 0) {
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
        AsyncStorage.setItem('token', response['token']);
        AsyncStorage.setItem('refreshToken', response['refreshToken']);
        AsyncStorage.setItem('emailAddress', response['emailAddress']);
        navigation.reset({routes: [{name: 'Home'}]});
      } else {
        console.log(response['code']);
        switch (response['code']) {
          case 'U01':
            setWrongRes(true);
            break;
          case 'U02':
            setWrongPassword(true);
            break;
          default:
            alert('서버 에러!');
        }
      }
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

  return (
    <TouchableWithoutFeedback onPress={() => inputRef.current.blur()}>
      <View style={{backgroundColor: Colors.white, flex: 1}}>
        <View
          style={{
            width: '100%',
            height: 200,
            backgroundColor: 'transparent',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image source={Images.appLogo} style={{width: 200, height: 200}} />
        </View>

        <View style={(Layout.fullWidth, Layout.center)}>
          <InputBox
            title={'이메일'}
            placeholder={t('input.id')}
            onChangeText={e => setId(e)}
            value={id}
            isWrong={wrongId || wrongRes}
            ref={inputRef}
          />
          {wrongId && <Text style={styles.wrongInput}>{t('wrongId')}</Text>}
          {wrongRes && <Text style={styles.wrongInput}>{t('wrongInfo')}</Text>}

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
            <Text style={styles.wrongInput}>{t('wrongPassword')}</Text>
          )}
          <Text style={styles.forgetSentence}>{t('forget')}</Text>
          {/* <SubmitButton onPress={loginSubmit} title={t('loginBtn')} /> */}
          <SubmitButton
            onPress={() => navigation.reset({routes: [{name: 'Home'}]})}
            title={t('loginBtn')}
          />

          {/* <Text style={styles.snsLoginSenetence}>{t('snsLogin')}</Text>
        <Sns googleSigin={googleSigin} kakaoSignin={kakaoSignin} /> */}

          <TouchableOpacity
            style={{
              width: 180,
              height: 35,
              alignItems: 'center',
              justifyContent: 'center',
              marginTop: 30,
            }}
            onPress={() => navigation.navigate('Register')}
            activeOpacity={1}>
            <Text style={styles.registerTitle}>{t('registerTitle')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  title: {
    marginTop: 100,
    textAlign: 'center',
    alignItems: 'center',
    marginBottom: 55,
  },
  titleText: {
    fontSize: FontSize.xLarge,
    fontWeight: 700,
  },
  titleSub: {
    fontSize: FontSize.regular,
  },
  loginInput: {
    width: 370,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F2F4F6',
    paddingHorizontal: 10,
    color: '#505866',
  },
  forgetSentence: {
    width: 370,
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6,
    color: '#6D7582',
    marginBottom: 40,
    marginTop: 20,
  },
  snsLoginSenetence: {
    fontSize: FontSize.small,
    color: Colors.DarkGray,
    marginTop: 30,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 7,
    height: 48,
    elevation: 3,
    backgroundColor: Colors.DarkGray,
    width: 320,
  },
  loginButtonText: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 370,
    height: 48,
    backgroundColor: '#4880EE',
    borderRadius: 12,
  },
  registerTitle: {
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6,
    color: '#6D7582',
  },
  wrongInput: {
    color: '#E44949',
    fontSize: 12,
    lineHeight: 18,
    letterSpacing: -0.6,
    width: 370,
  },
});

export default Login;
