import {View, StyleSheet, Text} from 'react-native';
import {Colors} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import {useTheme} from '../../hooks';
import SubmitButton from '../../components/SubmitButton';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';

const Congraturation = ({navigation}) => {
  const {t} = useTranslation('register');
  const {Colors, Fonts} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: Colors.contentBackground,
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
      fontSize: responsiveWidth(36),
      lineHeight: responsiveHeight(46),
      letterSpacing: -responsiveWidth(0.6),
      color: Colors.textBold,
    },

    btn: {
      flex: 1,
      justifyContent: 'flex-end',
      marginBottom: responsiveHeight(50),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleBox}>
        <Text style={styles.title}>{t('complete.title')}</Text>
        <Text style={Fonts.contentMediumMedium}>{t('complete.subTitle')}</Text>
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

export default Congraturation;
