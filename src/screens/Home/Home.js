import { View, StyleSheet, Text, Modal, Pressable } from 'react-native';
import MapView from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { useState, useEffect } from 'react';
import GpsAlert from '../../components/Content/GpsAlert';
import { Colors } from '../../theme/Variables';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
const Home = ({ navigation }) => {
  const [gpsPermission, setGpsPermission] = useState(false);
  const [image, setImage] = useState([]);
  const openCamera = async () => {
    let result = await launchCamera({
      mediaType: 'mixed',
      quality: 1,
      includeBase64: true,
    });
    console.log(result);
    let tmp = image;
    tmp.push('data:image/png;base64,' + result.assets[0].base64);
    setImage(tmp);
    // setImage('data:image/png;base64,' + result.assets[0].base64);
    // 캔슬할 때 에러 처리
  };

  const upload = async () => {
    await openCamera();
    navigation.navigate('Upload', { images: tmp });
  };

  useEffect(() => {
    Geolocation.getCurrentPosition(
      position => {
        console.log('Current Position:', position);
      },
      error => {
        console.log('Error:', error);
        setGpsPermission(true);
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }, []);

  return (
    <View style={styles.container}>
      <View
        style={{
          width: 60,
          height: 60,
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          marginLeft: '50%',
          marginRight: '50%',
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Pressable style={styles.uploadBtn} onPress={upload}>
          <Text> upload </Text>
        </Pressable>
      </View>
      <MapView
        style={styles.map}
        region={{
          latitude: 37.556487,
          longitude: 126.92347,
          latitudeDelta: 0.0035,
          longitudeDelta: 0.0035,
        }}
      />

      <Modal visible={gpsPermission} animationType={'fade'} transparent={true}>
        <GpsAlert />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  map: {
    flex: 1,
  },
  uploadBtn: {
    width: 60,
    height: 60,
    backgroundColor: Colors.lightGray,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
