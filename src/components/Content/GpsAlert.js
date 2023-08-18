import {
  View,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  Animated,
  Image,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveHeight, responsiveWidth} from '../Scale';
import {useTheme, useState} from '../../hooks';
import InactiveButton from './InactiveButton';
import ActiveButton from './ActiveButton';
const GpsAlert = ({onPress}) => {
  const {t} = useTranslation('content');
  const {Fonts, Images} = useTheme();
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{
          width: '100%',
          alignItems: 'flex-end',
          marginTop: responsiveHeight(10),
        }}>
        <Pressable onPress={onPress}>
          <Image
            source={Images.close}
            style={{
              width: responsiveWidth(20),
              height: responsiveHeight(20),
              marginRight: responsiveWidth(10),
            }}
          />
        </Pressable>
      </View>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          flex: 1,
        }}>
        <Text style={[Fonts.contentLargeBold]}>Pin 이용에 필요한 기능을</Text>
        <Text style={[Fonts.contentLargeBold]}>허용해 주세요.</Text>
      </View>

      <View
        style={{
          width: '100%',
          height: responsiveHeight(230),
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <ActiveButton
          title={'앨범 읽기/쓰기 허용'}
          onPress={() => console.log('active')}
        />
        <ActiveButton
          title={'카메라 엑세스 허용'}
          onPress={() => console.log('active')}
        />
        <InactiveButton
          title={'마이크 엑세스 허용'}
          onPress={() => console.log('active')}
        />
        <InactiveButton
          title={'GPS 엑세스 허용'}
          onPress={() => console.log('active')}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'flex-end',
  },
});

export default GpsAlert;
