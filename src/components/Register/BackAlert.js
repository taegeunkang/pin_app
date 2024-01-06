import {View, StyleSheet, Text, Pressable} from 'react-native';
import {BorderRadius, Colors, FontSize} from '../../theme/Variables';
import {useTranslation} from 'react-i18next';
import SubmitButton4 from '../SubmitButton4';
import SubmitButton from '../SubmitButton';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme} from '../../hooks';
const BackAlert = ({cancle, go_back}) => {
  const {t} = useTranslation('register');
  const {Fonts, Colors} = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0, 0.3)',
      justifyContent: 'flex-end',
    },
    popUp: {
      width: '100%',
      height: '35%',
      backgroundColor: Colors.contentBackground,
      borderTopLeftRadius: BorderRadius.xLarge,
      borderTopRightRadius: BorderRadius.xLarge,
    },
    content: {
      paddingVertical: responsiveHeight(20),
      paddingHorizontal: responsiveWidth(20),
    },
    buttonContainer: {
      flex: 1,
      backgroundColor: Colors.transparent,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'flex-end',
      marginBottom: responsiveHeight(50),
      paddingHorizontal: responsiveWidth(10),
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.popUp}>
        <View style={styles.content}>
          <Text
            style={[
              Fonts.contentMediumBold,
              {
                marginBottom: responsiveHeight(20),
                color: Colors.textBold,
                marginTop: responsiveHeight(10),
              },
            ]}>
            {t('back.title')}
          </Text>
          <Text
            style={[
              Fonts.contentMediumMedium,
              {
                color: Colors.textNormal,
              },
            ]}>
            {t('back.detail')}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <SubmitButton4
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

export default BackAlert;
