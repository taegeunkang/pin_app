import { useTranslation } from 'react-i18next';
import {
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  Pressable,
  Text,
  Modal,
  TouchableOpacity,
} from 'react-native';
import { BorderRadius, Colors, FontSize } from '../../theme/Variables';
import Icon from 'react-native-vector-icons/FontAwesome';
import Button from '../../theme/components/login/Button';
import { check_email } from '../../utils/email';
import { useEffect, useState, useLayoutEffect } from 'react';
import { password_test } from '../../utils/password';
import { API_URL } from '../../utils/constants';
import BackAlert from '../../components/Register/BackAlert';
const Register = ({ navigation }) => {
  const { t } = useTranslation('register');
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
  const [nickname, setNickname] = useState('');
  const [nicknameDuplicate, setNicknameDuplicate] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitable, setSubmitable] = useState(false);
  const [policyCheck, setPolicyCheck] = useState(false);
  const [marketingCheck, setMarketingCheck] = useState(false);
  const [backButton, setBackButton] = useState(false);
  const [modlaVisible, setModalVisible] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            setBackButton(true);
            setModalVisible(true);
          }}
          style={{
            backgroundColor: Colors.transparent,
            width: 60,
            height: 30,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View>
            <Icon name="chevron-left" size={18} color={Colors.black} />
          </View>
        </TouchableOpacity>
      ),
    });
  });

  const password_reg_check = e => {
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

  const nickname_check = async e => {
    inpt = String(e).toLowerCase();
    setNickname(inpt);

    if (inpt == '') {
      setNicknameDuplicate(false);
    } else {
      let response = await fetch(
        API_URL + '/user/nickname/duplicate?nickname=' + e,
        { method: 'GET' },
      );
      if (response['status'] == 200) {
        setNicknameDuplicate(false);
      } else {
        response = await response.json();
        switch (response['code']) {
          case 'U07':
            setNicknameDuplicate(true);
            break;
        }
      }
    }

    return true;
  };

  const verify_code = async () => {
    let response = await fetch(
      API_URL + '/email/verify?email=' + email + '&key=' + code,
      { method: 'GET' },
    );

    if (response['status'] == 200) {
      setVerified(true);
    } else {
      response = await response.json();
      console.log(response);
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

  const count_time = () => {
    time = '';

    minutes = Math.floor(remianTime / 60);
    if (minutes < 10) minutes = '0' + minutes;

    seconds = Math.floor(remianTime % 60, 2);
    if (seconds < 10) seconds = '0' + seconds;

    time = minutes + ':' + seconds;
    return time;
  };

  const send_email = async () => {
    if (check_email(email)) {
      let response = await fetch(API_URL + '/email/send?email=' + email, {
        method: 'GET',
      });
      let status = response['status'];
      response = await response.json();
      if (status == 200) {
        let timestamp = Date.parse(response['expiredDate']);
        let expiredDate = new Date(timestamp);
        let now = new Date();
        let remain = (expiredDate.getTime() - now.getTime()) / 1000;
        setRemainTime(remain);
        setSent(true);
      } else {
        switch (response['code']) {
          case 'E06':
            alert(t('error.sent'));
            break;
        }
      }
    } else {
      setWrongReg(true);
    }
  };

  const password_repeat_check = e => {
    setPasswordRepeat(e);

    if (e == password || e == '') {
      setPasswordCorrect(true);
    } else {
      setPasswordCorrect(false);
    }
  };

  const submit = async () => {
    if (
      !nicknameDuplicate &&
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
          nickname: nickname,
        }),
      });

      if (response['status'] == 200) {
        alert('회원가입 완료');
        // 다시 로그인 화면으로
        navigation.navigate('Login');
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
  const go_back = () => {
    setModalVisible(false);
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

  return (
    <ScrollView style={styles.container}>
      {backButton && (
        <Modal visible={modlaVisible} animationType={'fade'} transparent={true}>
          <BackAlert cancle={cancle} go_back={go_back} />
        </Modal>
      )}
      <View style={styles.contentsBox}>
        <TextInput
          style={[styles.inputBox, wrongReg && !sent ? styles.wrongInput : {}]}
          value={email}
          onChangeText={e => setEmail(e)}
          placeholder={t('input.email')}
        />
        {/* 이메일 형식이 아닌 경우 */}
        {wrongReg && !sent && (
          <View style={{ width: 320, alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.red }}>{t('input.wrongEmail')}</Text>
          </View>
        )}
        <Button title={t('button.email')} onPress={send_email} />

        {/* 인증코드 확인  */}
        {sent && (
          <View style={{ width: 320, marginTop: 20, marginBottom: 10 }}>
            <View style={{ alignItems: 'flex-start' }}>
              <Text style={{ color: '#828282' }}>{t('verify.title')}</Text>
            </View>
            <View
              style={[
                {
                  width: 320,
                  height: 48,
                  borderRadius: BorderRadius.medium,
                  flexDirection: 'row',
                  backgroundColor: verified ? 'gray' : Colors.transparent,
                },
                (wrongCode || expired) && !verified ? styles.wrongInput : {},
              ]}
            >
              <TextInput
                style={{
                  width: '65%',
                  paddingLeft: 10,
                  paddingRight: 5,
                }}
                placeholder={t('verify.placeholder')}
                keyboardType="numeric"
                value={code}
                onChangeText={e => setCode(e)}
                maxLength={6}
                editable={verified ? false : true}
              />
              <View
                style={{
                  backgroundColor: Colors.transparent,
                  width: '35%',
                  flexDirection: 'row',
                }}
              >
                <View
                  style={{
                    width: '40%',
                    heigh: '100%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: '#FF8585' }}>
                    {!verified ? count_time(remianTime) : ''}
                  </Text>
                </View>
                <Pressable
                  style={{
                    width: '60%',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  onPress={verify_code}
                >
                  <View
                    style={{
                      width: '80%',
                      height: '80%',
                      borderRadius: BorderRadius.small,
                      backgroundColor: Colors.DarkGray,
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: FontSize.tiny,
                    }}
                  >
                    {!verified ? (
                      <Text style={{ color: Colors.white }}>
                        {t('verify.verifyButton')}
                      </Text>
                    ) : (
                      <Text style={{ color: Colors.white }}>
                        {t('verify.complete')}
                      </Text>
                    )}
                  </View>
                </Pressable>
              </View>
            </View>
            {/* 인증코드 불일치시 텍스트 표시 */}
            {wrongCode && !verified && (
              <View>
                <Text style={{ color: Colors.red, marginBottom: 5 }}>
                  {t('verify.wrongCode')}
                </Text>
              </View>
            )}
            {expired && !wrongCode && !verified && (
              <View>
                <Text style={{ color: Colors.red, marginBottom: 5 }}>
                  {t('verify.expired')}
                </Text>
              </View>
            )}
            {!expired && !wrongCode && alreadyVerified && !verified && (
              <View>
                <Text style={{ color: Colors.red, marginBottom: 5 }}>
                  {t('verify.exist')}
                </Text>
              </View>
            )}
            <View style={{ alignItems: 'flex-start', flexDirection: 'row' }}>
              <Text style={{ color: '#828282' }}>{t('verify.resend')}</Text>

              <Pressable style={{ marginLeft: 10 }} onPress={send_email}>
                <Text style={{ color: '#828282' }}>
                  {t('verify.resendButton')}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        <View style={{ marginTop: 20 }}></View>
        <TextInput
          style={[styles.inputBox, wrongPasswordReg ? styles.wrongInput : {}]}
          placeholder={t('input.password')}
          value={password}
          onChangeText={password_reg_check}
          secureTextEntry={true}
        />
        {wrongPasswordReg && (
          <View style={{ width: 320, alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.red, marginBottom: 5 }}>
              {t('input.passwordRule')}
            </Text>
          </View>
        )}
        <TextInput
          style={styles.inputBox}
          placeholder={t('input.passwordRepeat')}
          value={passwordRepeat}
          onChangeText={password_repeat_check}
          secureTextEntry={true}
        />
        {!passwordCorrect && (
          <View style={{ width: 320, alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.red, marginBottom: 5 }}>
              {t('input.notCorrect')}
            </Text>
          </View>
        )}

        <TextInput
          style={[styles.inputBox, nicknameDuplicate ? styles.wrongInput : {}]}
          placeholder={t('input.nickname')}
          value={nickname}
          onChangeText={nickname_check}
        />
        {nicknameDuplicate && (
          <View style={{ width: 320, alignItems: 'flex-start' }}>
            <Text style={{ color: Colors.red, marginBottom: 5 }}>
              {t('input.duplicateNickname')}
            </Text>
          </View>
        )}
        <View style={styles.checkBox}>
          <Pressable
            style={[
              styles.checkButton,
              policyCheck ? { backgroundColor: Colors.DarkGray } : {},
            ]}
            onPress={() => setPolicyCheck(!policyCheck)}
          >
            <Icon name="check" size={12} color={Colors.white} />
          </Pressable>
          <Pressable>
            <Text style={{ fontSize: FontSize.small }}>
              {t('check.policy')}
            </Text>
          </Pressable>
        </View>

        <View style={styles.checkBox}>
          <Pressable
            style={[
              styles.checkButton,
              marketingCheck ? { backgroundColor: Colors.DarkGray } : {},
            ]}
            onPress={() => setMarketingCheck(!marketingCheck)}
          >
            <Icon name="check" size={12} color={Colors.white} />
          </Pressable>
          <Pressable>
            <Text style={{ fontSize: FontSize.small }}>
              {t('check.marketing')}
            </Text>
          </Pressable>
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title={t('button.register')} onPress={submit} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.white },
  contentsBox: {
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  inputBox: {
    width: 320,
    height: 48,
    backgroundColor: Colors.lightGray,
    borderRadius: BorderRadius.medium,
    fontSize: FontSize.regular,
    paddingLeft: 10,
    paddingRight: 10,
    marginBottom: 15,
  },
  emailRequestButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 7,
    width: 320,
    height: 60,
    elevation: 3,
    marginTop: 15,
    backgroundColor: Colors.DarkGray,
  },
  emailRequestText: {
    fontSize: FontSize.regular,
    color: Colors.white,
  },
  submitButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 7,
    width: 320,
    height: 60,
    elevation: 3,
    marginTop: 15,
    backgroundColor: Colors.DarkGray,
  },
  submitText: {
    fontSize: FontSize.regular,
    color: Colors.white,
  },
  checkButton: {
    width: 25,
    height: 25,
    backgroundColor: Colors.lightGray,
    borderWidth: 0.3,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  checkBox: {
    width: 320,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: 20,
  },

  wrongInput: {
    borderWidth: 1,
    borderColor: Colors.red,
  },
});

export default Register;
