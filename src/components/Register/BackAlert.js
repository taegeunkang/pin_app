import {View, StyleSheet, Text, Pressable} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import SubmitButton2 from '../SubmitButton2';
import SubmitButton from '../SubmitButton';
const BackAlert = ({cancle, go_back}) => {
  const {t} = useTranslation('register');

  return (
    <View style={styles.container}>
      <View style={styles.popUp}>
        <View style={styles.content}>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Bold',
              fontSize: 16,
              lineHeight: 28,
              letterSpacing: -0.6,
              marginBottom: 20,
              color: '#353C49',
              marginTop: 10,
            }}>
            {t('back.title')}
          </Text>
          <Text
            style={{
              fontFamily: 'SpoqaHanSansNeo-Regular',
              color: '#505866',
              fontSize: 14,
              lineHeight: 20,
              letterSpacing: -0.6,
            }}>
            {t('back.detail')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <SubmitButton2
            onPress={cancle}
            title={t('back.cancel')}
            width={170}
            height={50}
          />
          <SubmitButton
            onPress={go_back}
            title={t('back.go')}
            width={170}
            height={50}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.3)',
    justifyContent: 'flex-end',
  },
  popUp: {
    width: '100%',
    height: '35%',
    backgroundColor: Colors.white,
    borderTopLeftRadius: BorderRadius.xLarge,
    borderTopRightRadius: BorderRadius.xLarge,
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginBottom: 50,
    paddingHorizontal: 10,
  },
  cancle: {
    width: 170,
    height: 60,
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.small,
  },
  goBack: {
    width: 170,
    height: 60,
    borderWidth: 0.2,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.small,
    backgroundColor: Colors.DarkGray,
  },
});

export default BackAlert;
