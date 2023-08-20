import {
  View,
  StyleSheet,
  Text,
  Pressable,
  SafeAreaView,
  Animated,
  Image,
  Platform,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {responsiveHeight, responsiveWidth} from '../../components/Scale';
import {useTheme} from '../../hooks';
import {useState, useEffect} from 'react';
import InactiveButton from '../../components/Content/InactiveButton';
import ActiveButton from '../../components/Content/ActiveButton';
import {request, check, PERMISSIONS, RESULTS} from 'react-native-permissions';
const Permission = ({close}) => {
  const {t} = useTranslation('content');
  const {Fonts, Images} = useTheme();
  const [permissions, setPermissions] = useState({
    photo: false,
    location: false,
  });

  // const getCameraPermission = async () => {
  //   if (Platform.OS == 'ios') {
  //     const result = await request(PERMISSIONS.IOS.CAMERA);
  //     setPermissions({...permissions, camera: result == RESULTS.GRANTED});
  //   } else {
  //     const result = await request(PERMISSIONS.ANDROID.CAMERA);
  //     setPermissions({...permissions, camera: result == RESULTS.GRANTED});
  //   }
  // };
  const getAlbumPermission = async () => {
    if (Platform.OS == 'ios') {
      const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      setPermissions({...permissions, photo: result == RESULTS.GRANTED});
    } else {
      const result = await request(PERMISSIONS.ANDROID.PHOTO_LIBRARY);
      setPermissions({...permissions, photo: result == RESULTS.GRANTED});
    }
    modalClose();
  };
  const getLocationPermission = async () => {
    if (Platform.OS == 'ios') {
      const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS);
      setPermissions({...permissions, location: result == RESULTS.GRANTED});
    } else {
      const result = await request(PERMISSIONS.ANDROID.LOCATION_ALWAYS);
      setPermissions({...permissions, location: result == RESULTS.GRANTED});
    }
    modalClose();
  };

  // const getMicrophonePermission = async () => {
  //   if (Platform.OS == 'ios') {
  //     const result = await request(PERMISSIONS.IOS.MICROPHONE);
  //     setPermissions({...permissions, microphone: result == RESULTS.GRANTED});
  //   } else {
  //     const result = await request(PERMISSIONS.ANDROID.LOCATION_ALWAYS);
  //     setPermissions({...permissions, microphone: result == RESULTS.GRANTED});
  //   }
  // };

  // const checkPermissions = async () => {
  //   console.log('?');
  //   if (Platform.OS == 'ios') {
  //     // const camera = await check(PERMISSIONS.IOS.CAMERA);
  //     // const microphone = await check(PERMISSIONS.IOS.MICROPHONE);
  //     const photo = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
  //     const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS); // 혹은 LOCATION_ALWAYS

  //     setPermissions({
  //       // camera: camera === RESULTS.GRANTED,
  //       // microphone: microphone === RESULTS.GRANTED,
  //       photo: photo === RESULTS.GRANTED,
  //       location: location === RESULTS.GRANTED,
  //     });
  //   } else {
  //     // const camera = await check(PERMISSIONS.ANDROID.CAMERA);
  //     // const microphone = await check(PERMISSIONS.ANDROID.MICROPHONE);
  //     const photo = await check(PERMISSIONS.ANDROID.PHOTO_LIBRARY);
  //     const location = await check(PERMISSIONS.ANDROID.LOCATION_ALWAYS); // 혹은 LOCATION_ALWAYS

  //     setPermissions({
  //       // camera: camera === RESULTS.GRANTED,
  //       // microphone: microphone === RESULTS.GRANTED,
  //       photo: photo === RESULTS.GRANTED,
  //       location: location === RESULTS.GRANTED,
  //     });
  //   }
  // };

  const modalClose = async () => {
    const photo = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
    const location = await check(PERMISSIONS.IOS.LOCATION_ALWAYS);
    const locationUsage = await check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (
      photo == RESULTS.GRANTED &&
      (location == RESULTS.GRANTED || locationUsage == RESULTS.GRANTED)
    ) {
      close();
    }
  };

  useEffect(() => {
    // checkPermissions();
    // modalClose();
  }, []);
  return (
    <SafeAreaView style={styles.container}>
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
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}>
        {permissions.photo == false ? (
          <ActiveButton
            title={'앨범 읽기/쓰기 허용'}
            onPress={getAlbumPermission}
          />
        ) : (
          <InactiveButton title={'앨범 읽기/쓰기 허용'} />
        )}
        {/* <ActiveButton
          title={'카메라 엑세스 허용'}
          onPress={getCameraPermission}
        />
        <InactiveButton
          title={'마이크 엑세스 허용'}
          onPress={getMicrophonePermission}
        /> */}
        <View style={{marginTop: responsiveHeight(10)}} />
        {permissions.location == false ? (
          <ActiveButton
            title={'GPS 엑세스 허용'}
            onPress={getLocationPermission}
          />
        ) : (
          <InactiveButton title={'GPS 엑세스 허용'} />
        )}
        <View style={{marginTop: responsiveHeight(20)}} />
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

export default Permission;
