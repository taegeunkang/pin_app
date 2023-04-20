import { View, StyleSheet, Text, Pressable } from 'react-native';
import { BorderRadius, Colors, FontSize } from '../../theme/Variables';
import { useTranslation } from 'react-i18next';
const GpsAlert = () => {
  const { t } = useTranslation('cotent');

  return (
    <View style={styles.container}>
      <View style={styles.popUp}>
        <View style={styles.content}>
          <Text
            style={{
              fontSize: FontSize.large,
              fontWeight: '800',
              marginBottom: 20,
            }}
          >
            {t('gps.alert')}
          </Text>
        </View>
        {/* <View style={styles.buttonContainer}>
          <Pressable style={styles.cancle} onPress={cancle}>
            <Text>{t('back.cancel')}</Text>
          </Pressable>
          <Pressable style={styles.goBack} onPress={go_back}>
            <Text>{t('back.go')}</Text>
          </Pressable>
        </View> */}
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
    width: '100%',
    height: '55%',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    height: '40%',
    backgroundColor: Colors.transparent,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
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

export default GpsAlert;
