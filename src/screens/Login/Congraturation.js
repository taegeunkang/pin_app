import {View, StyleSheet, Text} from 'react-native';
import {Colors} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';

const Congraturation = ({navigation}) => {
  const {t} = useTranslation('register');
  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{t('complete.title')}</Text>
        <Text style={styles.sub}>{t('complete.subTitle')}</Text>
      </View>
      <View style={styles.btn}>
        <SubmitButton
          title={t('complete.return')}
          onPress={() => navigation.navigate('Login')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBox: {
    flex: 9,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'SpoqaHanSansNeo-Bold',
    fontSize: 36,
    lineHeight: 46,
    letterSpacing: -0.6,
    color: '#353C49',
  },
  sub: {
    fontFamily: 'SpoqaHanSansNeo-Medium',
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: -0.6,
  },
  btn: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 50,
  },
});

export default Congraturation;
