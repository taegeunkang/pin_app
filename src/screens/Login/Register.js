import {useTranslation} from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  Dimensions,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../theme/Variables';
import {check_email as checkEmail} from '../../utils/email';
import {useEffect, useState, useLayoutEffect, useRef} from 'react';
import {password_test} from '../../utils/password';
import {API_URL} from '../../utils/constants';
import BackAlert from '../../components/Register/BackAlert';
import InputBox from '../../components/InputBox';
import SubmitButton2 from '../../components/SubmitButton2';
import SubmitButton from '../../components/SubmitButton';
import {useTheme} from '../../hooks';

import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import HeaderLeftButton from '../../components/HeaderLeftButton';
const Register = ({navigation}) => {
  const {Fonts, Images, Colors} = useTheme();
  const {t} = useTranslation('register');
  const [email, setEmail] = useState('');
  const [wrongReg, setWrongReg] = useState(false);
  const [remianTime, setRemainTime] = useState(180);
  const [verified, setVerified] = useState(false);
  const [code, setCode] = useState('');
  const [wrongCode, setWrongCode] = useState(false);
  const [alreadyVerified, setAlreadyVerified] = useState(false);
  const [expired, setExpired] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordRepeat, setPasswordRepeat] = useState('');
  const [wrongPasswordReg, setWrongPasswordReg] = useState(false);
  const [passwordCorrect, setPasswordCorrect] = useState(true);
  const [sent, setSent] = useState(false);
  const [policyCheck, setPolicyCheck] = useState(false);
  const [marketingCheck, setMarketingCheck] = useState(false);
  const [backButton, setBackButton] = useState(false);
  const [modlaVisible, setModalVisible] = useState(false);
  const [resendAvailable, setResendAvailable] = useState(true);
  const [sendingEmail, setSendingEmail] = useState(false);

  const {height} = Dimensions.get('window');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <HeaderLeftButton
          onPress={() => {
            setBackButton(true);
            setModalVisible(true);
          }}
        />
      ),
    });
  });

  const passwordRegCheck = e => {
    setPassword(e);
    // 패스워드 정규식
    if (e == '') {
      setWrongPasswordReg(false);
    } else if (!password_test(e)) {
      setWrongPasswordReg(true);
    } else {
      setWrongPasswordReg(false);
    }
  };

  const verifyCode = async () => {
    let response = await fetch(
      API_URL + '/email/verify?email=' + email + '&key=' + code,
      {method: 'GET'},
    );

    if (response['status'] == 200) {
      setWrongCode(false);
      setAlreadyVerified(false);
      setExpired(false);
      setVerified(true);
    } else {
      response = await response.json();
      switch (response['code']) {
        case 'E07':
          setExpired(false);
          setAlreadyVerified(false);
          setWrongCode(true);
          break;
        case 'E05':
          setExpired(false);
          setWrongCode(false);
          setAlreadyVerified(true);
          break;
        case 'E03':
          setWrongCode(false);
          setAlreadyVerified(false);
          setExpired(true);
          break;
      }
    }
  };

  const countTime = () => {
    time = '';

    minutes = Math.floor(remianTime / 60);
    if (minutes < 0) minutes = 0;
    if (minutes < 10) minutes = '0' + minutes;

    seconds = Math.floor(remianTime % 60, 2);
    if (seconds < 0) seconds = 0;
    if (seconds < 10) seconds = '0' + seconds;

    time = minutes + ':' + seconds;
    return time;
  };
  // 이메일을 전송한지 1분이 지나지 않았다면 재전송 불가
  const checkEmailResendAvailable = () => {
    let r = countTime(remianTime);
    let min = r.substring(0, 2);
    if (parseInt(min) >= 2) {
      return false;
    }
    return true;
  };

  const sendEmail = async () => {
    if (checkEmail(email) && sent && !checkEmailResendAvailable()) {
      setResendAvailable(false);
      return;
    }
    setResendAvailable(true);
    if (checkEmail(email)) {
      // 이메일 형식이 맞다면
      setWrongReg(false);
      setSendingEmail(true);
      let response = await fetch(API_URL + '/email/send?email=' + email, {
        method: 'GET',
      });
      let status = response['status'];
      response = await response.json();

      setSendingEmail(false);
      if (status == 200) {
        let timestamp = Date.parse(response['expiredDate']);
        let expiredDate = new Date(timestamp);
        let now = new Date();
        let remain = (expiredDate.getTime() - now.getTime()) / 1000;
        setRemainTime(remain);
        setSent(true);
        setWrongCode(false);
        setAlreadyVerified(false);
        setExpired(false);
        setCode('');
      } else {
        switch (response['code']) {
          case 'E06':
            alert(t('error.sent'));
            break;
          case 'E05':
            alert('이미 가입된 이메일입니다.');
        }
      }
    } else {
      setWrongReg(true);
    }
  };

  const passwordRepeatCheck = e => {
    setPasswordRepeat(e);

    if (e == password || e == '') {
      setPasswordCorrect(true);
    } else {
      setPasswordCorrect(false);
    }
  };

  const submit = async () => {
    if (
      verified &&
      passwordCorrect &&
      policyCheck &&
      marketingCheck &&
      password.length > 0
    ) {
      let response = await fetch(API_URL + '/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          emailAddress: email,
          password: password,
        }),
      });

      if (response['status'] == 200) {
        // 다시 로그인 화면으로
        navigation.navigate('Congraturation');
      } else {
        response = await response.json();

        switch (response['code']) {
          case 'U06':
            alert('사용자가 존재합니다.');
            break;
          case 'U07':
            alert('닉네임이 존재합니다.');
            break;
        }
      }
    } else {
      alert('회원가입 정보를 입력해주세요.');
    }
  };

  const cancle = () => {
    setModalVisible(false);
  };
  const goBack = () => {
    setModalVisible(false);
    setVerified(false);
    navigation.goBack();
  };

  useEffect(() => {
    if (sent) {
      let timer = setTimeout(() => {
        if (remianTime > 0) setRemainTime(remianTime - 1);
      }, 1000);

      return () => {
        clearTimeout(timer);
      };
    }
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
      flexDirection: 'column',
    },
    contentsBox: {
      alignItems: 'center',
      width: '100%',
      marginTop: responsiveHeight(10),
    },
    checkBox: {
      width: responsiveWidth(370),
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-start',
      marginTop: responsiveHeight(20),
    },

    wrongInput: {
      borderWidth: 1,
      borderColor: Colors.warn,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      {backButton && (
        <Modal visible={modlaVisible} animationType={'fade'} transparent={true}>
          <BackAlert cancle={cancle} go_back={goBack} />
        </Modal>
      )}
      <View style={{marginTop: responsiveHeight(10)}} />
      <View style={styles.contentsBox}>
        <InputBox
          title={'이메일'}
          placeholder={t('input.email')}
          onChangeText={e => setEmail(e.toLowerCase())}
          value={email}
          isWrong={wrongReg && !sent}
          editable={verified}
        />

        {/* 이메일 형식이 아닌 경우 */}
        {wrongReg && !sent && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              marginTop: responsiveHeight(5),
              height: responsiveHeight(15),
            }}>
            <Text
              style={[
                Fonts.contentRegualrMedium,
                {
                  color: Colors.warn,
                },
              ]}>
              {t('input.wrongEmail')}
            </Text>
          </View>
        )}
        {!wrongReg && (
          <View
            style={{
              height: responsiveHeight(15),
              marginTop: responsiveHeight(5),
            }}
          />
        )}

        <View style={{marginBottom: 10}} />
        {!verified ? (
          <SubmitButton2
            onPress={sendEmail}
            title={!sent ? t('button.email') : t('button.resend')}
            loading={sendingEmail}
          />
        ) : (
          <View
            style={{
              width: responsiveWidth(370),
              height: responsiveHeight(48),
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: Colors.buttonSecondBackground,
              borderRadius: responsiveWidth(12),
              flexDirection: 'row',
            }}>
            <Text
              style={[
                Fonts.contentMediumBold,
                {
                  color: Colors.buttonSecondContent,
                },
              ]}>
              {t('verify.complete')}
            </Text>
          </View>
        )}
        {!resendAvailable && (
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
              {t('error.sentResent')}
            </Text>
          </View>
        )}
        <View style={{marginBottom: responsiveHeight(10)}} />

        {/* 인증코드 확인  */}
        {sent && (
          <>
            <View
              style={{
                width: responsiveWidth(370),
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
              }}>
              <View>
                <View
                  style={[
                    {
                      width: responsiveWidth(310),
                      height: responsiveHeight(26),
                      backgroundColor: Colors.contentBackground,
                    },
                  ]}>
                  <Text style={[Fonts.inputHeader, {color: Colors.textBold}]}>
                    {'인증코드 입력'}
                  </Text>
                </View>

                <View
                  style={[
                    {
                      width: responsiveWidth(310),
                      height: responsiveHeight(48),
                      borderRadius: responsiveWidth(12),
                      backgroundColor: Colors.inputBackground,
                      color: Colors.inputContent,
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: responsiveWidth(10),
                    },
                    expired || wrongCode || alreadyVerified
                      ? {
                          borderWidth: responsiveWidth(1),
                          borderColor: Colors.red,
                        }
                      : {},
                  ]}>
                  <TextInput
                    placeholder={t('verify.placeholder')}
                    placeholderTextColor={Colors.inputPlaceHolder}
                    style={{flex: 1, backgroundColor: Colors.inputBackground}}
                    onChangeText={e => setCode(e)}
                    keyboardType="numeric"
                    value={code}
                    maxLength={6}
                    editable={!verified}
                  />
                  <Text
                    style={{
                      fontFamily: 'SpoqaHanSansNeo-Medium',
                      color: '#E44949',
                      fontSize: responsiveWidth(12),
                      lineHeight: responsiveHeight(18),
                      letterSpacing: responsiveWidth(-0.6),
                    }}>
                    {!verified ? countTime(remianTime) : ''}
                  </Text>
                </View>
              </View>
              {!verified ? (
                <SubmitButton2
                  onPress={verifyCode}
                  title={t('verify.verifyButton')}
                  width={50}
                  height={50}
                />
              ) : (
                <View
                  style={{
                    width: responsiveWidth(50),
                    height: responsiveHeight(50),
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#4880EE',
                    borderRadius: responsiveWidth(12),
                    flexDirection: 'row',
                  }}>
                  <Image
                    source={Images.confirmed}
                    style={{
                      width: responsiveWidth(35),
                      height: responsiveHeight(35),
                    }}
                  />
                </View>
              )}
            </View>
            {expired && (
              <View
                style={{
                  width: responsiveWidth(370),
                  alignItems: 'flex-start',
                  marginTop: responsiveHeight(5),
                  height: responsiveHeight(20),
                }}>
                <Text
                  style={{
                    fontFamily: 'SpoqaHanSansNeo-Medium',
                    color: '#E44949',
                    fontSize: responsiveWidth(12),
                    lineHeight: responsiveHeight(18),
                    letterSpacing: responsiveWidth(-0.6),
                  }}>
                  {t('verify.expired')}
                </Text>
              </View>
            )}
            {wrongCode && (
              <View
                style={{
                  width: responsiveWidth(370),
                  alignItems: 'flex-start',
                  marginTop: responsiveHeight(5),
                  height: responsiveHeight(20),
                }}>
                <Text
                  style={{
                    fontFamily: 'SpoqaHanSansNeo-Medium',
                    color: '#E44949',
                    fontSize: responsiveWidth(12),
                    lineHeight: responsiveHeight(18),
                    letterSpacing: responsiveWidth(-0.6),
                  }}>
                  {t('verify.wrongCode')}
                </Text>
              </View>
            )}
            {alreadyVerified && (
              <View
                style={{
                  width: responsiveWidth(370),
                  alignItems: 'flex-start',
                  marginTop: responsiveHeight(5),
                  height: responsiveHeight(20),
                }}>
                <Text
                  style={{
                    fontFamily: 'SpoqaHanSansNeo-Medium',
                    color: '#E44949',
                    fontSize: responsiveWidth(12),
                    lineHeight: responsiveHeight(18),
                    letterSpacing: responsiveWidth(-0.6),
                  }}>
                  {t('verify.exist')}
                </Text>
              </View>
            )}
            {!expired && !wrongCode && !alreadyVerified && (
              <View style={{height: responsiveHeight(20)}} />
            )}
          </>
        )}

        <View style={{marginBottom: responsiveHeight(10)}} />
        <InputBox
          title={'비밀번호'}
          placeholder={t('input.password')}
          onChangeText={passwordRegCheck}
          value={password}
          passwordInvisible={true}
          isWrong={wrongPasswordReg}
        />
        {wrongPasswordReg && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              height: responsiveHeight(20),
              // backgroundColor: 'black',
            }}>
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
              {t('input.passwordRule')}
            </Text>
          </View>
        )}
        {!wrongPasswordReg && <View style={{height: responsiveHeight(20)}} />}

        <View style={{marginBottom: responsiveHeight(10)}} />
        <InputBox
          title={'비밀번호 재입력'}
          placeholder={t('input.passwordRepeat')}
          onChangeText={passwordRepeatCheck}
          value={passwordRepeat}
          passwordInvisible={true}
          isWrong={!passwordCorrect}
        />
        {!passwordCorrect && (
          <View
            style={{
              width: responsiveWidth(370),
              alignItems: 'flex-start',
              height: responsiveHeight(20),
            }}>
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
              {t('input.notCorrect')}
            </Text>
          </View>
        )}
        {passwordCorrect && <View style={{height: responsiveHeight(20)}} />}

        {/* <View style={{marginBottom: responsiveHeight(10)}} /> */}
        <View style={styles.checkBox}>
          {policyCheck ? (
            <Pressable onPress={() => setPolicyCheck(!policyCheck)}>
              <Image
                source={Images.checkSelect}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveHeight(25),
                }}
              />
            </Pressable>
          ) : (
            <Pressable onPress={() => setPolicyCheck(!policyCheck)}>
              <Image
                source={Images.checkNotSelect}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveHeight(25),
                }}
              />
            </Pressable>
          )}

          <View style={{marginRight: responsiveWidth(10)}} />
          <Pressable>
            <Text
              style={[
                Fonts.contentMediumMedium,
                {color: Colors.inputPlaceHolder},
              ]}>
              {t('check.policy')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.checkBox}>
          {marketingCheck ? (
            <Pressable onPress={() => setMarketingCheck(!marketingCheck)}>
              <Image
                source={Images.checkSelect}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveHeight(25),
                }}
              />
            </Pressable>
          ) : (
            <Pressable onPress={() => setMarketingCheck(!marketingCheck)}>
              <Image
                source={Images.checkNotSelect}
                style={{
                  width: responsiveWidth(25),
                  height: responsiveHeight(25),
                }}
              />
            </Pressable>
          )}

          <View style={{marginRight: responsiveWidth(10)}} />
          <Pressable>
            <Text
              style={[
                Fonts.contentMediumMedium,
                {color: Colors.inputPlaceHolder},
              ]}>
              {t('check.marketing')}
            </Text>
          </Pressable>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}>
        <SubmitButton onPress={submit} title={t('button.register')} />
      </View>
      <View style={{marginTop: responsiveHeight(20)}} />
    </SafeAreaView>
  );
};

export default Register;
