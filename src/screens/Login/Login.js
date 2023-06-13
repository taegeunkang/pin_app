import {useTranslation} from 'react-i18next';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import Button from '../../theme/components/login/Button';
import {TextInput} from 'react-native-gesture-handler';
import {useTheme} from '../../hooks';
import {Colors, FontSize} from '../../theme/Variables';
// import Sns from '../../theme/components/Sns';
import {useState} from 'react';
import TextBox from 'react-native-password-eye';
import {check_email} from '../../utils/email';
import {API_URL} from '../../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  const {Common, Fonts, Gutters, Layout} = useTheme();

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
    <SafeAreaView style={{backgroundColor: Colors.white, flex: 1}}>
      <View style={styles.title}>
        <Text style={styles.titleText}>{t('title')}</Text>
        <Text style={styles.titleSub}>{t('slogan')}</Text>
      </View>

      <View style={(Layout.fullWidth, Layout.center)}>
        <TextInput
          style={styles.loginInput}
          placeholder={t('input.id')}
          onChangeText={e => setId(e)}
          value={id}
        />
        {wrongId && <Text style={styles.wrongInput}>{t('wrongId')}</Text>}
        {wrongRes && <Text style={styles.wrongInput}>{t('wrongInfo')}</Text>}
        {/* <TextInput
          style={styles.loginInput}
          secureTextEntry={true}
          placeholder={t('input.password')}
          onChangeText={e => setPassword(e)}
        /> */}
        <TextBox
          containerStyles={styles.loginInput}
          placeholder={t('input.password')}
          secureTextEntry={true}
          iconFamily={'FontAwesome'}
          onChangeText={e => setPassword(e)}
        />
        {wrongPassword && (
          <Text style={styles.wrongInput}>{t('wrongPassword')}</Text>
        )}
        <Text style={styles.forgetSentence}>{t('forget')}</Text>

        <Button title={t('loginBtn')} onPress={loginSubmit} />

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
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.registerTitle}>{t('registerTitle')}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
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
    width: 320,
    height: 48,
    borderRadius: 7,
    fontSize: FontSize.regular,
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: Colors.lightGray,
    marginTop: 20,
  },
  forgetSentence: {
    width: 320,
    fontSize: FontSize.tiny,
    color: Colors.DarkGray,
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
    fontSize: FontSize.regular,
    color: Colors.white,
  },
  registerTitle: {
    fontSize: FontSize.small,
    color: Colors.DarkGray,
  },
  wrongInput: {
    color: '#FF8585',
    fontSize: FontSize.tiny,
    width: 320,
  },
});

export default Login;
